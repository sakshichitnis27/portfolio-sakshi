const vertexShader = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;
  uniform float uMouseStrength;
  uniform float uFlowScale;

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, amp = 0.52;
    for (int i = 0; i < 7; i++) {
      v += amp * noise(p);
      p = rot(0.48) * p * 1.98 + vec2(13.5, 4.7);
      amp *= 0.48;
    }
    return v;
  }

  // Palette A — Royal Violet → Sapphire Blue → Electric Cyan
  vec3 paletteA(float t) {
    vec3 base = vec3(0.01, 0.005, 0.04);
    vec3 c1 = mix(base, vec3(0.22, 0.08, 0.72), smoothstep(0.08, 0.52, t));          // royal violet
    c1 = mix(c1, vec3(0.06, 0.30, 0.92), smoothstep(0.34, 0.68, t) * 0.88);          // sapphire blue
    c1 = mix(c1, vec3(0.0, 0.82, 1.0),   pow(smoothstep(0.56, 0.92, t), 1.4) * 0.92); // electric cyan
    c1 = mix(c1, vec3(0.80, 0.96, 1.0),  pow(smoothstep(0.82, 1.0,  t), 2.2) * 0.32); // ice white
    return c1;
  }

  // Palette B — Emerald → Liquid Gold (dominant, visible early)
  vec3 paletteB(float t) {
    vec3 base = vec3(0.0, 0.02, 0.01);
    vec3 c2 = mix(base, vec3(0.0, 0.38, 0.28),  smoothstep(0.06, 0.44, t));           // deep emerald
    c2 = mix(c2, vec3(0.04, 0.80, 0.50), smoothstep(0.28, 0.58, t) * 0.88);           // jade / bright emerald
    c2 = mix(c2, vec3(0.94, 0.68, 0.0),  smoothstep(0.42, 0.80, t) * 0.92);           // liquid gold (wide range)
    c2 = mix(c2, vec3(1.0,  0.92, 0.52), pow(smoothstep(0.70, 1.0, t), 1.8) * 0.44); // champagne gold
    return c2;
  }

  // Palette C — Mehroom / Copper / Rose Gold
  vec3 paletteC(float t) {
    vec3 base = vec3(0.04, 0.0, 0.01);
    vec3 c3 = mix(base, vec3(0.52, 0.04, 0.18), smoothstep(0.06, 0.46, t));           // deep mehroom
    c3 = mix(c3, vec3(0.78, 0.20, 0.32), smoothstep(0.30, 0.64, t) * 0.90);           // bright rose
    c3 = mix(c3, vec3(0.90, 0.50, 0.16), smoothstep(0.48, 0.80, t) * 0.86);           // copper / bronze
    c3 = mix(c3, vec3(1.0,  0.82, 0.54), pow(smoothstep(0.70, 1.0, t), 1.6) * 0.44); // rose gold
    return c3;
  }

  vec3 palette(float t, float shift) {
    float s1 = smoothstep(0.0, 0.5, shift) * (1.0 - smoothstep(0.5, 1.0, shift));
    float s2 = smoothstep(0.33, 0.83, shift) * (1.0 - smoothstep(0.83, 1.0, shift));
    vec3 col = paletteA(t);
    col = mix(col, paletteB(t), s1 * 1.2);
    col = mix(col, paletteC(t), s2 * 1.1);
    return col;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    float time = uTime * 0.052;

    vec2 wind = vec2(time * 0.32, sin(time * 0.92) * 0.18);
    vec2 q = vec2(
      fbm(p * 1.55 * uFlowScale + wind),
      fbm(p * 1.55 * uFlowScale - wind + 5.23)
    );
    vec2 r = vec2(
      fbm(p * 2.35 + 5.2 * q + vec2(1.7, 9.2) + time * vec2(0.22, 0.13)),
      fbm(p * 2.35 + 5.2 * q + vec2(8.3, 2.8) - time * vec2(0.15, 0.2))
    );
    vec2 s = vec2(
      fbm(p * 1.35 + 2.75 * r + vec2(3.1, 5.7) + time * vec2(0.1, -0.08)),
      fbm(p * 1.35 + 2.75 * r + vec2(6.4, 1.2) - time * vec2(0.07, 0.12))
    );

    vec2 warped = p + 1.18 * q + 0.9 * r + 0.5 * s;
    warped.x += sin(warped.y * 4.7 + time * 4.4) * 0.1;
    warped.y += sin(warped.x * 3.6 - time * 2.8) * 0.085;

    float flow = fbm(warped * vec2(1.28, 3.35) + vec2(time * 0.42, -time * 0.14));
    float silk = fbm(warped * vec2(3.4, 1.25) - vec2(time * 0.2, time * 0.16));
    float blobs = sin((warped.y + flow * 0.75 + silk * 0.25) * 7.4 + warped.x * 3.6 + time * 4.8);
    blobs = smoothstep(-0.06, 1.0, blobs * 0.5 + 0.5);

    float aurora = smoothstep(0.22, 0.88, flow) * blobs;
    float verticalPresence = 0.72 + 0.28 * smoothstep(-1.25, 0.95, p.y);
    float edgePresence = 1.0 - smoothstep(0.86, 1.48, abs(p.y));
    aurora *= verticalPresence * (0.68 + 0.32 * edgePresence);

    float specular = pow(max(0.0, flow - 0.52), 2.65) * 1.65 + pow(max(0.0, silk - 0.64), 2.3) * 0.58;
    vec2 mouseDelta = (uv - uMouse) * aspect;
    float mouseGlow = exp(-dot(mouseDelta, mouseDelta) * 24.0) * uMouseStrength;
    float mouseWake = fbm((p - uMouseVelocity * 0.14) * 5.2 + time * 2.0) * mouseGlow;

    float energy = 0.045 + aurora * 0.82 + mouseGlow * 0.34 + mouseWake * 0.22 + specular * 0.28;
    energy += pow(max(0.0, flow), 2.55) * 0.18;
    energy = clamp(energy, 0.0, 1.0);

    float colorShift = sin(uTime * 0.058) * 0.5 + 0.5;
    vec3 color = palette(energy, colorShift);
    vec3 specColor = mix(vec3(0.60, 0.88, 1.0), vec3(1.0, 0.86, 0.28), colorShift); // sapphire ↔ gold
    color += specColor * specular * 0.26;
    color += vec3(0.06, 0.35, 1.0) * mouseGlow * 0.18;  // sapphire mouse glow
    color += vec3(0.96, 0.64, 0.06) * mouseWake * 0.12; // gold mouse wake
    color += vec3(0.01, 0.01, 0.02);

    float vignette = smoothstep(1.42, 0.08, length((uv - 0.5) * vec2(1.18, 0.9)));
    color *= (0.56 + 0.34 * vignette);
    color += vec3(0.014, 0.003, 0.022) * 0.46;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default class FluidBackground {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('FluidBackground requires a canvas element.');

    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!this.gl) throw new Error('WebGL is not available.');

    this.running = true;
    this.flowScale = options.flowScale ?? 1.0;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.mouse = [0.5, 0.5];
    this.mouseTarget = [0.5, 0.5];
    this.mouseVelocity = [0, 0];
    this.mouseStrength = 0;

    this.program = this.createProgram(vertexShader, fragmentShader);
    this.locations = this.getLocations();
    this.buffer = this.createBuffer();

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onResize = this.resize.bind(this);
    this.render = this.render.bind(this);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    this.resize();
    this._started = false;
    if (!options.paused) {
      this._started = true;
      this.render(performance.now());
    }
  }

  resume() {
    if (this._started) return;
    this._started = true;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.render(performance.now());
  }

  createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vertex = this.compile(gl.VERTEX_SHADER, vsSource);
    const fragment = this.compile(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Fluid shader link failed: ${error}`);
    }
    return program;
  }

  compile(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Fluid shader compile failed: ${error}`);
    }
    return shader;
  }

  getLocations() {
    const gl = this.gl;
    return {
      aPosition: gl.getAttribLocation(this.program, 'aPosition'),
      uTime: gl.getUniformLocation(this.program, 'uTime'),
      uResolution: gl.getUniformLocation(this.program, 'uResolution'),
      uMouse: gl.getUniformLocation(this.program, 'uMouse'),
      uMouseVelocity: gl.getUniformLocation(this.program, 'uMouseVelocity'),
      uMouseStrength: gl.getUniformLocation(this.program, 'uMouseStrength'),
      uFlowScale: gl.getUniformLocation(this.program, 'uFlowScale'),
    };
  }

  createBuffer() {
    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    );
    return buffer;
  }

  onPointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
    this.mouseTarget[0] = Math.min(Math.max(x, 0), 1);
    this.mouseTarget[1] = Math.min(Math.max(y, 0), 1);
    this.mouseStrength = 0.45;
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderWidth = Math.max(1, Math.round(width * this.pixelRatio));
    const renderHeight = Math.max(1, Math.round(height * this.pixelRatio));

    if (this.canvas.width !== renderWidth || this.canvas.height !== renderHeight) {
      this.canvas.width = renderWidth;
      this.canvas.height = renderHeight;
    }
    this.gl.viewport(0, 0, renderWidth, renderHeight);
  }

  render(now) {
    if (!this.running) return;

    const gl = this.gl;
    const elapsed = (now - this.startTime) / 1000;
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const smooth = 1.0 - Math.pow(0.915, delta * 60.0);
    const prevX = this.mouse[0];
    const prevY = this.mouse[1];
    this.mouse[0] += (this.mouseTarget[0] - this.mouse[0]) * smooth;
    this.mouse[1] += (this.mouseTarget[1] - this.mouse[1]) * smooth;
    this.mouseVelocity[0] = (this.mouse[0] - prevX) * 18;
    this.mouseVelocity[1] = (this.mouse[1] - prevY) * 18;
    this.mouseStrength *= Math.pow(0.91, delta * 60.0);

    this.resize();
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.locations.aPosition);
    gl.vertexAttribPointer(this.locations.aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(this.locations.uTime, elapsed);
    gl.uniform2f(this.locations.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.locations.uMouse, this.mouse[0], this.mouse[1]);
    gl.uniform2f(this.locations.uMouseVelocity, this.mouseVelocity[0], this.mouseVelocity[1]);
    gl.uniform1f(this.locations.uMouseStrength, this.mouseStrength);
    gl.uniform1f(this.locations.uFlowScale, this.flowScale);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    this.raf = requestAnimationFrame(this.render);
  }

  destroy() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
  }
}
