// Rebuild the locally hosted CC0 terrain derivatives without changing dependencies.
// Requires the project's Three.js and Sharp (provided by Next.js).
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BufferAttribute, BufferGeometry } from 'three';
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';

const output = fileURLToPath(new URL('../public/scenes/terrain/', import.meta.url));
const scratch = await mkdtemp(path.join(tmpdir(), 'clara-terrain-assets-'));
await mkdir(output, { recursive: true });

async function fetchChecked(asset) {
  const cached = path.join(scratch, asset.md5);
  try {
    return await readFile(cached);
  } catch { /* This invocation has not downloaded this source yet. */ }
  const response = await fetch(asset.url);
  if (!response.ok) throw new Error(`Asset request failed: ${response.status} ${asset.url}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (createHash('md5').update(data).digest('hex') !== asset.md5) {
    throw new Error(`Source checksum mismatch: ${asset.url}`);
  }
  await writeFile(cached, data);
  return data;
}

async function catalog(id) {
  const response = await fetch(`https://api.polyhaven.com/files/${id}`);
  if (!response.ok) throw new Error(`Catalog request failed: ${id}`);
  return response.json();
}

function sandColor(image) {
  return image.modulate({ saturation: 0.72, brightness: 1.08 })
    .linear([1.025, 1.045, 0.99], [4, 6, 2]);
}

function rockColor(image) {
  return image.modulate({ saturation: 0.65, brightness: 1.04 })
    .linear([1.045, 1.02, 0.95], [3, 3, 0]);
}

async function makeGround(files) {
  const [color, normal, arm, height] = await Promise.all([
    fetchChecked(files.Diffuse['4k'].jpg),
    fetchChecked(files.nor_gl['4k'].jpg),
    fetchChecked(files.arm['2k'].jpg),
    fetchChecked(files.Displacement['1k'].png),
  ]);
  const tasks = [];
  for (const [label, size] of [['4k', 4096], ['2k', 2048]]) {
    tasks.push(sandColor(sharp(color).resize(size)).webp({ quality: 81, effort: 6 })
      .toFile(path.join(output, `ground-color-${label}.webp`)));
    tasks.push(sharp(normal).resize(size).webp({ quality: label === '4k' ? 70 : 83, effort: 6 })
      .toFile(path.join(output, `ground-normal-${label}.webp`)));
  }
  for (const [label, size] of [['2k', 2048], ['1k', 1024]]) {
    tasks.push(sharp(arm).resize(size).webp({ quality: 85, effort: 6 })
      .toFile(path.join(output, `ground-arm-${label}.webp`)));
  }
  tasks.push(sharp(height).resize(512).greyscale().webp({ lossless: true, effort: 6 })
    .toFile(path.join(output, 'ground-height.webp')));
  await Promise.all(tasks);
}

function sourceGeometry(gltf, binary) {
  const primitive = gltf.meshes[0].primitives[0];
  const geometry = new BufferGeometry();
  const fields = { POSITION: ['position', 3], NORMAL: ['normal', 3], TEXCOORD_0: ['uv', 2] };
  const typedArrays = { 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
  function getValues(index, components) {
    const accessor = gltf.accessors[index];
    const view = gltf.bufferViews[accessor.bufferView];
    if (view.byteStride) throw new Error('This asset converter expects packed attributes.');
    return new typedArrays[accessor.componentType](
      binary.buffer,
      binary.byteOffset + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0),
      accessor.count * components,
    ).slice();
  }
  for (const [semantic, [attribute, components]] of Object.entries(fields)) {
    geometry.setAttribute(attribute, new BufferAttribute(getValues(primitive.attributes[semantic], components), components));
  }
  geometry.setIndex(new BufferAttribute(getValues(primitive.indices, 1), 1));
  return geometry;
}

function writeGlb(geometry) {
  geometry.computeBoundingBox();
  const attributes = {};
  const accessors = [];
  const bufferViews = [];
  const chunks = [];
  let byteLength = 0;
  function addAttribute(attribute, type, target, bounds) {
    const array = attribute.array;
    const bytes = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
    const accessor = accessors.length;
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    accessors.push({
      bufferView: bufferViews.length - 1,
      componentType: array instanceof Float32Array ? 5126 : 5123,
      count: attribute.count,
      type,
      ...bounds,
    });
    chunks.push(bytes);
    const padding = (4 - bytes.length % 4) % 4;
    if (padding) chunks.push(Buffer.alloc(padding));
    byteLength += bytes.length + padding;
    return accessor;
  }
  attributes.POSITION = addAttribute(geometry.attributes.position, 'VEC3', 34962, {
    min: geometry.boundingBox.min.toArray(), max: geometry.boundingBox.max.toArray(),
  });
  attributes.NORMAL = addAttribute(geometry.attributes.normal, 'VEC3', 34962);
  attributes.TEXCOORD_0 = addAttribute(geometry.attributes.uv, 'VEC2', 34962);
  const indices = new BufferAttribute(new Uint16Array(geometry.index.array), 1);
  const index = addAttribute(indices, 'SCALAR', 34963);
  const gltf = {
    asset: { version: '2.0', generator: 'Clara Chen terrain asset converter / Three.js SimplifyModifier',
      copyright: 'Rock 07 — Jenelle van Heerden / Poly Haven, CC0' },
    extensionsUsed: ['EXT_texture_webp'], extensionsRequired: ['EXT_texture_webp'],
    scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: 'rock_07' }],
    meshes: [{ name: 'Rock 07 scanned silhouette', primitives: [{ attributes, indices: index, material: 0 }] }],
    materials: [{ name: 'Warm scanned rock',
      pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicRoughnessTexture: { index: 2 }, metallicFactor: 0, roughnessFactor: 1 },
      normalTexture: { index: 1 }, occlusionTexture: { index: 2 },
    }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
    textures: [0, 1, 2].map(source => ({ sampler: 0, extensions: { EXT_texture_webp: { source } } })),
    images: ['rock-color.webp', 'rock-normal.webp', 'rock-arm.webp'].map(uri => ({ uri, mimeType: 'image/webp' })),
    accessors, bufferViews, buffers: [{ byteLength }],
  };
  const json = Buffer.from(JSON.stringify(gltf));
  const paddedJson = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
  const binary = Buffer.concat(chunks);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + paddedJson.length + binary.length, 8);
  header.writeUInt32LE(paddedJson.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(binary.length, 0);
  binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, paddedJson, binaryHeader, binary]);
}

