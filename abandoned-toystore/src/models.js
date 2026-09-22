import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import wornMetalRackUrl from './assets/models/worn_metal_rack.glb';
import plasticCrate01Url from './assets/models/plastic_crate_01.glb';
import plasticCrate02Url from './assets/models/plastic_crate_02.glb';
import woodenCrate01Url from './assets/models/wooden_crate_01.glb';
import rubberDuckUrl from './assets/models/rubber_duck_toy.glb';

const MODEL_URLS = {
  wornMetalRack: wornMetalRackUrl,
  plasticCrate01: plasticCrate01Url,
  plasticCrate02: plasticCrate02Url,
  woodenCrate01: woodenCrate01Url,
  rubberDuck: rubberDuckUrl,
};

const loader = new GLTFLoader();
const gltfCache = new Map();

function loadGltf(url) {
  if (gltfCache.has(url)) return gltfCache.get(url);
  const promise = new Promise((resolve, reject) => {
    loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
  });
  gltfCache.set(url, promise);
  return promise;
}

// Poly Haven models come in real-world meters but each has its own natural
// orientation/pivot; place() clones a fresh instance so the same asset can
// be reused many times (e.g. several crates) without sharing a transform.
export async function placeModel(scene, key, { position = [0, 0, 0], rotationY = 0, scale = 1, castShadow = true, receiveShadow = true } = {}) {
  const url = MODEL_URLS[key];
  if (!url) throw new Error(`Unknown model key: ${key}`);
  const original = await loadGltf(url);
  const instance = original.clone(true);
  instance.position.set(...position);
  instance.rotation.y = rotationY;
  instance.scale.setScalar(scale);
  instance.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = castShadow;
      o.receiveShadow = receiveShadow;
    }
  });
  scene.add(instance);
  return instance;
}
