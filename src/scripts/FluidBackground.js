/**
 * FluidBackground — Full-screen aurora/plasma shader using domain-warping FBM.
 * Generated with Codex assistance. Requires window.THREE (Three.js) pre-set.
 */
export default class FluidBackground {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('FluidBackground requires a canvas element.');
    if (!window.THREE) throw new Error('FluidBackground requires window.THREE before instantiation.');

    this.THREE = window.THREE;
    this.canvas = canvas;
    this.running = true;
    this.clock = new this.THREE.Clock();
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    this.mouse = new this.THREE.Vector2(0.5, 0.5);
    this.mouseTarget = new this.THREE.Vector2(0.5, 0.5);
    this.mouseVelocity = new this.THREE.Vector2();
    this.mouseStrength = 0;

    this.renderer = new this.THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setClearColor(0x050005, 1);

    this.scene = new this.THREE.Scene();
    this.camera = new this.THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new this.THREE.Vector2(1, 1) },
      uMouse: { value: this.mouse.clone() },
      uMouseVelocity: { value: this.mouseVelocity.clone() },
      uMouseStrength: { value: 0 },
      uFlowScale: { value: options.flowScale ?? 1.0 },
    };

    this.geometry = new this.THREE.PlaneGeometry(2, 2);
    this.material = new this.THREE.ShaderMaterial({
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
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
          // Quintic interpolation for smoother blobs
          vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
          float a = hash(i), b = hash(i + vec2(1,0));
          float c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
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

        // Two palettes that blend based on a slow time-driven shift
        vec3 paletteA(float t) {
          // Violet-dominant: deep space → violet → hot pink → electric cyan
          vec3 base   = vec3(0.015, 0.0, 0.025);
          vec3 c1 = mix(base, vec3(0.55, 0.22, 0.9),  smoothstep(0.08, 0.62, t));
          c1 = mix(c1,  vec3(1.0,  0.0,  0.44), smoothstep(0.46, 0.82, t) * 0.78);
          c1 = mix(c1,  vec3(0.0,  0.86, 1.0),  pow(smoothstep(0.65, 1.0, t), 1.55) * 0.92);
          return c1;
        }

        vec3 paletteB(float t) {
          // Cyan-dominant: dark teal → electric cyan → violet → magenta
          vec3 base   = vec3(0.0,  0.01, 0.03);
          vec3 c2 = mix(base, vec3(0.0,  0.45, 0.75), smoothstep(0.08, 0.60, t));
          c2 = mix(c2,  vec3(0.0,  0.9,  1.0),  smoothstep(0.38, 0.72, t) * 0.88);
          c2 = mix(c2,  vec3(0.75, 0.0,  0.9),  pow(smoothstep(0.60, 1.0, t), 1.7)  * 0.7);
          return c2;
        }

        vec3 paletteC(float t) {
          // Pink-flame: dark → deep magenta → vivid pink → warm white
          vec3 base   = vec3(0.02, 0.0, 0.02);
          vec3 c3 = mix(base, vec3(0.55, 0.0,  0.38), smoothstep(0.08, 0.58, t));
          c3 = mix(c3,  vec3(1.0,  0.0,  0.56), smoothstep(0.40, 0.80, t) * 0.85);
          c3 = mix(c3,  vec3(1.0,  0.72, 1.0),  pow(smoothstep(0.68, 1.0, t), 1.4)  * 0.65);
          return c3;
        }

        vec3 palette(float t, float shift) {
          // shift cycles 0→1 slowly; bell functions peak at 0.5 and 0.85
          float s1 = smoothstep(0.0, 0.5, shift) * (1.0 - smoothstep(0.5, 1.0, shift));
          float s2 = smoothstep(0.33, 0.83, shift) * (1.0 - smoothstep(0.83, 1.0, shift));
          vec3 col  = paletteA(t);
          col       = mix(col, paletteB(t), s1 * 1.2);
          col       = mix(col, paletteC(t), s2 * 1.1);
          return col;
        }

        void main() {
          vec2 uv = vUv;
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 p = (uv - 0.5) * aspect;

          // Slow, majestic time — like loudsrl.com
          float time = uTime * 0.068;

          // Heavy multi-layer domain warping for organic 3D-liquid feel
          vec2 wind = vec2(time * 0.38, sin(time * 1.1) * 0.14);
          vec2 q = vec2(
            fbm(p * 1.8 * uFlowScale + wind),
            fbm(p * 1.8 * uFlowScale - wind + 5.23)
          );
          vec2 r = vec2(
            fbm(p * 2.8 + 4.5 * q + vec2(1.7, 9.2) + time * vec2(0.28, 0.15)),
            fbm(p * 2.8 + 4.5 * q + vec2(8.3, 2.8) - time * vec2(0.18, 0.24))
          );
          // Third warp pass for the liquid-metal depth
          vec2 s = vec2(
            fbm(p * 1.6 + 2.2 * r + vec2(3.1, 5.7) + time * vec2(0.12, -0.09)),
            fbm(p * 1.6 + 2.2 * r + vec2(6.4, 1.2) - time * vec2(0.08, 0.14))
          );

          vec2 warped = p + 1.0 * q + 0.72 * r + 0.38 * s;
          // Subtle high-frequency ripple on surface (specular shimmer)
          warped.x += sin(warped.y * 5.5  + time * 5.8) * 0.07;
          warped.y += sin(warped.x * 4.0  - time * 3.5) * 0.06;

          // Blobby flow — low freq so we get large organic shapes not strands
          float flow = fbm(warped * vec2(1.6, 4.2) + vec2(time * 0.55, -time * 0.18));

          // Smooth blobby shapes (fewer, wider strands vs old aurora)
          float blobs = sin((warped.y + flow * 0.55) * 9.0 + warped.x * 4.5 + time * 6.5);
          blobs = smoothstep(0.05, 1.0, blobs * 0.5 + 0.5);

          float aurora = smoothstep(0.22, 0.88, flow) * blobs;
          // Full-screen (no y-clipping like old aurora bands)
          aurora *= smoothstep(-1.2, 0.9, p.y) * (1.0 - smoothstep(0.45, 1.2, abs(p.y)));

          // Specular-like bright peaks where flow is at maximum
          float specular = pow(max(0.0, flow - 0.58), 2.8) * 1.8;

          // Mouse interaction
          vec2 mouseDelta = (uv - uMouse) * aspect;
          float mouseGlow = exp(-dot(mouseDelta, mouseDelta) * 28.0) * uMouseStrength;
          float mouseWake = fbm((p - uMouseVelocity * 0.1) * 6.0 + time * 2.5) * mouseGlow;

          float energy = aurora + mouseGlow * 0.4 + mouseWake * 0.25 + specular * 0.35;
          energy += pow(max(0.0, flow), 2.8) * 0.22;
          energy = clamp(energy, 0.0, 1.0);

          // Slow color cycle — completes full rotation ~every 40s
          float colorShift = sin(uTime * 0.058) * 0.5 + 0.5;

          vec3 color = palette(energy, colorShift);

          // Specular highlight brightens toward white at peaks
          vec3 specColor = mix(vec3(0.7, 0.5, 1.0), vec3(0.9, 0.8, 1.0), colorShift);
          color += specColor * specular * 0.28;

          color += vec3(0.0, 0.5, 1.0) * mouseGlow * 0.2;
          color += vec3(1.0, 0.0, 0.45) * mouseWake * 0.12;

          // Vignette — deep edges pull to near-black for depth
          float vignette = smoothstep(1.25, 0.12, length((uv - 0.5) * vec2(1.3, 1.0)));
          color *= vignette;

          // Very dark base so only fluid blooms are visible (loudsrl approach)
          color += vec3(0.012, 0.0, 0.018) * 0.35;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    this.mesh = new this.THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onResize = this.resize.bind(this);
    this.render = this.render.bind(this);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    this.resize();
    this.render();
  }

  onPointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
    this.mouseTarget.set(Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1));
    this.mouseStrength = 0.45;
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.uniforms.uResolution.value.set(width * this.pixelRatio, height * this.pixelRatio);
  }

  render() {
    if (!this.running) return;
    // Delta-time smoothing — frame-rate independent lerp
    const delta = this.clock.getDelta();
    const smooth = 1.0 - Math.pow(0.915, delta * 60.0);
    const prev = this.mouse.clone();
    this.mouse.lerp(this.mouseTarget, smooth);
    this.mouseVelocity.copy(this.mouse).sub(prev).multiplyScalar(18);
    this.mouseStrength *= Math.pow(0.91, delta * 60.0);
    this.uniforms.uTime.value = this.clock.elapsedTime;
    this.uniforms.uMouse.value.copy(this.mouse);
    this.uniforms.uMouseVelocity.value.copy(this.mouseVelocity);
    this.uniforms.uMouseStrength.value = this.mouseStrength;
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.render);
  }

  destroy() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
