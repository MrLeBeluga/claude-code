import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const EYE_HEIGHT = 1.7;
const RADIUS = 0.35;
const SPEED = 3.6;

export class Player {
  constructor(camera, domElement, colliders) {
    this.camera = camera;
    this.controls = new PointerLockControls(camera, domElement);
    this.colliders = colliders; // array of THREE.Box3
    this.velocity = new THREE.Vector3();
    this.position = new THREE.Vector3(0, EYE_HEIGHT, 6);
    this.camera.position.copy(this.position);

    this.keys = { forward: false, back: false, left: false, right: false };

    this.bobTime = 0;

    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
  }

  onKey(e, down) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = down;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.back = down;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = down;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = down;
        break;
      default:
        break;
    }
  }

  resolveCollisions(next) {
    // axis-separated collision against room + prop AABBs, player treated as a circle
    for (const box of this.colliders) {
      const closestX = Math.max(box.min.x, Math.min(next.x, box.max.x));
      const closestZ = Math.max(box.min.z, Math.min(next.z, box.max.z));
      const dx = next.x - closestX;
      const dz = next.z - closestZ;
      const distSq = dx * dx + dz * dz;
      if (distSq < RADIUS * RADIUS) {
        const dist = Math.sqrt(distSq) || 0.0001;
        const overlap = RADIUS - dist;
        next.x += (dx / dist) * overlap;
        next.z += (dz / dist) * overlap;
      }
    }
    return next;
  }

  update(dt) {
    if (!this.controls.isLocked) return;

    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

    const move = new THREE.Vector3();
    if (this.keys.forward) move.add(forward);
    if (this.keys.back) move.sub(forward);
    if (this.keys.right) move.add(right);
    if (this.keys.left) move.sub(right);

    let moving = false;
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * dt);
      moving = true;
    }

    const next = this.position.clone().add(move);
    this.resolveCollisions(next);
    this.position.copy(next);

    // head bob
    if (moving) {
      this.bobTime += dt * 8.5;
    }
    const bob = moving ? Math.sin(this.bobTime) * 0.035 : 0;

    this.camera.position.set(this.position.x, EYE_HEIGHT + bob, this.position.z);
  }
}
