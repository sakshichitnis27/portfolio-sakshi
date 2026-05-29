import * as THREE from 'three';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function hexColor(value, fallback = '#36f4ff') {
  return new THREE.Color(value || fallback);
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
      else child.material.dispose();
    }
  });
}

function createParticles(projects, count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = projects.flatMap((project) => [project.accent, project.accent2, project.marker].filter(Boolean));

  for (let i = 0; i < count; i += 1) {
    const radius = 2.1 + Math.random() * 4.8;
    const angle = Math.random() * Math.PI * 2;
    const lift = (Math.random() - 0.5) * 3.3;
    const depth = (Math.random() - 0.5) * 3.2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = lift;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.42 + depth;

    const color = hexColor(palette[i % palette.length], '#ffffff');
    color.lerp(new THREE.Color('#ffffff'), Math.random() * 0.32);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.026,
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.userData.basePositions = positions.slice();
  return points;
}

function createHub() {
  const group = new THREE.Group();
  const magenta = new THREE.Color('#ff4da6');
  const violet = new THREE.Color('#c77dff');
  const cyan = new THREE.Color('#36f4ff');

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 64, 40),
    new THREE.MeshStandardMaterial({
      color: magenta.clone().lerp(new THREE.Color('#ffffff'), 0.18),
      emissive: magenta,
      emissiveIntensity: 1.2,
      roughness: 0.12,
      metalness: 0.22,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
  );
  group.add(core);

  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 48, 28),
    new THREE.MeshStandardMaterial({
      color: violet.clone().lerp(new THREE.Color('#ffffff'), 0.08),
      emissive: violet,
      emissiveIntensity: 0.55,
      roughness: 0.05,
      metalness: 0.18,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  group.add(glass);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.04, 3),
    new THREE.MeshBasicMaterial({
      color: violet,
      wireframe: true,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(wire);

  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(1.42, 40, 20),
    new THREE.MeshBasicMaterial({
      color: cyan,
      transparent: true,
      opacity: 0.10,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(aura);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: cyan,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
  });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.009, 10, 128), ringMaterial.clone());
  ringA.rotation.x = Math.PI * 0.5;
  group.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.008, 10, 128), ringMaterial.clone());
  ringB.rotation.y = Math.PI * 0.5;
  ringB.rotation.x = Math.PI * 0.08;
  group.add(ringB);

  group.userData = { core, glass, wire, aura, ringA, ringB };
  return group;
}

export function initLabScene(container, projects = []) {
  if (!container || !canUseWebGL()) {
    return { setActive() {}, destroy() {} };
  }

  const canvas = container.querySelector('[data-lab-canvas]');
  if (!canvas) {
    return { setActive() {}, destroy() {} };
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    depth: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030008, 0.06);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 0, 7.4);

  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  const key = new THREE.PointLight(0x66e9ff, 3.2, 22);
  key.position.set(-2.4, 2.3, 5);
  const fill = new THREE.PointLight(0xff4da6, 2.2, 18);
  fill.position.set(2.8, -2, 4);
  scene.add(ambient, key, fill);

  const root = new THREE.Group();
  scene.add(root);

  const particles = createParticles(projects, window.innerWidth < 720 ? 320 : 640);
  const hub = createHub();
  root.add(particles, hub);

  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let activeIndex = 0;
  let frame = 0;
  let destroyed = false;

  function resize() {
    if (destroyed) return;
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 560 ? 8.9 : width < 920 ? 8.1 : 7.4;
    root.scale.setScalar(width < 560 ? 0.6 : width < 920 ? 0.82 : 1);
    camera.updateProjectionMatrix();
  }

  function setActive(index = 0) {
    activeIndex = clamp(index, 0, Math.max(projects.length - 1, 0));
    // sphere color is driven by fluid CSS vars, not project accent
  }

  function onPointerMove(event) {
    const rect = container.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointerTarget.y = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
  }

  function animateParticles(time) {
    const position = particles.geometry.attributes.position;
    const bases = particles.userData.basePositions;

    for (let i = 0; i < position.count; i += 1) {
      const ix = i * 3;
      position.array[ix] = bases[ix] + pointer.x * 0.12 + Math.sin(time * 0.54 + i * 0.04) * 0.035;
      position.array[ix + 1] = bases[ix + 1] + pointer.y * 0.1 + Math.cos(time * 0.38 + i * 0.028) * 0.03;
      position.array[ix + 2] = bases[ix + 2] + Math.sin(time * 0.4 + i) * 0.026;
    }

    position.needsUpdate = true;
  }

  // Live color sync: sample fluid background CSS vars every 20 frames
  let colorTick = 0;
  const _fc1 = new THREE.Color();
  const _fc2 = new THREE.Color();

  function syncFluidColors() {
    try {
      const style = getComputedStyle(document.documentElement);
      const a1 = style.getPropertyValue('--nebula-accent').trim();
      const a2 = style.getPropertyValue('--nebula-accent-2').trim();
      if (a1) {
        _fc1.set(a1);
        hub.userData.core.material.emissive.copy(_fc1);
        hub.userData.core.material.color.copy(_fc1.clone().lerp(new THREE.Color('#ffffff'), 0.22));
        hub.userData.wire.material.color.copy(_fc1);
        hub.userData.ringA.material.color.copy(_fc1);
        hub.userData.aura.material.color.copy(_fc1);
        key.color.copy(_fc1);
      }
      if (a2) {
        _fc2.set(a2);
        hub.userData.glass.material.emissive.copy(_fc2);
        hub.userData.ringB.material.color.copy(_fc2);
        fill.color.copy(_fc2);
      }
    } catch (_) {}
  }

  function render() {
    if (destroyed) return;
    frame = requestAnimationFrame(render);

    const time = clock.getElapsedTime();
    pointer.lerp(pointerTarget, 0.06);
    root.rotation.y = pointer.x * 0.08 + Math.sin(time * 0.12) * 0.035;
    root.rotation.x = pointer.y * 0.05 + Math.cos(time * 0.11) * 0.02;

    particles.rotation.y += 0.0015;
    particles.rotation.x = Math.sin(time * 0.08) * 0.03;
    animateParticles(time);

    colorTick++;
    if (colorTick % 20 === 0) syncFluidColors();

    hub.userData.core.rotation.y += 0.005;
    hub.userData.glass.rotation.y -= 0.004;
    hub.userData.wire.rotation.y -= 0.006;
    hub.userData.wire.rotation.x += 0.003;
    hub.userData.ringA.rotation.z += 0.007;
    hub.userData.ringB.rotation.x += 0.006;
    hub.userData.aura.scale.setScalar(1 + Math.sin(time * 1.1) * 0.035);
    hub.userData.core.material.emissiveIntensity = 1.2 + Math.sin(time * 1.8) * 0.18;

    camera.position.x += (pointer.x * 0.16 - camera.position.x) * 0.045;
    camera.position.y += (pointer.y * 0.1 - camera.position.y) * 0.045;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  container.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  setActive(0);
  render();

  return {
    setActive,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      disposeObject(scene);
      renderer.dispose();
    },
  };
}
