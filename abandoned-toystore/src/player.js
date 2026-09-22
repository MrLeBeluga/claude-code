import * as THREE from 'three';

const RADIUS = 0.35;
const SPEED = 3.6;
const MIN_PITCH = -0.1;
const MAX_PITCH = 1.15;
const UP = new THREE.Vector3(0, 1, 0);

// The character model's own "front" doesn't line up with three.js's -Z
// forward convention (Tripo3D exports have no fixed orientation), so this
// constant rotates the mesh to actually face the way it's walking. Tune by
// eye: 0 / Math.PI/2 / Math.PI / -Math.PI/2 are the four things to try.
const CHARACTER_FACING_OFFSET = Math.PI / 2;

export class Player extends THREE.EventDispatcher {
  constructor(camera, domElement, colliders, characterGroup, scene) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;
    this.characterGroup = characterGroup;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.minCameraDistance = 0.6;

    this.position = new THREE.Vector3(0, 0, 6);
    this.yaw = 0;
    this.pitch = 0.22;
    this.distance = 4.5;

    this.isLocked = false;
    this.keys = { forward: false, back: false, left: false, right: false };

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    window.addEventListener('keydown', (e) => this._onKey(e, true));
    window.addEventListener('keyup', (e) => this._onKey(e, false));
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  _onPointerLockChange() {
    this.isLocked = document.pointerLockElement === this.domElement;
    this.dispatchEvent({ type: this.isLocked ? 'lock' : 'unlock' });
  }

  _onMouseMove(e) {
    if (!this.isLocked) return;
    const sensitivity = 0.0022;
    this.yaw -= e.movementX * sensitivity;
    this.pitch -= e.movementY * sensitivity;
    this.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, this.pitch));
  }

  _onKey(e, down) {
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
    if (!this.isLocked) return;

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(UP, this.yaw);
    const right = new THREE.Vector3().crossVectors(forward, UP);

    const move = new THREE.Vector3();
    if (this.keys.forward) move.add(forward);
    if (this.keys.back) move.sub(forward);
    if (this.keys.right) move.add(right);
    if (this.keys.left) move.sub(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * dt);
    }

    const next = this.position.clone().add(move);
    this.resolveCollisions(next);
    this.position.copy(next);

    if (this.characterGroup) {
      this.characterGroup.position.set(this.position.x, 0, this.position.z);
      this.characterGroup.rotation.y = this.yaw + CHARACTER_FACING_OFFSET;
    }

    // orbit camera around a point roughly at the character's chest/head height
    const lookTarget = new THREE.Vector3(this.position.x, 1.35, this.position.z);
    const horiz = this.distance * Math.cos(this.pitch);
    const vert = this.distance * Math.sin(this.pitch);
    const desiredOffset = forward.clone().multiplyScalar(-horiz).add(new THREE.Vector3(0, vert, 0));
    const desiredDistance = desiredOffset.length();
    const dir = desiredOffset.clone().normalize();

    // pull the camera in if the desired spot is past a wall/prop — otherwise
    // the orbit camera clips outside the room near any wall (it did at spawn)
    let actualDistance = desiredDistance;
    if (this.scene) {
      this.raycaster.set(lookTarget, dir);
      this.raycaster.near = 0.35; // skip the character's own back/shoulders
      this.raycaster.far = desiredDistance;
      const targets = this.scene.children.filter((o) => o !== this.characterGroup);
      const hits = this.raycaster.intersectObjects(targets, true);
      if (hits.length > 0) {
        actualDistance = Math.max(this.minCameraDistance, hits[0].distance - 0.2);
      }
    }

    const camPos = lookTarget.clone().add(dir.multiplyScalar(actualDistance));
    this.camera.position.copy(camPos);
    this.camera.lookAt(lookTarget);
  }
}
