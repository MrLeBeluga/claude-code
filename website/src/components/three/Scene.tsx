"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { noise3, ridged, seededRandom } from "./noise";

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

function useTruffleGeometry() {
  return useMemo(() => {
    let geo: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, 64);
    geo.deleteAttribute("normal");
    geo.deleteAttribute("uv");
    geo = mergeVertices(geo);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      const lump = noise3(v.x * 1.3 + 7, v.y * 1.3, v.z * 1.3) * 0.22;
      const warts = ridged(v.x * 11, v.y * 11, v.z * 11) * 0.055;
      const grain = ridged(v.x * 26 + 3, v.y * 26, v.z * 26) * 0.014;
      v.multiplyScalar(1 + lump + warts + grain);
      v.y *= 0.9;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function makeMarbleTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
  g.addColorStop(0, "#3a2a22");
  g.addColorStop(1, "#1a120e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.lineCap = "round";
  for (let i = 0; i < 70; i++) {
    let x = Math.random() * size;
    let y = Math.random() * size;
    let a = Math.random() * Math.PI * 2;
    ctx.strokeStyle = `rgba(236, 222, 200, ${0.25 + Math.random() * 0.5})`;
    ctx.lineWidth = 0.6 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 20 + Math.random() * 40;
    for (let s = 0; s < steps; s++) {
      a += (Math.random() - 0.5) * 0.9;
      x += Math.cos(a) * 6;
      y += Math.sin(a) * 6;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function useSliceGeometry(seed: number) {
  return useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.42, 0.42, 0.025, 72, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r < 0.01) continue;
      const a = Math.atan2(z, x);
      const k = 1 + noise3(Math.cos(a) * 1.6 + seed, Math.sin(a) * 1.6, seed) * 0.18 + ridged(Math.cos(a) * 6, Math.sin(a) * 6, seed) * 0.05;
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
}

function Slice({ seed, radius, speed, offset, tilt, marble }: { seed: number; radius: number; speed: number; offset: number; tilt: number; marble: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useSliceGeometry(seed);
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#16100c", roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: marble, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ map: marble, roughness: 0.55 }),
    ],
    [marble],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    const m = ref.current!;
    m.position.set(Math.cos(t) * radius, Math.sin(t * 1.3) * 0.35 + tilt, Math.sin(t) * radius * 0.6);
    m.rotation.set(t * 0.8 + 1.2, t * 0.5, tilt + 0.4);
  });
  return <mesh ref={ref} geometry={geo} material={materials} />;
}

function GoldDust({ count = 700 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const rand = seededRandom(42);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + rand() * 6;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.cos(ph) * 1.4;
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
    }
    return arr;
  }, [count]);
  useFrame(({ clock }) => {
    const p = ref.current!;
    p.rotation.y = clock.elapsedTime * 0.02;
    p.position.y = scrollProgress() * 3;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#d9b877" transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

function Truffle() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useTruffleGeometry();
  const marble = useMemo(() => makeMarbleTexture(), []);
  const { viewport, pointer } = useThree();
  const narrow = viewport.width < 6;

  useFrame((_, dt) => {
    const p = scrollProgress();
    const g = group.current!;
    const phase = Math.min(p / 0.18, 1);
    const eased = phase * phase * (3 - 2 * phase);
    const baseX = narrow ? 0 : viewport.width * 0.22;
    const targetX = narrow ? 0 : THREE.MathUtils.lerp(baseX, -viewport.width * 0.26, eased);
    const targetY = (narrow ? 0.95 : 0) + p * 1.2;
    const targetS = (narrow ? 0.55 : 1) * (1 - eased * 0.25);
    const k = 1 - Math.exp(-dt * 3);
    g.position.x += (targetX - g.position.x) * k;
    g.position.y += (targetY - g.position.y) * k;
    g.scale.setScalar(g.scale.x + (targetS - g.scale.x) * k);
    g.rotation.y += (pointer.x * 0.5 - g.rotation.y) * k * 0.5;
    g.rotation.x += (-pointer.y * 0.3 - g.rotation.x) * k * 0.5;
    mesh.current!.rotation.y += dt * 0.12;
    mesh.current!.rotation.z = p * Math.PI;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={mesh} geometry={geo} castShadow>
          <meshPhysicalMaterial color="#1c1612" roughness={0.78} metalness={0.05} clearcoat={0.15} clearcoatRoughness={0.6} sheen={0.4} sheenColor="#6b5a45" />
        </mesh>
        <Slice seed={1} radius={1.9} speed={0.35} offset={0} tilt={0.2} marble={marble} />
        <Slice seed={5} radius={2.2} speed={0.28} offset={2.1} tilt={-0.3} marble={marble} />
        <Slice seed={9} radius={1.7} speed={0.42} offset={4.2} tilt={0.5} marble={marble} />
      </Float>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0 !pointer-events-none"
      style={{ position: "fixed", zIndex: 0 }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={3.2} color="#f3d9a4" />
      <pointLight position={[-4, -1, -3]} intensity={30} color="#3f8a85" />
      <pointLight position={[0, -4, 3]} intensity={6} color="#c8a96a" />
      <Truffle />
      <GoldDust />
    </Canvas>
  );
}
