import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const GrainVignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.4 },
    uGrain: { value: 0.03 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVignette;
    uniform float uGrain;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec4 color = texture2D(tDiffuse, uv);

      vec2 centered = uv - 0.5;
      float vig = 1.0 - dot(centered, centered) * uVignette * 2.2;
      color.rgb *= clamp(vig, 0.0, 1.0);

      float g = (rand(uv * vec2(1920.0, 1080.0) + uTime) - 0.5) * uGrain;
      color.rgb += g;

      color.rgb = mix(color.rgb, vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114))), 0.06);
      color.rgb *= vec3(0.97, 1.0, 1.05);

      gl_FragColor = color;
    }
  `,
};

export function createPostFX(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.35, 0.4, 0.86);
  composer.addPass(bloom);

  const grainPass = new ShaderPass(GrainVignetteShader);
  composer.addPass(grainPass);

  composer.addPass(new OutputPass());

  function setSize(w, h) {
    composer.setSize(w, h);
    bloom.setSize(w, h);
  }

  function update(t) {
    grainPass.uniforms.uTime.value = t;
  }

  return { composer, setSize, update };
}
