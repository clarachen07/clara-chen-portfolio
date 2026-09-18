import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { TerrainController } from "./terrain-types";

const ASSETS = "/scenes/terrain/";
const SOIL_TILE = 2.53;

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
}

function landHeight(x: number, z: number) {
  const undulations = Math.sin(x * 0.37 + z * 0.21) * 0.09
    + Math.sin(z * 0.83 - x * 0.18) * 0.035
    + Math.cos(x * 1.6 + z * 0.47) * 0.016;
  const ridge = Math.exp(-(((z + 57) / 11) ** 2))
    * (3.6 + Math.sin(x * 0.12) * 1.2 + Math.sin(x * 0.37) * 0.65);
  return undulations + ridge;
}

function heightSampler(texture: T.Texture) {
  const image = texture.image as HTMLImageElement;
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Height map could not be read");
  context.drawImage(image, 0, 0);
  const { data, width, height } = context.getImageData(0, 0, image.width, image.height);
  const pixel = (x: number, y: number) => data[((y % height) * width + (x % width)) * 4] / 255;
  return (x: number, z: number) => {
    const u = T.MathUtils.euclideanModulo(x / SOIL_TILE, 1) * width;
    const v = T.MathUtils.euclideanModulo(z / SOIL_TILE, 1) * height;
    const ix = Math.floor(u), iy = Math.floor(v);
    const a = T.MathUtils.lerp(pixel(ix, iy), pixel(ix + 1, iy), u - ix);
    const b = T.MathUtils.lerp(pixel(ix, iy + 1), pixel(ix + 1, iy + 1), u - ix);
    return landHeight(x, z) + (T.MathUtils.lerp(a, b, v - iy) - 0.5) * 0.045;
  };
}

