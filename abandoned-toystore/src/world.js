import * as THREE from 'three';
import { woodPlankWall, concreteFloor, dropCeiling, signTexture, graffitiTexture, radialGlow } from './textures.js';

const ROOM_W = 14;
const ROOM_D = 16;
const ROOM_H = 3.6;

export function buildWorld(scene) {
  const colliders = [];
  const interactive = [];
  const flickerLights = [];

  // ---------- materials ----------
  const wallTex = woodPlankWall({ base: '#6b6f76', seed: 4 });
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95, metalness: 0.02 });

  const floorTex = concreteFloor({ seed: 7 });
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9, metalness: 0.05 });

  const ceilTex = dropCeiling({ seed: 9 });
  const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 1, metalness: 0 });

  // ---------- shell ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_H;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  function wall(w, h, x, z, rotY) {
    const geo = new THREE.PlaneGeometry(w, h);
    const m = new THREE.Mesh(geo, wallMat);
    m.position.set(x, h / 2, z);
    m.rotation.y = rotY;
    m.receiveShadow = true;
    m.castShadow = false;
    scene.add(m);
    return m;
  }
  wall(ROOM_W, ROOM_H, 0, -ROOM_D / 2, 0); // back
  wall(ROOM_W, ROOM_H, 0, ROOM_D / 2, Math.PI); // front (behind player start)
  wall(ROOM_D, ROOM_H, -ROOM_W / 2, 0, Math.PI / 2); // left
  wall(ROOM_D, ROOM_H, ROOM_W / 2, 0, -Math.PI / 2); // right

  colliders.push(
    new THREE.Box3(new THREE.Vector3(-ROOM_W / 2, 0, -ROOM_D / 2 - 0.3), new THREE.Vector3(ROOM_W / 2, ROOM_H, -ROOM_D / 2)),
    new THREE.Box3(new THREE.Vector3(-ROOM_W / 2, 0, ROOM_D / 2), new THREE.Vector3(ROOM_W / 2, ROOM_H, ROOM_D / 2 + 0.3)),
    new THREE.Box3(new THREE.Vector3(-ROOM_W / 2 - 0.3, 0, -ROOM_D / 2), new THREE.Vector3(-ROOM_W / 2, ROOM_H, ROOM_D / 2)),
    new THREE.Box3(new THREE.Vector3(ROOM_W / 2, 0, -ROOM_D / 2), new THREE.Vector3(ROOM_W / 2 + 0.3, ROOM_H, ROOM_D / 2))
  );

  // graffiti decal on left wall
  const graffiti = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshStandardMaterial({ map: graffitiTexture(), transparent: true, roughness: 1 })
  );
  graffiti.position.set(-ROOM_W / 2 + 0.02, 2.6, -5);
  graffiti.rotation.y = Math.PI / 2;
  scene.add(graffiti);

  // ---------- sign ----------
  const signMat = new THREE.MeshStandardMaterial({ map: signTexture('TOY ZONE', 'BIENVENUE CHEZ'), roughness: 0.6, emissive: 0x111111, emissiveIntensity: 0.15 });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.9), signMat);
  sign.position.set(0, 2.55, -ROOM_D / 2 + 0.05);
  scene.add(sign);

  // ---------- fluorescent ceiling fixture ----------
  const fixtureMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcfe8ff, emissiveIntensity: 0.9 });
  const fixture = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.5), fixtureMat);
  fixture.position.set(0, ROOM_H - 0.08, 1);
  scene.add(fixture);

  const fixtureFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.2, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.6, metalness: 0.4 })
  );
  fixtureFrame.position.set(0, ROOM_H - 0.02, 1);
  scene.add(fixtureFrame);

  const mainLight = new THREE.PointLight(0xcfe3ff, 2.4, 16, 1.6);
  mainLight.position.set(0, ROOM_H - 0.3, 1);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.set(1024, 1024);
  mainLight.shadow.bias = -0.003;
  scene.add(mainLight);
  flickerLights.push({ light: mainLight, base: 2.4, mesh: fixtureMat });

  // second dim fixture near the back of the room so it isn't a single pool of light
  const backLight = new THREE.PointLight(0x9fb3d9, 1.1, 12, 1.8);
  backLight.position.set(-2, ROOM_H - 0.4, -6);
  scene.add(backLight);

  // ambient fill (cold, dim) — keeps geometry legible outside the light pools
  const ambient = new THREE.AmbientLight(0x3a4055, 1.3);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0x4a5570, 0x0d0b08, 0.8);
  scene.add(hemi);

  // ---------- gumball machine row ----------
  const ballColors = [0xff4d4d, 0xffd23f, 0x3fa9f5, 0x4dff88, 0xff7ed4, 0xffa64d];
  function gumballMachine(x, z) {
    const group = new THREE.Group();

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.36, 1.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x2f6fbf, roughness: 0.35, metalness: 0.5 })
    );
    base.position.y = 0.525;
    base.castShadow = true;
    group.add(base);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 24, 20),
      new THREE.MeshPhysicalMaterial({
        color: 0xdfefff,
        roughness: 0.05,
        metalness: 0,
        transmission: 0.9,
        thickness: 0.3,
        transparent: true,
        opacity: 0.35,
      })
    );
    globe.position.y = 1.35;
    group.add(globe);

    const ballGeo = new THREE.SphereGeometry(0.06, 10, 8);
    const count = 55;
    for (let i = 0; i < count; i++) {
      const color = ballColors[i % ballColors.length];
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 });
      const ball = new THREE.Mesh(ballGeo, mat);
      const r = Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const yLevel = 1.02 + Math.random() * 0.35;
      ball.position.set(Math.cos(theta) * r, yLevel, Math.sin(theta) * r);
      group.add(ball);
    }

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.24, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0x1c1c1f, roughness: 0.5, metalness: 0.4 })
    );
    cap.position.y = 1.85;
    group.add(cap);

    group.position.set(x, 0, z);
    scene.add(group);

    colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(0.7, 2, 0.7)));
    return group;
  }
  gumballMachine(-3.6, -6.4);
  gumballMachine(-2.5, -6.4);
  gumballMachine(-1.4, -6.4);
  gumballMachine(-0.3, -6.4);

  // ---------- shelving rack with toy boxes ----------
  function shelfUnit(x, z, rotY) {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8a8f98, roughness: 0.6, metalness: 0.5 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.5), frameMat);
    frame.position.y = 1.1;
    frame.castShadow = true;
    group.add(frame);

    const boxColors = [0xd94b4b, 0xf2c14e, 0x3f8efc, 0x5ec27a, 0xe06bd0];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const bw = 0.6, bh = 0.5, bd = 0.35;
        const mat = new THREE.MeshStandardMaterial({ color: boxColors[(row * 3 + col) % boxColors.length], roughness: 0.7 });
        const box = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mat);
        box.position.set(-0.7 + col * 0.7, 0.35 + row * 0.65, 0.08);
        box.castShadow = true;
        group.add(box);
      }
    }
    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    scene.add(group);

    const size = new THREE.Vector3(2.4, 2.2, 0.5);
    const half = size.clone().multiplyScalar(0.5);
    const c = new THREE.Vector3(x, 1.1, z);
    // rotate collider footprint if rotated 90deg
    if (Math.abs(rotY % Math.PI) > 0.1) {
      colliders.push(new THREE.Box3().setFromCenterAndSize(c, new THREE.Vector3(size.z, size.y, size.x)));
    } else {
      colliders.push(new THREE.Box3().setFromCenterAndSize(c, size));
    }
    return group;
  }
  shelfUnit(-ROOM_W / 2 + 0.3, -1, Math.PI / 2);
  shelfUnit(-ROOM_W / 2 + 0.3, 2, Math.PI / 2);
  shelfUnit(-ROOM_W / 2 + 0.3, -4, Math.PI / 2);

  // ---------- claw machine (right side, dark) ----------
  const claw = new THREE.Group();
  const clawBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.4, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x17171a, roughness: 0.4, metalness: 0.6 })
  );
  clawBody.position.y = 1.2;
  clawBody.castShadow = true;
  claw.add(clawBody);
  const clawGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.3, 1.02),
    new THREE.MeshPhysicalMaterial({ color: 0x88bfff, roughness: 0.05, transmission: 0.85, transparent: true, opacity: 0.25 })
  );
  clawGlass.position.y = 1.55;
  claw.add(clawGlass);
  const topSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.3, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x220022, emissive: 0x6a1f8f, emissiveIntensity: 0.6, roughness: 0.5 })
  );
  topSign.position.y = 2.55;
  claw.add(topSign);
  claw.position.set(ROOM_W / 2 - 0.9, 0, -4);
  claw.rotation.y = -Math.PI / 2;
  scene.add(claw);
  colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(ROOM_W / 2 - 0.9, 1.2, -4), new THREE.Vector3(1.3, 2.6, 1.5)));

  // small skull prop on top of claw machine
  const skull = buildSkull();
  skull.position.set(ROOM_W / 2 - 0.9, 2.75, -3.6);
  skull.scale.setScalar(0.55);
  skull.rotation.set(0.1, 0.6, -0.15);
  scene.add(skull);

  // ---------- collectible crystal ----------
  const crystalGroup = new THREE.Group();
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x6fd8ff,
    emissive: 0x2a9fd6,
    emissiveIntensity: 0.9,
    roughness: 0.1,
    metalness: 0,
    transmission: 0.6,
    transparent: true,
    opacity: 0.9,
  });
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), crystalMat);
  crystal.scale.y = 1.8;
  crystal.position.y = 0.9;
  crystal.castShadow = true;
  crystalGroup.add(crystal);

  const glow = new THREE.PointLight(0x6fd8ff, 2.2, 5, 2);
  glow.position.y = 0.9;
  crystalGroup.add(glow);

  const haloGeo = new THREE.CircleGeometry(0.9, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    map: radialGlow('#3fa9f5'),
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.02;
  crystalGroup.add(halo);

  crystalGroup.position.set(-1, 0, 1.5);
  scene.add(crystalGroup);

  interactive.push({
    type: 'crystal',
    object: crystalGroup,
    radius: 1.4,
    collected: false,
    update: (t) => {
      crystal.rotation.y = t * 1.2;
      crystal.position.y = 0.9 + Math.sin(t * 1.8) * 0.08;
      halo.material.opacity = 0.2 + Math.sin(t * 2.2) * 0.08;
      halo.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);
    },
  });

  // fog
  scene.fog = new THREE.FogExp2(0x15171c, 0.022);

  return { colliders, interactive, flickerLights };
}

function buildSkull() {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xd9c9a3, roughness: 0.75 });
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 14), mat);
  cranium.scale.set(1, 0.95, 1.1);
  group.add(cranium);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.5), mat);
  jaw.position.set(0, -0.42, 0.1);
  group.add(jaw);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1 });
  const eyeGeo = new THREE.SphereGeometry(0.11, 10, 8);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.18, 0.02, 0.42);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.18;
  group.add(eyeL, eyeR);
  group.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return group;
}