async function makeRock(files) {
  const model = files.gltf['1k'].gltf;
  const [gltfBytes, binary, color, normal, arm] = await Promise.all([
    fetchChecked(model), fetchChecked(model.include['rock_07.bin']),
    fetchChecked(files.Diffuse['1k'].jpg), fetchChecked(files.nor_gl['1k'].jpg), fetchChecked(files.arm['1k'].jpg),
  ]);
  const geometry = sourceGeometry(JSON.parse(gltfBytes.toString()), binary);
  const targetTriangles = 2800;
  const ratio = targetTriangles / (geometry.index.count / 3);
  const simplified = await new SimplifyModifier().modify(geometry, Math.ceil(geometry.attributes.position.count * (1 - ratio)));
  const pebbleRatio = 200 / (geometry.index.count / 3);
  const pebble = await new SimplifyModifier().modify(geometry, Math.ceil(geometry.attributes.position.count * (1 - pebbleRatio)));
  await Promise.all([
    writeFile(path.join(output, 'rock.glb'), writeGlb(simplified)),
    writeFile(path.join(output, 'pebble.glb'), writeGlb(pebble)),
    rockColor(sharp(color)).webp({ quality: 87, effort: 6 }).toFile(path.join(output, 'rock-color.webp')),
    sharp(normal).webp({ quality: 87, effort: 6 }).toFile(path.join(output, 'rock-normal.webp')),
    sharp(arm).webp({ quality: 88, effort: 6 }).toFile(path.join(output, 'rock-arm.webp')),
  ]);
  console.log(`Rock: ${simplified.attributes.position.count} vertices, ${simplified.index.count / 3} triangles.`);
  console.log(`Pebble: ${pebble.attributes.position.count} vertices, ${pebble.index.count / 3} triangles.`);
  console.log(`Original scan bounds: ${JSON.stringify(simplified.boundingBox)}`);
  geometry.dispose();
  simplified.dispose();
  pebble.dispose();
}

try {
  const [ground, rock] = await Promise.all([catalog('sandy_gravel_02'), catalog('rock_07')]);
  await Promise.all([makeGround(ground), makeRock(rock)]);
  console.log(`Terrain derivatives written to ${output}`);
} finally {
  await rm(scratch, { recursive: true, force: true });
}
