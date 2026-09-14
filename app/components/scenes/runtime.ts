import * as T from "three";
import type { MarsAction, MarsController } from "./types";

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
}

function makeStars() {
  const random = seeded(7057);
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  for (let index = 0; index < 1300; index += 1) {
    positions.push(
      (random() - 0.5) * 38,
      (random() - 0.5) * 25,
      -6 - random() * 20,
    );
    const brightness = 0.25 + random() * 0.7;
    colors.push(
      brightness,
      brightness * (0.87 + random() * 0.13),
      brightness * (0.8 + random() * 0.2),
    );
    sizes.push(index % 35 === 0 ? 2.4 : 0.7 + random() * 1.1);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("size", new T.Float32BufferAttribute(sizes, 1));
  const material = new T.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    uniforms: { density: { value: Math.min(devicePixelRatio, 1.8) } },
    vertexShader: `attribute float size; varying vec3 starColor; uniform float density;
      void main(){ starColor=color; vec4 p=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*p; gl_PointSize=size*density; }`,
    fragmentShader: `varying vec3 starColor;
      void main(){ float d=length(gl_PointCoord-.5); float a=1.-smoothstep(.08,.5,d); gl_FragColor=vec4(starColor,a*.85); }`,
  });
  return new T.Points(geometry, material);
}

