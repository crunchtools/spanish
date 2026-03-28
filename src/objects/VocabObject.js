import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLOW_COLOR, GLOW_INTENSITY, GLOW_PULSE_SPEED } from '../utils/constants.js';

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
    new TWEEN.Tween(this.mesh.position)
      .to({ y: startY + 0.3 }, 200)
      .easing(TWEEN.Easing.Quadratic.Out)
      .chain(
        new TWEEN.Tween(this.mesh.position)
          .to({ y: startY }, 200)
          .easing(TWEEN.Easing.Bounce.Out)
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
