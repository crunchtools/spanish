import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { tweenGroup } from '../utils/tweenGroup.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLOW_COLOR, GLOW_INTENSITY, GLOW_PULSE_SPEED } from '../utils/constants.js';

// Word-specific geometric models for items without GLB files
const GEOMETRIC_MODELS = {
  reloj() {
    // Wall clock: round face + frame + hands
    const group = new THREE.Group();

    // Clock body (flat box)
    const bodyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.08);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Clock face (slightly in front)
    const faceGeo = new THREE.BoxGeometry(0.5, 0.5, 0.02);
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xFFFFF0, roughness: 0.3 });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0.05;
    group.add(face);

    // Hour hand
    const hourGeo = new THREE.BoxGeometry(0.04, 0.18, 0.02);
    const handMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const hour = new THREE.Mesh(hourGeo, handMat);
    hour.position.set(0, 0.05, 0.07);
    hour.rotation.z = -0.5;
    group.add(hour);

    // Minute hand
    const minGeo = new THREE.BoxGeometry(0.03, 0.22, 0.02);
    const minute = new THREE.Mesh(minGeo, handMat.clone());
    minute.position.set(0.03, 0.06, 0.07);
    minute.rotation.z = 0.8;
    group.add(minute);

    // Center dot
    const dotGeo = new THREE.BoxGeometry(0.05, 0.05, 0.03);
    const dot = new THREE.Mesh(dotGeo, handMat.clone());
    dot.position.z = 0.07;
    group.add(dot);

    return group;
  },

  gato() {
    // Block cat: body + head + ears + tail
    const group = new THREE.Group();
    const catMat = new THREE.MeshStandardMaterial({ color: 0xFB923C, roughness: 0.7 });

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.35, 0.25, 0.5);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.y = 0.25;
    group.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const head = new THREE.Mesh(headGeo, catMat.clone());
    head.position.set(0, 0.42, 0.3);
    group.add(head);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.08, 0.1, 0.06);
    const leftEar = new THREE.Mesh(earGeo, catMat.clone());
    leftEar.position.set(-0.1, 0.6, 0.3);
    group.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo.clone(), catMat.clone());
    rightEar.position.set(0.1, 0.6, 0.3);
    group.add(rightEar);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const eyeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.08, 0.46, 0.46);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo.clone(), eyeMat.clone());
    rightEye.position.set(0.08, 0.46, 0.46);
    group.add(rightEye);

    // Nose
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xFF6B9D });
    const noseGeo = new THREE.BoxGeometry(0.04, 0.03, 0.02);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.40, 0.46);
    group.add(nose);

    // Tail
    const tailGeo = new THREE.BoxGeometry(0.06, 0.06, 0.4);
    const tail = new THREE.Mesh(tailGeo, catMat.clone());
    tail.position.set(0, 0.35, -0.35);
    tail.rotation.x = 0.5;
    group.add(tail);

    // Legs (4 small boxes)
    const legGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
    const positions = [
      [-0.1, 0.06, 0.15],
      [0.1, 0.06, 0.15],
      [-0.1, 0.06, -0.15],
      [0.1, 0.06, -0.15],
    ];
    positions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo.clone(), catMat.clone());
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });

    return group;
  },
};

export class VocabObject {
  constructor(wordData, game) {
    this.wordData = wordData;
    this.game = game;
    this.group = new THREE.Group();
    this.group.userData.vocabWord = wordData.word;
    this.mesh = null;
    this.label = null;
    this.labelVisible = false;
    this.glowTime = Math.random() * Math.PI * 2; // random phase offset
    this.learned = false;

    // Position the group
    this.group.position.set(
      wordData.position.x,
      wordData.position.y,
      wordData.position.z
    );
    if (wordData.rotation) {
      this.group.rotation.y = wordData.rotation;
    }
  }

  async load(assetLoader) {
    try {
      const model = await assetLoader.loadModel(
        `/models/bedroom/${this.wordData.model}`
      );
      this.mesh = model.scene;
      this.mesh.scale.setScalar(this.wordData.scale || 1);
      this.mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.group.add(this.mesh);
    } catch {
      // Fallback: colored cube placeholder
      this.createPlaceholder();
    }

    this.createLabel();
  }

  createPlaceholder() {
    // Try word-specific geometric models first
    const builder = GEOMETRIC_MODELS[this.wordData.word];
    if (builder) {
      this.mesh = builder();
      this.mesh.castShadow = true;
      this.group.add(this.mesh);
      return;
    }

    // Generic fallback cube
    const colors = [0xff6b9d, 0xc084fc, 0x60a5fa, 0x2dd4bf, 0xfbbf24, 0xfb923c, 0x4ade80, 0xa78bfa];
    const colorIndex = Math.abs(this.wordData.word.charCodeAt(0)) % colors.length;

    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const mat = new THREE.MeshStandardMaterial({
      color: colors[colorIndex],
      roughness: 0.5,
      metalness: 0.1,
      emissive: colors[colorIndex],
      emissiveIntensity: 0.1,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = true;
    this.mesh.position.y = 0.25;
    this.group.add(this.mesh);
  }

  createLabel() {
    const div = document.createElement('div');
    div.className = 'vocab-label';
    div.textContent = this.wordData.spanish;
    div.style.display = 'none';

    this.label = new CSS2DObject(div);
    this.label.position.set(0, 1.2, 0);
    this.group.add(this.label);
  }

  showLabel() {
    if (this.label) {
      this.label.element.style.display = 'block';
      this.labelVisible = true;
    }
    this.learned = true;
  }

  bounce() {
    if (!this.mesh) return;
    const startY = this.mesh.position.y;
    new Tween(this.mesh.position, tweenGroup)
      .to({ y: startY + 0.3 }, 200)
      .easing(Easing.Quadratic.Out)
      .chain(
        new Tween(this.mesh.position, tweenGroup)
          .to({ y: startY }, 200)
          .easing(Easing.Bounce.Out)
      )
      .start();
  }

  update(delta) {
    if (this.learned || !this.mesh) return;

    // Pulsing glow for untapped objects
    this.glowTime += delta * GLOW_PULSE_SPEED;
    const intensity = (Math.sin(this.glowTime) * 0.5 + 0.5) * GLOW_INTENSITY;

    this.mesh.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.material.emissive.setHex(GLOW_COLOR);
        child.material.emissiveIntensity = intensity;
      }
    });
  }

  dispose() {
    if (this.label) {
      this.label.element.remove();
    }
    this.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
