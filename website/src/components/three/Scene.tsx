"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { fbm3, noise2, noise3, worley3 } from "./noise";

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Tuber melanosporum: irregular lumpy body covered in small polygonal pyramidal warts,
// with soil lodged in the grooves between them.
function buildTruffle(detail: number) {
  let geo: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  geo = mergeVertices(geo);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const skin = new THREE.Color("#0f0d0c");
  const peak = new THREE.Color("#2a2725");
  const groove = new THREE.Color("#040303");
  const soil = new THREE.Color("#6b4a2e");
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const { x, y, z } = v;
    const lump = fbm3(x * 1.1 + 4, y * 1.1, z * 1.1, 3) * 0.2 + noise3(x * 2.4, y * 2.4 + 8, z * 2.4) * 0.05;

    const [f1, f2] = worley3(x * 8.5, y * 8.5, z * 8.5);
    const wart = Math.pow(clamp01((f2 - f1) / 0.55), 0.85);
    const [g1, g2] = worley3(x * 17 + 11, y * 17, z * 17);
    const small = clamp01((g2 - g1) / 0.5);
    const grain = noise3(x * 55, y * 55, z * 55);

    v.multiplyScalar(1 + lump + wart * 0.065 + small * 0.016 + grain * 0.003);
    v.x *= 1.04;
    v.y *= 0.86;
    pos.setXYZ(i, v.x, v.y, v.z);

    c.copy(groove).lerp(skin, smooth(0.0, 0.35, wart)).lerp(peak, smooth(0.6, 1, wart) * 0.7);
    const dirt = smooth(0.15, 0.55, fbm3(x * 3 + 2, y * 3, z * 3 + 5, 3) + 0.25) * (1 - smooth(0.05, 0.4, wart));
    c.lerp(soil, dirt * 0.32);
    c.multiplyScalar(0.85 + small * 0.25);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

// Cross-section ("gleba"): a photographed slice of real flesh, ringed by the dark skin.
function makeSliceTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  ctx.fillStyle = "#050404";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2500; i++) {
    const a = (i / 2500) * Math.PI * 2 * 7.13;
    const r = size * (0.46 + ((i * 37) % 97) / 97 * 0.04);
    ctx.fillStyle = i % 3 ? "#0c0908" : "#17110e";
    ctx.beginPath();
    ctx.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 2 + (i % 4), 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const img = new Image();
  img.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(c, c, size * 0.455, 0, Math.PI * 2);
    ctx.clip();
    const s = size * 1.1;
    ctx.filter = "brightness(0.72) saturate(0.9)";
    ctx.drawImage(img, c - s / 2, c - s / 2, s, s);
    ctx.filter = "none";
    ctx.restore();
    ctx.filter = "blur(2px)";
    ctx.strokeStyle = "rgba(150, 120, 90, 0.45)";
    ctx.lineWidth = size * 0.008;
    ctx.beginPath();
    ctx.arc(c, c, size * 0.452, 0, Math.PI * 2);
    ctx.stroke();
    ctx.filter = "none";
    tex.needsUpdate = true;
  };
  img.src = "/images/slice-texture.jpg";
  return tex;
}

function buildSlice() {
  const geo = new THREE.CylinderGeometry(0.62, 0.62, 0.035, 160, 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    if (Math.hypot(x, z) < 0.01) continue;
    const a = Math.atan2(z, x);
    const ca = Math.cos(a), sa = Math.sin(a);
    const [f1, f2] = worley3(ca * 5 + 20, sa * 5, 3.3);
    const k = 1 + noise2(ca * 1.4 + 5, sa * 1.4) * 0.09 + clamp01((f2 - f1) / 0.5) * 0.035;
    pos.setX(i, x * k * 1.08);
    pos.setZ(i, z * k * 0.92);
  }
  geo.computeVertexNormals();
  return geo;
}

function scrollTargets() {
  const vh = window.innerHeight;
  const intro = clamp01(window.scrollY / vh);
  const maison = document.getElementById("maison");
  const bottom = maison ? maison.getBoundingClientRect().bottom / vh : 2;
  const exit = clamp01((0.9 - bottom) / 0.6);
  return { intro, exit };
}

function Truffle() {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const slice = useRef<THREE.Mesh>(null);
  const { viewport, pointer, size } = useThree();
  const narrow = size.width < 768;
  const geo = useMemo(() => buildTruffle(narrow ? 80 : 120), [narrow]);
  const sliceGeo = useMemo(() => buildSlice(), []);
  const sliceTex = useMemo(() => makeSliceTexture(), []);
  const sliceMaterials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ color: "#0d0908", roughness: 0.95 });
    const face = new THREE.MeshStandardMaterial({ map: sliceTex, roughness: 0.75, envMapIntensity: 0.2 });
    return [side, face, face];
  }, [sliceTex]);

  useFrame(({ clock }, dt) => {
    const { intro, exit } = scrollTargets();
    const g = group.current!;
    const k = 1 - Math.exp(-dt * 2.5);
    const e = smooth(0, 1, intro);

    const x = narrow ? 0 : THREE.MathUtils.lerp(viewport.width * 0.2, -viewport.width * 0.24, e);
    const y = (narrow ? viewport.height * 0.26 + intro * 2.5 : -0.05) + exit * viewport.height * 0.9;
    const s = narrow ? Math.min(0.45, viewport.width * 0.22) : 1 - e * 0.18;

    g.position.x += (x - g.position.x) * k;
    g.position.y += (y - g.position.y) * k;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k);
    g.rotation.y += (pointer.x * 0.25 - g.rotation.y) * k * 0.6;
    g.rotation.x += (-pointer.y * 0.15 - g.rotation.x) * k * 0.6;

    const t = clock.elapsedTime;
    body.current!.rotation.y = t * 0.08 + intro * 1.4;
    body.current!.position.y = Math.sin(t * 0.6) * 0.04;
    slice.current!.rotation.z = -0.35 + Math.sin(t * 0.4) * 0.05;
    slice.current!.position.y = -0.7 + Math.sin(t * 0.6 + 1.2) * 0.03;
  });

  return (
    <group ref={group}>
      <mesh ref={body} geometry={geo}>
        <meshPhysicalMaterial vertexColors roughness={0.86} metalness={0} sheen={0.3} sheenRoughness={0.8} sheenColor="#5d5a57" />
      </mesh>
      <mesh ref={slice} geometry={sliceGeo} material={sliceMaterials} position={[-0.95, -0.7, 0.45]} rotation={[1.2, 0.1, -0.35]} scale={0.72} />
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0 !pointer-events-none"
      style={{ position: "fixed", zIndex: 0 }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMappingExposure: 1.05 }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff4e6" position={[4, 5, 3]} scale={[4, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.6} color="#e9eef0" position={[-5, 1, 2]} scale={[3, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.4} color="#f0e2cc" position={[-2, 3, -5]} scale={3} target={[0, 0, 0]} />
      </Environment>
      <directionalLight position={[5, 4, 2]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-4, 2, -4]} intensity={1.2} color="#d8e4e6" />
      <ambientLight intensity={0.08} />
      <Truffle />
    </Canvas>
  );
}
