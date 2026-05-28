export default class NodeNetworkBackground {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('NodeNetworkBackground requires a canvas element.');

    this.THREE = window.THREE;
    this.canvas = canvas;

    this.config = {
      nodeCount: options.nodeCount ?? 80,
      nodeColor: options.nodeColor ?? 0x10b981,
      lineColor: options.lineColor ?? 0x10b981,
      accentColor: options.accentColor ?? 0xf472b6,
      nodeRadiusMin: options.nodeRadiusMin ?? 2,
      nodeRadiusMax: options.nodeRadiusMax ?? 3.5,
      connectionDistance: options.connectionDistance ?? 160,
      bounds: options.bounds ?? { x: 500, y: 300, z: 280 },
      driftSpeed: options.driftSpeed ?? 0.18,
      mouseRadius: options.mouseRadius ?? 140,
      mouseForce: options.mouseForce ?? 0.03,
      cameraZ: options.cameraZ ?? 420,
      pixelRatio: options.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2),
    };

    this.nodes = [];
    this.mouse = { active: false, x: 0, y: 0, world: null, lastMove: 0 };
    this.clock = null;
    this.frame = null;
    this.disposed = false;

    this._init();
    this._bind();
    this.resize();
    this.start();
  }

  _init() {
    const THREE = this.THREE;
    const { nodeCount, nodeColor, bounds, cameraZ } = this.config;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(this.config.pixelRatio);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.Fog(0x000000, 300, 800);

    this.camera = new THREE.PerspectiveCamera(55, 1, 1, 1400);
    this.camera.position.set(0, 0, cameraZ);
    this.camera.lookAt(0, 0, 0);

    this.mouse.world = new THREE.Vector3();

    const sphereGeo = new THREE.SphereGeometry(1, 10, 7);
    const sphereMat = new THREE.MeshBasicMaterial({ color: nodeColor, fog: true });
    this.nodeMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, nodeCount);
    this.nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.nodeMesh);

    // Add a few accent colored nodes
    const accentGeo = new THREE.SphereGeometry(1, 10, 7);
    const accentMat = new THREE.MeshBasicMaterial({ color: this.config.accentColor, fog: true });
    this.accentMesh = new THREE.InstancedMesh(accentGeo, accentMat, 8);
    this.accentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.accentMesh);

    const maxSegs = (nodeCount * (nodeCount - 1)) / 2;
    this.linePositions = new Float32Array(maxSegs * 6);
    this.lineColors = new Float32Array(maxSegs * 6);

    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    this.lineGeo.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    this.lineGeo.setDrawRange(0, 0);

    this.lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: true,
    });

    this.lines = new THREE.LineSegments(this.lineGeo, this.lineMat);
    this.scene.add(this.lines);

    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        position: new THREE.Vector3(
          this._rand(-bounds.x, bounds.x),
          this._rand(-bounds.y, bounds.y),
          this._rand(-bounds.z, bounds.z)
        ),
        velocity: new THREE.Vector3(
          this._rand(-1, 1),
          this._rand(-1, 1),
          this._rand(-1, 1)
        ).normalize().multiplyScalar(this._rand(0.15, 0.5)),
        radius: this._rand(this.config.nodeRadiusMin, this.config.nodeRadiusMax),
        phase: Math.random() * Math.PI * 2,
        pulse: this._rand(0.5, 1.3),
        isAccent: i < 8,
      });
    }

    this.dummy = new THREE.Object3D();
    this.emeraldColor = new THREE.Color(nodeColor);
    this.pinkColor = new THREE.Color(this.config.accentColor);
    this.clock = { start: performance.now(), last: performance.now(), elapsed: 0 };
  }

  _bind() {
    this._onResize = this.resize.bind(this);
    this._onMove = this._onPointerMove.bind(this);
    this._onLeave = () => { this.mouse.active = false; };

    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('pointermove', this._onMove, { passive: true });
    window.addEventListener('pointerleave', this._onLeave, { passive: true });
  }

  _onPointerMove(e) {
    if (e.pointerType === 'touch') return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.mouse.x = (e.clientX / w) * 2 - 1;
    this.mouse.y = -((e.clientY / h) * 2 - 1);
    this.mouse.active = true;
    this.mouse.lastMove = performance.now();
    this._projectMouse();
  }

  _projectMouse() {
    const THREE = this.THREE;
    const v = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera);
    const dir = v.sub(this.camera.position).normalize();
    const t = -this.camera.position.z / dir.z;
    this.mouse.world.copy(this.camera.position).add(dir.multiplyScalar(t));
  }

  resize() {
    const w = this.canvas.parentElement?.clientWidth || window.innerWidth;
    const h = this.canvas.parentElement?.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.frame) return;
    this._tick();
  }

  stop() {
    if (this.frame) { cancelAnimationFrame(this.frame); this.frame = null; }
  }

  destroy() {
    this.stop();
    this.disposed = true;
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerleave', this._onLeave);
    this.nodeMesh.geometry.dispose();
    this.nodeMesh.material.dispose();
    this.accentMesh.geometry.dispose();
    this.accentMesh.material.dispose();
    this.lineGeo.dispose();
    this.lineMat.dispose();
    this.renderer.dispose();
  }

  _tick() {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(() => this._tick());

    const now = performance.now();
    const delta = Math.min((now - this.clock.last) / 1000, 0.05);
    this.clock.elapsed = (now - this.clock.start) / 1000;
    this.clock.last = now;

    this._updateNodes(delta);
    this._updateInstances();
    this._updateLines();

    this.scene.rotation.y = Math.sin(this.clock.elapsed * 0.04) * 0.04;
    this.scene.rotation.x = Math.cos(this.clock.elapsed * 0.03) * 0.02;

    this.renderer.render(this.scene, this.camera);
  }

  _updateNodes(delta) {
    const { bounds, driftSpeed, mouseRadius, mouseForce } = this.config;
    const elapsed = this.clock.elapsed;
    const mouseActive = this.mouse.active && performance.now() - this.mouse.lastMove < 2000;

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const ph = elapsed * n.pulse + n.phase;

      // Gentle drift
      n.velocity.x += Math.sin(ph * 0.7) * 0.0025;
      n.velocity.y += Math.cos(ph * 0.85) * 0.0022;
      n.velocity.z += Math.sin(ph * 0.55) * 0.002;

      // Mouse influence
      if (mouseActive) {
        const dx = n.position.x - this.mouse.world.x;
        const dy = n.position.y - this.mouse.world.y;
        const dz = n.position.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < mouseRadius * mouseRadius && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const inf = (1 - dist / mouseRadius) ** 2;
          const repel = 1;
          n.velocity.x += (dx / dist) * inf * mouseForce * repel;
          n.velocity.y += (dy / dist) * inf * mouseForce * repel;
          // Swirl
          n.velocity.x += -(dy / dist) * inf * mouseForce * 0.3;
          n.velocity.y += (dx / dist) * inf * mouseForce * 0.3;
        }
      }

      // Speed limit
      const maxSpeed = driftSpeed * 4;
      const speed = n.velocity.length();
      if (speed > maxSpeed) n.velocity.multiplyScalar(maxSpeed / speed);

      n.position.addScaledVector(n.velocity, delta * 60);
      n.velocity.multiplyScalar(0.993);

      // Bounce
      (['x', 'y', 'z']).forEach(axis => {
        const lim = bounds[axis];
        if (n.position[axis] > lim) { n.position[axis] = lim; n.velocity[axis] *= -0.85; }
        if (n.position[axis] < -lim) { n.position[axis] = -lim; n.velocity[axis] *= -0.85; }
      });
    }
  }

  _updateInstances() {
    const elapsed = this.clock.elapsed;
    let accentIdx = 0;
    let mainIdx = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const depth = 0.4 + (n.position.z + this.config.bounds.z) / (this.config.bounds.z * 2) * 0.6;
      const scale = n.radius * (0.88 + Math.sin(elapsed * 1.1 + n.phase) * 0.1) * depth;

      this.dummy.position.copy(n.position);
      this.dummy.scale.setScalar(scale);
      this.dummy.updateMatrix();

      if (n.isAccent && accentIdx < 8) {
        this.accentMesh.setMatrixAt(accentIdx++, this.dummy.matrix);
      } else {
        this.nodeMesh.setMatrixAt(mainIdx++, this.dummy.matrix);
      }
    }

    this.nodeMesh.instanceMatrix.needsUpdate = true;
    this.accentMesh.instanceMatrix.needsUpdate = true;
  }

  _updateLines() {
    const nodes = this.nodes;
    const maxDist = this.config.connectionDistance;
    const maxDistSq = maxDist * maxDist;
    let ptr = 0, verts = 0;

    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i].position;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j].position;
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq > maxDistSq) continue;

        const dist = Math.sqrt(dSq);
        const alpha = (1 - dist / maxDist) ** 1.8;
        const depthA = 0.4 + (a.z + this.config.bounds.z) / (this.config.bounds.z * 2) * 0.6;
        const depthB = 0.4 + (b.z + this.config.bounds.z) / (this.config.bounds.z * 2) * 0.6;
        const intensity = alpha * (depthA + depthB) * 0.5;

        // Mix emerald + occasional pink for accent connections
        const useAccent = nodes[i].isAccent || nodes[j].isAccent;
        const c = useAccent ? this.pinkColor : this.emeraldColor;
        const r = c.r * intensity, g = c.g * intensity, bl = c.b * intensity;

        this.linePositions[ptr] = a.x; this.linePositions[ptr+1] = a.y; this.linePositions[ptr+2] = a.z;
        this.linePositions[ptr+3] = b.x; this.linePositions[ptr+4] = b.y; this.linePositions[ptr+5] = b.z;
        this.lineColors[ptr] = r; this.lineColors[ptr+1] = g; this.lineColors[ptr+2] = bl;
        this.lineColors[ptr+3] = r; this.lineColors[ptr+4] = g; this.lineColors[ptr+5] = bl;

        ptr += 6; verts += 2;
      }
    }

    this.lineGeo.setDrawRange(0, verts);
    this.lineGeo.attributes.position.needsUpdate = true;
    this.lineGeo.attributes.color.needsUpdate = true;
  }

  _rand(min, max) { return min + Math.random() * (max - min); }
}
