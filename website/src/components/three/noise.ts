function hash(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), xf);
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), xf);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), xf);
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), xf);
  return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf) * 2 - 1;
}

export function fbm3(x: number, y: number, z: number, octaves = 4) {
  let sum = 0, amp = 0.5, f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += noise3(x * f, y * f, z * f) * amp;
    f *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

export function noise2(x: number, y: number) {
  return noise3(x, y, 0.5);
}

/** Cellular noise: distances to the nearest (f1) and second-nearest (f2) jittered feature points. */
export function worley3(x: number, y: number, z: number): [number, number] {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  let f1 = 9, f2 = 9;
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      for (let dz = -1; dz <= 1; dz++) {
        const cx = xi + dx, cy = yi + dy, cz = zi + dz;
        const px = cx + 0.1 + hash(cx, cy, cz) * 0.8;
        const py = cy + 0.1 + hash(cx + 17.3, cy + 5.1, cz + 9.7) * 0.8;
        const pz = cz + 0.1 + hash(cx + 3.9, cy + 29.1, cz + 13.3) * 0.8;
        const d = Math.hypot(px - x, py - y, pz - z);
        if (d < f1) {
          f2 = f1;
          f1 = d;
        } else if (d < f2) f2 = d;
      }
  return [f1, f2];
}