function makeGround(heightAt: (x: number, z: number) => number, mobile: boolean) {
  const segments = mobile ? 160 : 256;
  const geometry = new T.PlaneGeometry(2, 2, segments, segments);
  const positions = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  // Concentrate actual geometry around the camera, with a continuous coarse
  // horizon instead of overlapping planes or a visible edge between LODs.
  const spread = (t: number) => t * 12 + Math.sign(t) * Math.abs(t) ** 4 * 72;
  for (let i = 0; i < positions.count; i += 1) {
    const x = spread(positions.getX(i));
    const z = -spread(positions.getY(i)) - 9;
    positions.setXYZ(i, x, heightAt(x, z), z);
    uv.setXY(i, x / SOIL_TILE, -z / SOIL_TILE);
  }
  geometry.setAttribute("uv1", uv.clone());
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function disposeObject(root: T.Object3D) {
  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  const textures = new Set<T.Texture>();
  root.traverse((object) => {
    if (!(object instanceof T.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof T.Texture) textures.add(value);
      }
    }
    if (object instanceof T.InstancedMesh) object.dispose();
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export function createTerrainScene(host: HTMLDivElement, onFailure: () => void): TerrainController {
  const mobile = matchMedia("(max-width: 700px)").matches;
  const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
  let density = Math.min(devicePixelRatio, mobile ? 1.25 : 1.5);
  renderer.setPixelRatio(density);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new T.Scene();
  scene.background = new T.Color("#d4ba91");
  scene.fog = new T.FogExp2("#d4ba91", 0.022);
  const camera = new T.PerspectiveCamera(49, 1, 0.04, 190);
  scene.add(new T.HemisphereLight("#f3dfba", "#766044", 1.6));
  const sun = new T.DirectionalLight("#fff0cf", 3.1);
  sun.position.set(-15, 11, -9);
  sun.target.position.set(0, 0, -8);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(mobile ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 21, bottom: -15, near: 0.1, far: 65 });
  sun.shadow.bias = -0.00012;
  sun.shadow.normalBias = 0.018;
  scene.add(sun, sun.target);

  let disposed = false;
  let loaded = false;
  let visible = false;
  let paused = false;
  let target = 0;
  let current = 0;
  let frame = 0;
  let lastTime = 0;
  let slowFrames = 0;
  let drawCount = 0;
  const textures = new Set<T.Texture>();

  async function loadTexture(name: string, repeat = true) {
    const texture = await new T.TextureLoader().loadAsync(ASSETS + name);
    if (disposed) {
      texture.dispose();
      throw new Error("Terrain disposed");
    }
    textures.add(texture);
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (repeat) texture.wrapS = texture.wrapT = T.RepeatWrapping;
    return texture;
  }

  function placeCamera() {
    const z = 4 - current * 3;
    const x = 0.12 + current * 0.15;
    const y = landHeight(x, z) + 0.8;
    camera.position.set(x, y, z);
    camera.lookAt(x + 0.35, y - 2.8, z - 12);
    host.dataset.progress = current.toFixed(5);
  }

  function draw() {
    if (disposed || !loaded || !visible || document.hidden) return;
    placeCamera();
    renderer.render(scene, camera);
    host.dataset.frames = String(++drawCount);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }

  function animate(now: number) {
    frame = 0;
    if (disposed || !loaded || !visible || paused || document.hidden) return;
    const elapsed = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 1 / 60;
    if (lastTime && now - lastTime > 42) slowFrames += 1;
    lastTime = now;
    current = T.MathUtils.lerp(current, target, 1 - Math.exp(-elapsed * 12));
    const settled = Math.abs(current - target) < 0.0001;
    if (settled) current = target;
    if (slowFrames > 45 && density > 1) {
      density = Math.max(1, density - 0.25);
      renderer.setPixelRatio(density);
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      slowFrames = 0;
    }
    draw();
    if (!settled) frame = requestAnimationFrame(animate);
    else lastTime = 0;
  }

  function wake() {
    if (!disposed && loaded && visible && !paused && !document.hidden && !frame) {
      frame = requestAnimationFrame(animate);
    }
  }

  function resize() {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    camera.fov = camera.aspect < 0.8 ? 55 : 49;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }

  function onVisibility() {
    if (document.hidden) stop();
    else { draw(); wake(); }
  }

  function onContextLoss(event: Event) {
    event.preventDefault();
    if (!disposed) onFailure();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLoss);
  resize();

  const resolution = mobile || renderer.capabilities.maxTextureSize < 4096 ? "2k" : "4k";
  const ready = (async () => {
    const loadScan = (name: string) => new GLTFLoader().loadAsync(ASSETS + name).then((gltf) => {
      if (disposed) {
        disposeObject(gltf.scene);
        throw new Error("Terrain disposed");
      }
      // Keep the source in the scene (invisible) so partial load failures also
      // dispose its materials, textures and geometry.
      gltf.scene.visible = false;
      scene.add(gltf.scene);
      return gltf;
    });
    const [color, normal, arm, height, gltf, pebbleGltf] = await Promise.all([
      loadTexture(`ground-color-${resolution}.webp`),
      loadTexture(`ground-normal-${resolution}.webp`),
      loadTexture(`ground-arm-${resolution === "4k" ? "2k" : "1k"}.webp`),
      loadTexture("ground-height.webp"),
      loadScan("rock.glb"),
      loadScan("pebble.glb"),
    ]);
    if (disposed) return;
    color.colorSpace = T.SRGBColorSpace;
    const heightAt = heightSampler(height);
    const soil = new T.MeshStandardMaterial({
      map: color, normalMap: normal, normalScale: new T.Vector2(1.05, 1.05),
      roughnessMap: arm, aoMap: arm, aoMapIntensity: 0.9, roughness: 1, metalness: 0,
    });
    soil.onBeforeCompile = (shader) => {
      shader.vertexShader = "varying vec3 terrainPosition;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nterrainPosition = position;");
      shader.fragmentShader = "varying vec3 terrainPosition;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        float soilVariation = sin(terrainPosition.x * .43 + terrainPosition.z * .17)
          * cos(terrainPosition.z * .31) * .5 + .5;
        diffuseColor.rgb *= mix(vec3(.78,.71,.61), vec3(1.08,1.02,.92), soilVariation);`);
    };
    const ground = new T.Mesh(makeGround(heightAt, mobile), soil);
    ground.receiveShadow = true;
    scene.add(ground);

    let source: T.Mesh<T.BufferGeometry, T.MeshStandardMaterial> | undefined;
    gltf.scene.traverse((object) => {
      if (!source && object instanceof T.Mesh) source = object as T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>;
    });
    if (!source) throw new Error("Rock scan has no mesh");
    gltf.scene.updateMatrixWorld(true);
    const rockGeometry = source.geometry.clone().applyMatrix4(source.matrixWorld);
    rockGeometry.computeBoundingBox();
    const bounds = rockGeometry.boundingBox!;
    const size = bounds.getSize(new T.Vector3());
    const center = bounds.getCenter(new T.Vector3());
    rockGeometry.translate(-center.x, -bounds.min.y, -center.z);
    const rockSize = Math.max(size.x, size.z);
    rockGeometry.scale(1 / rockSize, 1 / rockSize, 1 / rockSize);
    const rockMaterial = source.material.clone();
    rockMaterial.roughness = 1;
    rockMaterial.metalness = 0;
    rockMaterial.color.set("#e4d1b0");
    rockMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = max(roughnessFactor, 0.88);");
    };
    const count = mobile ? 95 : 210;
    const rocks = new T.InstancedMesh(rockGeometry, rockMaterial, count);
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    const random = seeded(912783);
    const dummy = new T.Object3D();
    // A few near-field rocks keep the low camera legible in narrow viewports.
    // All remain outside the camera's three-meter travel corridor.
    const foreground = [[-0.45, 1.8, 0.16], [0.8, -0.3, 0.26], [-0.8, -3.5, 0.42], [1.7, -6, 0.55]];
    for (let i = 0; i < count; i += 1) {
      let x = (random() - 0.5) * 32;
      let z = 8 - random() * 43;
      if (Math.abs(x) < 0.8 && z > -1 && z < 6) x += x < 0 ? -1.4 : 1.4;
      let scale = 0.12 + random() ** 2 * 0.75;
      if (i < foreground.length) [x, z, scale] = foreground[i];
      dummy.position.set(x, heightAt(x, z) - 0.025, z);
      dummy.rotation.set(0, random() * Math.PI * 2, 0);
      dummy.scale.set(scale, scale * (0.65 + random() * 0.5), scale * (0.75 + random() * 0.4));
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
      rocks.setColorAt(i, new T.Color().setScalar(0.75 + random() * 0.3));
    }
    rocks.computeBoundingSphere();
    scene.add(rocks);

    let pebbleSource: T.Mesh | undefined;
    pebbleGltf.scene.traverse((object) => {
      if (!pebbleSource && object instanceof T.Mesh) pebbleSource = object;
    });
    if (!pebbleSource) throw new Error("Pebble scan has no mesh");
    pebbleGltf.scene.updateMatrixWorld(true);
    const gravelGeometry = pebbleSource.geometry.clone().applyMatrix4(pebbleSource.matrixWorld);
    gravelGeometry.computeBoundingBox();
    const pebbleBounds = gravelGeometry.boundingBox!;
    const pebbleCenter = pebbleBounds.getCenter(new T.Vector3());
    const pebbleSize = pebbleBounds.getSize(new T.Vector3());
    gravelGeometry.translate(-pebbleCenter.x, -pebbleBounds.min.y, -pebbleCenter.z);
    const pebbleWidth = Math.max(pebbleSize.x, pebbleSize.z);
    gravelGeometry.scale(1 / pebbleWidth, 1 / pebbleWidth, 1 / pebbleWidth);
    // Only the geometry is needed: gravel shares the already-loaded rock PBR
    // material, so duplicate GLTF texture objects never reach the GPU.
    scene.remove(pebbleGltf.scene);
    disposeObject(pebbleGltf.scene);
    const gravelCount = mobile ? 750 : 2200;
    const gravel = new T.InstancedMesh(gravelGeometry, rockMaterial, gravelCount);
    gravel.castShadow = true;
    gravel.receiveShadow = true;
    for (let i = 0; i < gravelCount; i += 1) {
      const x = (random() - 0.5) * 22;
      const z = 7 - random() * 25;
      const scale = 0.016 + random() ** 3 * 0.064;
      dummy.position.set(x, heightAt(x, z) - 0.003, z);
      dummy.rotation.set(0, random() * Math.PI * 2, 0);
      dummy.scale.set(scale, scale * (0.6 + random() * 0.4), scale * 0.8);
      dummy.updateMatrix();
      gravel.setMatrixAt(i, dummy.matrix);
      gravel.setColorAt(i, new T.Color().setScalar(0.62 + random() * 0.65));
    }
    gravel.computeBoundingSphere();
    scene.add(gravel);
    renderer.shadowMap.needsUpdate = true;
    loaded = true;
    current = target;
    resize();
    draw();
  })();

  return {
    ready,
    setProgress(value) {
      target = T.MathUtils.clamp(value, 0, 1);
      if (Math.abs(target - current) > 0.0001) wake();
    },
    setVisible(value) {
      visible = value;
      if (visible) { draw(); wake(); }
      else stop();
    },
    pause(value) {
      paused = value;
      if (paused) stop();
      else wake();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLoss);
      disposeObject(scene);
      textures.forEach((texture) => texture.dispose());
      sun.shadow.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
