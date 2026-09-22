import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

// A real mirror — renders the scene from a mirrored viewpoint into a texture
// each frame, so the player actually sees their character reflected, not a
// static cubemap or a flat painted texture.
export function createMirror(scene, { position, rotationY = 0, width = 1.4, height = 2.3 } = {}) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const mirror = new Reflector(geometry, {
    color: 0x8a9199,
    textureWidth: 1024,
    textureHeight: 1024,
    multisample: 0,
  });
  mirror.position.set(...position);
  mirror.rotation.y = rotationY;
  scene.add(mirror);

  // simple frame so it reads as a mounted mirror rather than a floating portal
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.14, height + 0.14, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x2b2b30, roughness: 0.5, metalness: 0.3 })
  );
  frame.position.set(...position);
  frame.rotation.y = rotationY;
  frame.translateZ(-0.03);
  scene.add(frame);

  return mirror;
}
