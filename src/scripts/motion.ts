import type { AirflowController } from "./airflow";
export function initMotion() {
  const scene = document.querySelector<HTMLElement>("[data-air-scene]");
  const toggle = document.querySelector<HTMLButtonElement>(".motion-toggle");
  if (!scene || !toggle) return;
  const surface = scene.querySelector<HTMLElement>(".scene-surface")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const desktopParallax = matchMedia("(min-width: 1100px)");
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  let paused = false;
  try {
    paused = sessionStorage.getItem("air-motion-paused") === "true";
  } catch {}
  let engine: AirflowController | undefined,
    loading = false,
    visible = true,
    destroyed = false,
    failed = false;
  let scrollY = 0,
    queued = 0;
  const abort = new AbortController();
  const animations = new Map<HTMLElement, Animation>();
  const pausedAnimations = new Set<Animation>();
  const seen = new WeakSet<HTMLElement>();
  const titleHeadings = Array.from(
    document.querySelectorAll<HTMLElement>("[data-title-flow]"),
  );
  const visibleTitleHeadings = new Set<HTMLElement>();
  const enabled = () => !paused && !reduced.matches && !connection?.saveData;
  function syncTitleFlows() {
    for (const heading of titleHeadings) {
      const visible = visibleTitleHeadings.has(heading) && !document.hidden;
      heading.dataset.flowVisible = String(visible);
      if (enabled() && visible) heading.dataset.flowReady = "true";
      else if (reduced.matches || connection?.saveData) {
        delete heading.dataset.flowReady;
      }
    }
  }
  function pauseActiveAnimations() {
    for (const animation of document.getAnimations()) {
      if (
        animation instanceof CSSAnimation &&
        animation.animationName === "title-airflow-flow"
      ) continue;
      if (animation.playState === "running" || animation.pending) {
        animation.pause();
        pausedAnimations.add(animation);
      }
    }
  }
  function resumeActiveAnimations() {
    for (const animation of pausedAnimations) {
      if (animation.playState === "paused") animation.play();
    }
    pausedAnimations.clear();
  }
  function markStaticMotion(el: HTMLElement) {
    el.closest<HTMLElement>(".process-steps li")?.setAttribute("data-motion-static", "");
  }
  function finish(el: HTMLElement) {
    seen.add(el);
    el.dataset.entered = "true";
    if (!enabled()) markStaticMotion(el);
    animations.get(el)?.finish();
    animations.delete(el);
  }
  function finishAll() {
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(finish);
  }
  const entrances = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        entrances.unobserve(el);
        if (seen.has(el)) continue;
        seen.add(el);
        el.dataset.entered = "true";
        if (!enabled()) {
          markStaticMotion(el);
          continue;
        }
        if (entry.boundingClientRect.top < 0) continue;
        const kind = el.dataset.reveal;
        const compactPhoto = matchMedia("(max-width: 767px)").matches;
        const frames =
          kind === "photo"
            ? [
                {
                  opacity: 0,
                  transform: compactPhoto
                    ? "translate3d(0, 38px, 0) scale(.88) rotate(-3deg)"
                    : "translate3d(0, 60px, 0) scale(.8) rotate(-5deg)",
                },
                {
                  opacity: 1,
                  transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
                },
              ]
            : kind === "image"
            ? [
                {
                  opacity: 0.45,
                  clipPath: "inset(0 0 9% 0)",
                  transform: "translateY(20px)",
                },
                { opacity: 1, clipPath: "inset(0)", transform: "none" },
              ]
            : [
                {
                  opacity: 0.25,
                  transform:
                    kind === "side" ? "translateX(-22px)" : "translateY(22px)",
                },
                { opacity: 1, transform: "none" },
              ];
        const anim = el.animate(frames, {
          duration: kind === "photo" ? 1150 : kind === "image" ? 780 : 540,
          delay: Math.min(Number(el.dataset.delay) || 0, 300),
          easing: kind === "photo" ? "cubic-bezier(.2,.8,.2,1)" : "cubic-bezier(.16,1,.3,1)",
          fill: "none",
        });
        animations.set(el, anim);
        anim.onfinish = () => animations.delete(el);
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll<HTMLElement>("[data-reveal]")
    .forEach((el) => entrances.observe(el));
  const titleFlows = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const heading = entry.target as HTMLElement;
        if (entry.isIntersecting) visibleTitleHeadings.add(heading);
        else visibleTitleHeadings.delete(heading);
      }
      syncTitleFlows();
    },
    { threshold: 0.01 },
  );
  titleHeadings.forEach((heading) => titleFlows.observe(heading));
  async function sync() {
    document.documentElement.dataset.motion = enabled() ? "running" : "paused";
    syncTitleFlows();
    toggle!.hidden = reduced.matches || !!connection?.saveData;
    toggle!.setAttribute("aria-pressed", String(paused));
    toggle!.querySelector("span")!.textContent = paused
      ? "Resume animations"
      : "Pause animations";
    if (!enabled()) {
      if (paused && !reduced.matches && !connection?.saveData) {
        pauseActiveAnimations();
      } else {
        finishAll();
      }
      engine?.pause();
      surface.style.removeProperty("--scene-y");
      if (reduced.matches || connection?.saveData) {
        engine?.destroy();
        engine = undefined;
      }
      return;
    }
    resumeActiveAnimations();
    if (!visible || document.hidden) {
      engine?.pause();
      return;
    }
    if (!engine && !loading && !failed) {
      loading = true;
      try {
        const photo = scene!.querySelector<HTMLImageElement>(".room-image");
        await photo?.decode();
        if (!enabled() || destroyed) return;
        const { createAirflow } = await import("./airflow");
        if (!enabled() || destroyed) return;
        engine = await createAirflow(scene!);
        if (destroyed || !enabled()) {
          engine.destroy();
          engine = undefined;
          return;
        }
      } catch {
        failed = true;
        scene!.dataset.state = "fallback";
      } finally {
        loading = false;
      }
    }
    if (enabled() && visible && !document.hidden) engine?.resume();
  }
  toggle.addEventListener(
    "click",
    () => {
      paused = !paused;
      try {
        sessionStorage.setItem("air-motion-paused", String(paused));
      } catch {}
      void sync();
    },
    { signal: abort.signal },
  );
  reduced.addEventListener("change", () => void sync(), {
    signal: abort.signal,
  });
  document.addEventListener("visibilitychange", () => void sync(), {
    signal: abort.signal,
  });
  const sceneObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      void sync();
    },
    { threshold: 0 },
  );
  sceneObserver.observe(scene);
  function paintPosition() {
    queued = 0;
    if (enabled() && visible && desktopParallax.matches) {
      surface.style.setProperty("--scene-y", `${scrollY}px`);
    }
  }
  function position() {
    if (!queued) queued = requestAnimationFrame(paintPosition);
  }
  let previousScroll = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.scrollY;
      const fast = Math.abs(currentScroll - previousScroll) > 180;
      previousScroll = currentScroll;
      if (fast) animations.forEach((_, el) => finish(el));
      scrollY = Math.min(currentScroll * 0.035, 24);
      if (visible) position();
    },
    { passive: true, signal: abort.signal },
  );
  document.addEventListener(
    "focusin",
    (event) => {
      if (event.target instanceof Element) {
        let el = event.target.closest<HTMLElement>("[data-reveal]");
        while (el) {
          finish(el);
          el = el.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
        }
      }
    },
    { signal: abort.signal },
  );
  window.addEventListener(
    "hashchange",
    () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = document
        .getElementById(id)
        ?.closest<HTMLElement>("[data-reveal]");
      if (el) finish(el);
    },
    { signal: abort.signal },
  );
  window.addEventListener(
    "pagehide",
    () => {
      destroyed = true;
      engine?.destroy();
      entrances.disconnect();
      titleFlows.disconnect();
      sceneObserver.disconnect();
      abort.abort();
      cancelAnimationFrame(queued);
      animations.forEach((a) => a.cancel());
      pausedAnimations.clear();
    },
    { once: true },
  );
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      window.removeEventListener("pageshow", onPageShow);
      initMotion();
    }
  };
  window.addEventListener("pageshow", onPageShow);
  void sync();
}
