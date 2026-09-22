import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import hdriUrl from './assets/hdri/room.hdr';

// Loads a real HDRI (Poly Haven, CC0) for image-based lighting: it drives
// subtle ambient color/reflections on PBR materials without being shown
// as a visible skybox behind the room's own walls.
export function loadEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  return new Promise((resolve) => {
    new RGBELoader().load(hdriUrl, (hdrTexture) => {
      const envMap = pmrem.fromEquirectangular(hdrTexture).texture;
      scene.environment = envMap;
      hdrTexture.dispose();
      pmrem.dispose();
      resolve(envMap);
    });
  });
}
