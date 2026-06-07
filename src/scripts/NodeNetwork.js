import * as THREE from 'three';

export default class NodeNetworkBackground {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('NodeNetworkBackground requires a canvas element.');

    this.canvas = canvas;
    this.config = {
      nodeCount: options.nodeCount ?? 180,
      radius: options.radius ?? (window.innerWidth < 720 ? 138 : 214),
      nodeColor: options.nodeColor ?? 0x2f8cff,
      lineColor: options.lineColor ?? 0x1976ff,
      accentColor: options.accentColor ?? 0x8b5cf6,
      starCount: options.starCount ?? (window.innerWidth < 720 ? 180 : 360),
      pixelRatio: options.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2),
    };

    this.frame = 0;
    this.running = false;
    this.disposed = false;
    this.pointer = new THREE.Vector2(0, 0);
    this.clock = new THREE.Clock();

    this._init();
    this._bind();
    this.resize();
  }

  _init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(this.config.pixelRatio);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, 1, 1, 1400);
    this.camera.position.set(0, 0, 560);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this._createStars();
    this._createGlobe();
  }

  _createStars() {
    const positions = new Float32Array(this.config.starCount * 3);
    const colors = new Float32Array(this.config.starCount * 3);
    const palette = [
      new THREE.Color(0x39d7ff),
      new THREE.Color(0x7dd3fc),
      new THREE.Color(0xf472b6),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xa7f3d0),
    ];

    for (let i = 0; i < this.config.starCount; i++) {
      const i3 = i * 3;
      positions[i3] = THREE.MathUtils.randFloatSpread(1100);
      positions[i3 + 1] = THREE.MathUtils.randFloatSpread(760);
      positions[i3 + 2] = THREE.MathUtils.randFloat(-520, -80);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.scene.add(this.stars);
  }

  _createGlobe() {
    const { radius, nodeCount, nodeColor, lineColor, accentColor } = this.config;
    const blue = new THREE.Color(lineColor);
    const violet = new THREE.Color(accentColor);

    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.28, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x1d4ed8,
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
      })
    );
    this.root.add(aura);

    const glass = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.72, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.root.add(glass);

    this.wire = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 22, 16),
      new THREE.MeshBasicMaterial({
        color: lineColor,
        wireframe: true,
        transparent: true,
        opacity: 0.46,
        blending: THREE.AdditiveBlending,
      })
    );
    this.root.add(this.wire);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.03, 1.7, 8, 160),
      new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = Math.PI / 2;
    this.root.add(ring);

    const points = [];
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const point = new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      );
      points.push(point);
      point.toArray(nodePositions, i * 3);

      const color = i % 17 === 0 ? violet : blue;
      nodeColors[i * 3] = color.r;
      nodeColors[i * 3 + 1] = color.g;
      nodeColors[i * 3 + 2] = color.b;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
    this.nodes = new THREE.Points(
      nodeGeometry,
      new THREE.PointsMaterial({
        size: window.innerWidth < 720 ? 3.2 : 4.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.94,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.root.add(this.nodes);

    const linePositions = [];
    const lineColors = [];
    const maxDistance = radius * 0.33;
    for (let i = 0; i < points.length - 1; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = points[i].distanceTo(points[j]);
        if (distance > maxDistance) continue;
        points[i].toArray(linePositions, linePositions.length);
        points[j].toArray(linePositions, linePositions.length);

        const intensity = 1 - distance / maxDistance;
        const color = i % 17 === 0 || j % 17 === 0 ? violet : blue;
        for (let k = 0; k < 2; k++) {
          lineColors.push(color.r * intensity, color.g * intensity, color.b * intensity);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    this.lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.86,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.root.add(this.lines);

    this.glow = { aura, glass, ring };
  }

  _bind() {
    this._onResize = this.resize.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('pointermove', this._onPointerMove, { passive: true });
  }

  _onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  }

  resize() {
    const width = this.canvas.parentElement?.clientWidth || window.innerWidth;
    const height = this.canvas.parentElement?.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const scale = width < 720 ? 0.88 : Math.min(1.12, Math.max(0.92, width / 1280));
    this.root.scale.setScalar(scale);
    this.root.position.x = width < 820 ? 0 : width * -0.14;
  }

  resume() {
    this.start();
  }

  pause() {
    this.stop();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.start();
    this._tick();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  destroy() {
    this.stop();
    this.disposed = true;
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onPointerMove);
    this.scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) object.material.dispose();
    });
    this.renderer.dispose();
  }

  _tick() {
    if (!this.running || this.disposed) return;
    this.frame = requestAnimationFrame(() => this._tick());

    const elapsed = this.clock.getElapsedTime();
    this.root.rotation.y = elapsed * 0.12 + this.pointer.x * 0.12;
    this.root.rotation.x = Math.sin(elapsed * 0.18) * 0.08 + this.pointer.y * 0.06;
    this.wire.rotation.y = -elapsed * 0.09;
    this.wire.rotation.x = elapsed * 0.04;
    this.glow.ring.rotation.z = elapsed * 0.14;
    this.glow.glass.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.025);
    this.stars.rotation.y = elapsed * 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}
