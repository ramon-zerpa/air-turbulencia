import type { AirflowController } from "./airflow";
export function initMotion() {
  const scene = document.querySelector<HTMLElement>("[data-air-scene]");
  const toggle = document.querySelector<HTMLButtonElement>(".motion-toggle");
  if (!scene || !toggle) return;
  const surface = scene.querySelector<HTMLElement>(".scene-surface")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 1100px)",
  );
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
  let pointerX = 0,
    pointerY = 0,
    scrollY = 0,
    queued = 0;
  const abort = new AbortController();
  const animations = new Map<HTMLElement, Animation>();
  const seen = new WeakSet<HTMLElement>();
  const enabled = () => !paused && !reduced.matches && !connection?.saveData;
  function finish(el: HTMLElement) {
    seen.add(el);
    el.dataset.entered = "true";
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
        if (!enabled() || entry.boundingClientRect.top < 0) continue;
        const kind = el.dataset.reveal;
        const frames =
          kind === "image"
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
          duration: kind === "image" ? 780 : 540,
          delay: Math.min(Number(el.dataset.delay) || 0, 300),
          easing: "cubic-bezier(.16,1,.3,1)",
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
  async function sync() {
    document.documentElement.dataset.motion = enabled() ? "running" : "paused";
    toggle!.hidden = reduced.matches || !!connection?.saveData;
    toggle!.setAttribute("aria-pressed", String(paused));
    toggle!.querySelector("span")!.textContent = paused
      ? "Resume animations"
      : "Pause animations";
    if (!enabled()) {
      finishAll();
      engine?.pause();
      surface.style.removeProperty("--scene-x");
      surface.style.removeProperty("--scene-y");
      if (reduced.matches || connection?.saveData) {
        engine?.destroy();
        engine = undefined;
      }
      return;
    }
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
    if (enabled() && visible && fine.matches) {
      surface.style.setProperty("--scene-x", `${pointerX}px`);
      surface.style.setProperty("--scene-y", `${pointerY + scrollY}px`);
    }
  }
  function position() {
    if (!queued) queued = requestAnimationFrame(paintPosition);
  }
  scene.closest(".air-hero")?.addEventListener(
    "pointermove",
    (event) => {
      if (!fine.matches || !enabled()) return;
      const e = event as PointerEvent;
      pointerX = (e.clientX / innerWidth - 0.5) * 12;
      pointerY = (e.clientY / innerHeight - 0.5) * 8;
      position();
    },
    { signal: abort.signal },
  );
  scene.closest(".air-hero")?.addEventListener(
    "pointerleave",
    () => {
      pointerX = pointerY = 0;
      position();
    },
    { signal: abort.signal },
  );
  let previousScroll = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const fast = Math.abs(window.scrollY - previousScroll) > 180;
      previousScroll = window.scrollY;
      if (fast) animations.forEach((_, el) => finish(el));
      scrollY = Math.min(window.scrollY * 0.035, 24);
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
      sceneObserver.disconnect();
      abort.abort();
      cancelAnimationFrame(queued);
      animations.forEach((a) => a.cancel());
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
