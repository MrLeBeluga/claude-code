import * as THREE from 'three';
import { buildWorld } from './world.js';
import { Player } from './player.js';
import { createPostFX } from './postprocessing.js';
import { loadEnvironment } from './environment.js';

const app = document.getElementById('app');
const overlay = document.getElementById('overlay');
const messageEl = document.getElementById('message');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 60);

const { colliders, interactive, flickerLights } = buildWorld(scene);
const player = new Player(camera, renderer.domElement, colliders);

const postfx = createPostFX(renderer, scene, camera);
loadEnvironment(renderer, scene);

overlay.addEventListener('click', () => player.controls.lock());
player.controls.addEventListener('lock', () => overlay.classList.add('hidden'));
player.controls.addEventListener('unlock', () => overlay.classList.remove('hidden'));

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  postfx.setSize(window.innerWidth, window.innerHeight);
});

let collectedCount = 0;
let messageTimer = 0;

function showMessage(text, duration = 2.4) {
  messageEl.textContent = text;
  messageEl.classList.add('show');
  messageTimer = duration;
}

window.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyE') return;
  for (const item of interactive) {
    if (item.collected) continue;
    const dx = player.position.x - item.object.position.x;
    const dz = player.position.z - item.object.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist <= item.radius) {
      item.collected = true;
      item.object.visible = false;
      collectedCount++;
      showMessage('Tu as ramassé le cristal. Il n\'y a plus que le silence.', 3.5);
    }
  }
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  player.update(dt);

  for (const item of interactive) {
    if (!item.collected) item.update(t);
  }

  for (const fl of flickerLights) {
    const flicker =
      0.85 +
      0.15 * Math.sin(t * 18) +
      (Math.random() < 0.02 ? -0.6 * Math.random() : 0);
    fl.light.intensity = fl.base * Math.max(0.15, flicker);
    if (fl.mesh) fl.mesh.emissiveIntensity = 0.9 * Math.max(0.2, flicker);
  }

  if (messageTimer > 0) {
    messageTimer -= dt;
    if (messageTimer <= 0) messageEl.classList.remove('show');
  }

  postfx.update(t);
  postfx.composer.render();
}

animate();