export function createMarsScene(
  host: HTMLDivElement,
  onFailure: () => void,
): MarsController {
  const mobile = matchMedia("(max-width: 700px)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const renderer = new T.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  let density = Math.min(devicePixelRatio, mobile ? 1.5 : 1.8);
  renderer.setPixelRatio(density);

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
  scene.add(new T.HemisphereLight(0xdce8f0, 0x8b7a6c, 0.022));
  const sun = new T.DirectionalLight(0xffeadb, 3.3);
  sun.position.set(-4, 2, 1.4);
  scene.add(sun);

  const root = new T.Group();
  const globe = new T.Group();
  globe.rotation.set(0.18, 2.35, 0.17);
  root.add(globe);
  scene.add(root);

  const surface = new T.MeshStandardMaterial({
    color: 0xd7cec1,
    roughness: 0.96,
    metalness: 0,
    bumpScale: 0.014,
  });
  globe.add(
    new T.Mesh(
      new T.SphereGeometry(1.95, mobile ? 112 : 192, mobile ? 80 : 128),
      surface,
    ),
  );
  root.add(
    new T.Mesh(
      new T.SphereGeometry(1.972, 96, 64),
      new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        uniforms: { glow: { value: new T.Color(0x829eb3) } },
        vertexShader: `varying vec3 vNormal; varying vec3 vView; varying vec3 worldNormal;
          void main(){ vNormal=normalize(normalMatrix*normal); worldNormal=normalize(mat3(modelMatrix)*normal); vec4 p=modelViewMatrix*vec4(position,1.); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p; }`,
        fragmentShader: `uniform vec3 glow; varying vec3 vNormal; varying vec3 vView; varying vec3 worldNormal;
          void main(){ float rim=pow(1.-max(dot(normalize(vNormal),normalize(vView)),0.),5.); float sunlit=smoothstep(-.25,.65,dot(normalize(worldNormal),normalize(vec3(-4.,2.,1.4)))); gl_FragColor=vec4(glow,rim*.13*sunlit); }`,
      }),
    ),
  );
  const stars = makeStars();
  scene.add(stars);

  let disposed = false;
  let loaded = false;
  let paused = false;
  let visible = false;
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let sampleFrames = 0;
  let sampleTime = 0;
  let yaw = 0;
  let pitch = 0;
  let zoom = 1;
  let parallaxX = 0;
  let parallaxY = 0;
  let baseX = 0;
  let baseY = 0;
  const textures: T.Texture[] = [];

  const loadTexture = async (url: string) => {
    const texture = await new T.TextureLoader().loadAsync(url);
    if (disposed) {
      texture.dispose();
      throw new Error("Scene disposed");
    }
    texture.anisotropy = 4;
    textures.push(texture);
    return texture;
  };

  function draw() {
    if (disposed || !loaded) return;
    root.position.set(baseX, baseY, 0);
    root.rotation.set(pitch, yaw, 0);
    root.scale.setScalar(zoom);
    globe.rotation.y = 2.35 + elapsed * 0.018;
    camera.position.x = reducedMotion.matches ? 0 : parallaxX * 0.06;
    camera.position.y = reducedMotion.matches ? 0 : parallaxY * 0.04;
    stars.rotation.y = reducedMotion.matches ? 0 : parallaxX * 0.004;
    renderer.render(scene, camera);
    host.dataset.rotation = `${yaw.toFixed(3)},${pitch.toFixed(3)}`;
    host.dataset.zoom = zoom.toFixed(2);
  }

  function animate(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden || paused || !loaded) {
      last = 0;
      return;
    }
    if (last && now - last < 15) {
      frame = requestAnimationFrame(animate);
      return;
    }
    const actualDelta = last ? (now - last) / 1000 : 0;
    last = now;
    elapsed += Math.min(actualDelta, 0.1);
    draw();
    sampleFrames += 1;
    sampleTime += actualDelta;
    if (sampleTime > 2) {
      const fps = sampleFrames / sampleTime;
      host.dataset.fps = fps.toFixed(1);
      if (fps < (mobile ? 29 : 45) && density > 1) {
        density = Math.max(1, density - 0.25);
        renderer.setPixelRatio(density);
        resize();
      }
      sampleFrames = 0;
      sampleTime = 0;
    }
    frame = requestAnimationFrame(animate);
  }

  function wake() {
    if (!frame && !disposed && visible && !document.hidden && !paused && loaded) {
      frame = requestAnimationFrame(animate);
    }
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }

  function resize() {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.position.z = aspect < 0.65 ? 12 : 7.7;
    camera.updateProjectionMatrix();
    baseX = aspect > 1.1 ? aspect * 1.3 : aspect < 0.65 ? 0.9 : 0.62;
    baseY = aspect > 1.1 ? -1.3 : aspect < 0.65 ? -2.05 : -1.55;
    renderer.setSize(width, height, false);
    draw();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      draw();
      wake();
    } else {
      stop();
    }
  });
  intersectionObserver.observe(host);
  const handleVisibility = () => {
    if (document.hidden) stop();
    else {
      draw();
      wake();
    }
  };
  const handleContextLoss = (event: Event) => {
    event.preventDefault();
    onFailure();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  canvas.addEventListener("webglcontextlost", handleContextLoss);

  const pointers = new Map<number, { x: number; y: number }>();
  let downY = 0;
  let previousX = 0;
  let startPitch = 0;
  let pinchDistance = 0;

  function pointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size === 1) {
      previousX = event.clientX;
      downY = event.clientY;
      startPitch = pitch;
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    }
  }

  function pointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    parallaxX = (event.clientX - rect.left) / rect.width - 0.5;
    parallaxY = (event.clientY - rect.top) / rect.height - 0.5;
    if (!pointers.has(event.pointerId)) {
      if (paused) draw();
      return;
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      zoom = T.MathUtils.clamp(zoom * (distance / Math.max(1, pinchDistance)), 0.9, 1.2);
      pinchDistance = distance;
    } else {
      yaw = T.MathUtils.clamp(yaw + (event.clientX - previousX) * 0.006, -Math.PI, Math.PI);
      if (event.pointerType !== "touch") {
        pitch = T.MathUtils.clamp(startPitch + (event.clientY - downY) * 0.003, -0.35, 0.35);
      }
      previousX = event.clientX;
    }
    draw();
  }

  function pointerEnd(event: PointerEvent) {
    pointers.delete(event.pointerId);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerEnd);
  canvas.addEventListener("pointercancel", pointerEnd);
  resize();

  const resolution = mobile || renderer.capabilities.maxTextureSize < 8192 ? "2k" : "8k";
  const ready = Promise.all([
    loadTexture(`/scenes/mars-${resolution}.webp`),
    loadTexture("/scenes/mars-height.webp"),
  ]).then(([map, height]) => {
    map.colorSpace = T.SRGBColorSpace;
    surface.map = map;
    surface.bumpMap = height;
    surface.needsUpdate = true;
    loaded = true;
    resize();
    draw();
    wake();
  });

  return {
    ready,
    pause(value) {
      paused = value;
      if (paused) {
        stop();
        draw();
      } else {
        wake();
      }
    },
    action(value: MarsAction) {
      if (value === "reset") {
        yaw = 0;
        pitch = 0;
        zoom = 1;
        parallaxX = 0;
        parallaxY = 0;
      }
      if (value === "left") yaw -= 0.12;
      if (value === "right") yaw += 0.12;
      if (value === "up") pitch -= 0.08;
      if (value === "down") pitch += 0.08;
      if (value === "closer") zoom += 0.08;
      if (value === "farther") zoom -= 0.08;
      yaw = T.MathUtils.clamp(yaw, -Math.PI, Math.PI);
      pitch = T.MathUtils.clamp(pitch, -0.35, 0.35);
      zoom = T.MathUtils.clamp(zoom, 0.9, 1.2);
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLoss);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerEnd);
      canvas.removeEventListener("pointercancel", pointerEnd);
      textures.forEach((texture) => texture.dispose());
      scene.traverse((object) => {
        if (!(object instanceof T.Mesh || object instanceof T.Points)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
