import * as THREE from 'three';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function noise2D(seed) {
  // cheap deterministic value-noise
  let s = seed;
  return (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
    return n - Math.floor(n);
  };
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mkTex(c, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function woodPlankWall({ base = '#6b6f76', dark = '#3c3f45', seed = 1 } = {}) {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  const rnd = mulberry32(seed);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const plankH = 42;
  for (let y = 0; y < h; y += plankH) {
    const shade = 0.85 + rnd() * 0.3;
    ctx.fillStyle = shadeColor(base, shade);
    ctx.fillRect(0, y, w, plankH - 3);
    // grain streaks
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    for (let i = 0; i < 14; i++) {
      const gy = y + rnd() * plankH;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x < w; x += 24) {
        ctx.lineTo(x, gy + (rnd() - 0.5) * 3);
      }
      ctx.stroke();
    }
    // seam
    ctx.fillStyle = dark;
    ctx.fillRect(0, y + plankH - 3, w, 3);
  }

  // grime streaks / water stains
  for (let i = 0; i < 30; i++) {
    const x = rnd() * w;
    const yTop = rnd() * h * 0.4;
    const len = 60 + rnd() * 220;
    const grad = ctx.createLinearGradient(x, yTop, x, yTop + len);
    grad.addColorStop(0, 'rgba(20,20,25,0.18)');
    grad.addColorStop(1, 'rgba(20,20,25,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - 6, yTop, 12 + rnd() * 10, len);
  }

  return mkTex(c, 3, 1.5);
}

function shadeColor(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.min(255, Math.max(0, Math.round(r * factor)));
  g = Math.min(255, Math.max(0, Math.round(g * factor)));
  b = Math.min(255, Math.max(0, Math.round(b * factor)));
  return `rgb(${r},${g},${b})`;
}

export function concreteFloor({ seed = 2 } = {}) {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  const rnd = mulberry32(seed);

  ctx.fillStyle = '#4a4236';
  ctx.fillRect(0, 0, w, h);

  // speckle noise
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (rnd() - 0.5) * 26;
    img.data[i] += v;
    img.data[i + 1] += v;
    img.data[i + 2] += v * 0.8;
  }
  ctx.putImageData(img, 0, 0);

  // plank flooring lines (wide wooden boards, matches ref image floor)
  ctx.strokeStyle = 'rgba(20,15,10,0.35)';
  ctx.lineWidth = 2;
  const boardW = 64;
  for (let x = 0; x < w; x += boardW) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const y = rnd() * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y + (rnd() - 0.5) * 6);
    ctx.stroke();
  }

  // dirt patches
  for (let i = 0; i < 40; i++) {
    const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 30;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(10,8,5,0.25)');
    grad.addColorStop(1, 'rgba(10,8,5,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return mkTex(c, 6, 6);
}

export function dropCeiling({ seed = 3 } = {}) {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  const rnd = mulberry32(seed);

  ctx.fillStyle = '#c9cdd3';
  ctx.fillRect(0, 0, w, h);

  const tile = 128;
  for (let y = 0; y < h; y += tile) {
    for (let x = 0; x < w; x += tile) {
      const shade = 0.9 + rnd() * 0.15;
      ctx.fillStyle = shadeColor('#c9cdd3', shade);
      ctx.fillRect(x + 2, y + 2, tile - 4, tile - 4);
      // stain
      if (rnd() < 0.3) {
        const grad = ctx.createRadialGradient(
          x + tile / 2, y + tile / 2, 0,
          x + tile / 2, y + tile / 2, tile / 2.2
        );
        grad.addColorStop(0, 'rgba(120,110,80,0.15)');
        grad.addColorStop(1, 'rgba(120,110,80,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, tile, tile);
      }
    }
  }
  ctx.strokeStyle = 'rgba(40,40,45,0.5)';
  ctx.lineWidth = 3;
  for (let y = 0; y <= h; y += tile) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let x = 0; x <= w; x += tile) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  return mkTex(c, 3, 3);
}

export function signTexture(title = 'TOY ZONE', subtitle = 'BIENVENUE') {
  const w = 1024, h = 384;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#1c4fa0';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, w - 16, h - 16);

  // stars
  function star(cx, cy, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.45;
      const x = cx + Math.cos(ang) * rad;
      const y = cy + Math.sin(ang) * rad;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  star(870, 90, 55, '#0d2f6b');
  star(150, 300, 70, '#ffffff88');
  star(780, 300, 45, '#a9d0ff');

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px Arial';
  ctx.fillText(subtitle, w / 2, 120);

  ctx.font = 'bold 130px Arial';
  const colors = ['#ffd400', '#ff3b3b', '#2ecc71', '#ff9f1c', '#3fb6ff'];
  const letters = title.split('');
  let totalW = 0;
  const widths = letters.map((l) => ctx.measureText(l).width * 1.02);
  totalW = widths.reduce((a, b) => a + b, 0);
  let x = w / 2 - totalW / 2;
  letters.forEach((l, i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.strokeStyle = '#00000055';
    ctx.lineWidth = 4;
    const cx = x + widths[i] / 2;
    ctx.save();
    ctx.translate(cx, 250);
    ctx.rotate((i - letters.length / 2) * 0.01);
    ctx.fillText(l, 0, 0);
    ctx.strokeText(l, 0, 0);
    ctx.restore();
    x += widths[i];
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function radialGlow(color = '#3fa9f5') {
  const size = 256;
  const c = canvas(size, size);
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color + 'cc');
  grad.addColorStop(0.4, color + '55');
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export function graffitiTexture() {
  const w = 512, h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.font = 'italic bold 64px Arial';
  ctx.fillStyle = 'rgba(230,230,235,0.85)';
  ctx.save();
  ctx.translate(60, 300);
  ctx.rotate(-0.08);
  ctx.fillText('WATCH IT', 0, 0);
  ctx.restore();
  ctx.strokeStyle = 'rgba(230,230,235,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, 340);
  ctx.lineTo(420, 320);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
