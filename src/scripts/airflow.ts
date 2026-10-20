export interface AirflowController {
  start(): void;
  pause(): void;
  resume(): void;
  resize(): void;
  destroy(): void;
}
const vertex = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main(){v_uv=a_position;gl_Position=vec4(a_position.x*2.-1.,1.-a_position.y*2.,0.,1.);}`;
const clothVertex = `#version 300 es
in vec2 a_position;out vec2 v_uv;uniform float u_time;uniform float u_strength;
void main(){v_uv=a_position;vec2 p=a_position;float anchor=pow(p.y,1.7)*smoothstep(.7,.85,p.x);p.x+=sin(p.y*10.-u_time*1.05)*.018*anchor*u_strength;p.y=p.y*.8+sin(p.x*18.+u_time*.85)*.006*anchor*u_strength;gl_Position=vec4(p.x*2.-1.,1.-p.y*2.,0.,1.);}`;
const clothFragment = `#version 300 es
precision mediump float;in vec2 v_uv;uniform sampler2D u_texture;out vec4 color;
void main(){color=texture(u_texture,v_uv);}`;
const airFragment = `#version 300 es
precision highp float;in vec2 v_uv;out vec4 color;uniform float u_time;uniform float u_strength;uniform float u_lanes;
void main(){vec2 p=v_uv;float s=(p.y-.18)/.67;float alpha=0.;float edge=smoothstep(0.,.08,s)*(1.-smoothstep(.7,1.,s));
for(int i=0;i<3;i++){float f=float(i);if(f>=u_lanes)break;
float center=.81-.31*s+.10*sin(s*3.14159)+f*.025*s+sin(s*9.-u_time*.35+f)*.008*s;
float width=mix(.0018,.0065,clamp(s,0.,1.))*(1.+f*.2);
float dist=abs(p.x-center);float line=1.-smoothstep(width,width*3.,dist);
float flow=.35+.65*pow(.5+.5*sin(s*24.-u_time*(1.25+f*.22)+f*1.8),2.);
alpha+=line*flow*edge*.42;
}
vec3 tint=mix(vec3(.55,.72,.75),vec3(.99,1.,.99),.93);color=vec4(tint,min(alpha,.68)*u_strength);
}`;

export async function createAirflow(
  scene: HTMLElement,
): Promise<AirflowController> {
  const canvas = scene.querySelector<HTMLCanvasElement>("canvas")!;
  const surface = scene.querySelector<HTMLElement>(".scene-surface")!;
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    premultipliedAlpha: true,
  });
  if (!gl) throw new Error("WebGL2 unavailable");
  let disposed = false,
    failed = false,
    active = false,
    raf = 0,
    last = 0,
    elapsed = 0,
    lastDraw = 0,
    frameCount = 0,
    sampleStart = 0,
    slowSamples = 0,
    quality = 0,
    mobileViewport = innerWidth < 768;
  let clothProgram: WebGLProgram | null = null,
    airProgram: WebGLProgram | null = null,
    texture: WebGLTexture | null = null;
  const buffers: WebGLBuffer[] = [];
  const abort = new AbortController();
  function compile(type: number, source: string) {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    return shader;
  }
  function program(v: string, f: string) {
    const p = gl!.createProgram()!;
    const vs = compile(gl!.VERTEX_SHADER, v),
      fs = compile(gl!.FRAGMENT_SHADER, f);
    gl!.attachShader(p, vs);
    gl!.attachShader(p, fs);
    gl!.linkProgram(p);
    gl!.deleteShader(vs);
    gl!.deleteShader(fs);
    if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
      gl!.deleteProgram(p);
      throw new Error("Airflow shader unavailable");
    }
    return p;
  }
  function buffer(data: Float32Array) {
    const b = gl!.createBuffer()!;
    buffers.push(b);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, b);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
    return b;
  }
  function pause() {
    active = false;
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    scene.dataset.running = "false";
  }
  function fallback() {
    failed = true;
    pause();
    scene.dataset.state = "fallback";
    surface.style.removeProperty("--scene-x");
    surface.style.removeProperty("--scene-y");
  }
  function destroy() {
    if (disposed) return;
    disposed = true;
    pause();
    abort.abort();
    observer.disconnect();
    buffers.forEach((b) => gl!.deleteBuffer(b));
    gl!.deleteTexture(texture);
    gl!.deleteProgram(clothProgram);
    gl!.deleteProgram(airProgram);
    scene.dataset.state = "static";
  }
  function resize() {
    if (disposed || failed) return;
    const r = surface.getBoundingClientRect();
    mobileViewport = innerWidth < 768;
    const dpr =
      Math.min(devicePixelRatio, mobileViewport ? 1 : 1.5, Math.sqrt(400000 / (r.width * r.height))) * (quality > 0 ? 0.65 : 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    gl!.viewport(0, 0, canvas.width, canvas.height);
  }
  const observer = new ResizeObserver(resize);
  try {
    clothProgram = program(clothVertex, clothFragment);
    airProgram = program(vertex, airFragment);
    // Shade only the airflow area; transparent left-side pixels need no GPU work.
    const quad = buffer(new Float32Array([.48,.17,.93,.17,.48,.86,.48,.86,.93,.17,.93,.86]));
    const mesh: number[] = [];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 24; x++) {
        const a = .74 + x / 24 * .26,
          b = y / 16,
          c = .74 + (x + 1) / 24 * .26,
          d = (y + 1) / 16;
        mesh.push(a, b, c, b, a, d, a, d, c, b, c, d);
      }
    const clothBuffer = buffer(new Float32Array(mesh));
    const clothPos = gl.getAttribLocation(clothProgram, "a_position"),
      airPos = gl.getAttribLocation(airProgram, "a_position");
    const ct = gl.getUniformLocation(clothProgram, "u_time"),
      cs = gl.getUniformLocation(clothProgram, "u_strength");
    const at = gl.getUniformLocation(airProgram, "u_time"),
      as = gl.getUniformLocation(airProgram, "u_strength"),
      al = gl.getUniformLocation(airProgram, "u_lanes");
    const img = new Image();
    img.src = canvas.dataset.texture!;
    await img.decode();
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA,
    );
    function bind(p: WebGLProgram, b: WebGLBuffer, pos: number) {
      gl!.useProgram(p);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, b);
      gl!.enableVertexAttribArray(pos);
      gl!.vertexAttribPointer(pos, 2, gl!.FLOAT, false, 0, 0);
    }
    function draw() {
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      const strength = Math.min(elapsed / 1.1, 1);
      bind(airProgram!, quad, airPos);
      gl!.uniform1f(at, elapsed);
      gl!.uniform1f(as, strength);
      gl!.uniform1f(al, mobileViewport || quality > 1 ? 2 : 3);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      bind(clothProgram!, clothBuffer, clothPos);
      gl!.uniform1f(ct, elapsed);
      gl!.uniform1f(cs, strength);
      gl!.drawArrays(gl!.TRIANGLES, 0, mesh.length / 2);
    }
    function tick(now: number) {
      if (!active || disposed || failed) return;
      raf = requestAnimationFrame(tick);
      const target = mobileViewport ? 24 : 30;
      if (now - lastDraw < 1000 / target - 2) return;
      if (last) elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      lastDraw = now;
      draw();
      frameCount++;
      if (!sampleStart) sampleStart = now;
      if (now - sampleStart > 4000) {
        const fps = (frameCount * 1000) / (now - sampleStart);
        scene.dataset.fps = String(Math.round(fps));
        slowSamples = fps < target * 0.7 ? slowSamples + 1 : 0;
        frameCount = 0;
        sampleStart = now;
        if (slowSamples >= 2) {
          quality++;
          scene.dataset.quality = String(quality);
          slowSamples = 0;
          resize();
          if (quality > 3) fallback();
        }
      }
    }
    function resume() {
      if (active || disposed || failed) return;
      active = true;
      last = 0;
      sampleStart = 0;
      frameCount = 0;
      scene.dataset.running = "true";
      raf = requestAnimationFrame(tick);
    }
    canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        fallback();
      },
      { signal: abort.signal },
    );
    observer.observe(surface);
    resize();
    draw();
    scene.dataset.state = "ready";
    return { start: resume, pause, resume, resize, destroy };
  } catch (error) {
    destroy();
    scene.dataset.state = "fallback";
    throw error;
  }
}
