import * as THREE from 'three';

import woodWallDiff from './assets/textures/wood_plank_wall/diff.jpg';
import woodWallNor from './assets/textures/wood_plank_wall/nor.jpg';
import woodWallArm from './assets/textures/wood_plank_wall/arm.jpg';

import woodFloorDiff from './assets/textures/wood_floor_worn/diff.jpg';
import woodFloorNor from './assets/textures/wood_floor_worn/nor.jpg';
import woodFloorArm from './assets/textures/wood_floor_worn/arm.jpg';

import ceilingDiff from './assets/textures/ceiling_interior/diff.jpg';
import ceilingNor from './assets/textures/ceiling_interior/nor.jpg';
import ceilingArm from './assets/textures/ceiling_interior/arm.jpg';

import rustyMetalDiff from './assets/textures/rusty_metal_02/diff.jpg';
import rustyMetalNor from './assets/textures/rusty_metal_02/nor.jpg';
import rustyMetalArm from './assets/textures/rusty_metal_02/arm.jpg';

const loader = new THREE.TextureLoader();
const cache = new Map();

function load(url, { srgb = false } = {}) {
  if (cache.has(url)) return cache.get(url);
  const tex = loader.load(url);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(url, tex);
  return tex;
}

// arm.jpg packs Ambient-Occlusion (R), Roughness (G), Metalness (B) —
// the exact channel layout THREE.MeshStandardMaterial expects for
// aoMap / roughnessMap / metalnessMap, so one texture drives all three.
function pbrMaterial({ diff, nor, arm, repeat = [1, 1], normalScale = 1, extra = {} }) {
  const map = load(diff, { srgb: true });
  const normalMap = load(nor);
  const armMap = load(arm);
  [map, normalMap, armMap].forEach((t) => t.repeat.set(repeat[0], repeat[1]));

  return new THREE.MeshStandardMaterial({
    map,
    normalMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    aoMap: armMap,
    roughnessMap: armMap,
    metalnessMap: armMap,
    roughness: 1,
    metalness: 1,
    envMapIntensity: 0.4,
    ...extra,
  });
}

export function woodWallMaterial(repeat = [3, 1.4]) {
  return pbrMaterial({ diff: woodWallDiff, nor: woodWallNor, arm: woodWallArm, repeat });
}

export function woodFloorMaterial(repeat = [5, 5]) {
  return pbrMaterial({ diff: woodFloorDiff, nor: woodFloorNor, arm: woodFloorArm, repeat });
}

export function ceilingMaterial(repeat = [3, 3]) {
  return pbrMaterial({ diff: ceilingDiff, nor: ceilingNor, arm: ceilingArm, repeat, normalScale: 0.35 });
}

export function rustyMetalMaterial(repeat = [1, 1]) {
  return pbrMaterial({ diff: rustyMetalDiff, nor: rustyMetalNor, arm: rustyMetalArm, repeat });
}

// MeshStandardMaterial.aoMap only samples a geometry's *second* UV channel —
// duplicate uv into uv2 so the packed AO data in our arm maps actually applies.
export function addUV2(geometry) {
  geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
  return geometry;
}
