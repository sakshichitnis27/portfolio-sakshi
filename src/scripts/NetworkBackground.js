export default class NetworkBackground {
  constructor(canvas, options = {}) {
    if (!canvas) throw new Error('NetworkBackground requires a canvas element.');

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {
      density: options.density ?? 0.000075,
      maxParticles: options.maxParticles ?? 105,
      minParticles: options.minParticles ?? 42,
      linkDistance: options.linkDistance ?? 142,
      drift: options.drift ?? 0.24,
    };

    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.running = false;
    this.raf = 0;
    this.last = 0;

    this.resize = this.resize.bind(this);
    this.frame = this.frame.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);

    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = Math.min(
      this.options.maxParticles,
      Math.max(this.options.minParticles, Math.floor(this.width * this.height * this.options.density))
    );

    while (this.particles.length < target) this.particles.push(this.createParticle());
    this.particles.length = target;
  }

  createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.18 + Math.random() * 0.55) * this.options.drift;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
    };
  }

  onPointerMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    this.mouse.active = true;
  }

  onPointerLeave() {
    this.mouse.active = false;
  }

  resume() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.pause();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
  }

  frame(now) {
    if (!this.running) return;
    const delta = Math.min((now - this.last) / 16.67, 2);
    this.last = now;

    this.update(delta, now * 0.001);
    this.draw(now * 0.001);
    this.raf = requestAnimationFrame(this.frame);
  }

  update(delta, time) {
    for (const p of this.particles) {
      p.x += p.vx * delta;
      p.y += p.vy * delta;

      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 30000 && distSq > 1) {
          const push = (1 - distSq / 30000) * 0.035;
          p.vx += (dx / Math.sqrt(distSq)) * push;
          p.vy += (dy / Math.sqrt(distSq)) * push;
        }
      }

      p.vx += Math.sin(time * 0.45 + p.phase) * 0.002;
      p.vy += Math.cos(time * 0.38 + p.phase) * 0.002;
      p.vx *= 0.995;
      p.vy *= 0.995;

      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      if (p.y > this.height + 20) p.y = -20;
    }
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const gradient = ctx.createRadialGradient(
      this.width * 0.52,
      this.height * 0.42,
      0,
      this.width * 0.52,
      this.height * 0.42,
      Math.max(this.width, this.height) * 0.72
    );
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.08)');
    gradient.addColorStop(0.45, 'rgba(5, 30, 45, 0.12)');
    gradient.addColorStop(1, 'rgba(2, 10, 24, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > this.options.linkDistance) continue;

        const alpha = (1 - dist / this.options.linkDistance) * 0.36;
        ctx.strokeStyle = `rgba(72, 220, 238, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const p of this.particles) {
      const glow = 0.5 + Math.sin(time * 1.4 + p.phase) * 0.28;
      ctx.beginPath();
      ctx.fillStyle = `rgba(210, 252, 255, ${0.55 + glow * 0.25})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(34, 211, 238, ${0.08 + glow * 0.08})`;
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
