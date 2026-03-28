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
  'oso de peluche'() {
    // Block teddy bear sitting on floor against wall
    const group = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xC49A6C, roughness: 0.9 });

    // Body (round-ish, use box)
    const bodyGeo = new THREE.BoxGeometry(0.35, 0.4, 0.3);
    const body = new THREE.Mesh(bodyGeo, furMat);
    body.position.y = 0.2;
    group.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.3, 0.3, 0.28);
    const head = new THREE.Mesh(headGeo, furMat.clone());
    head.position.set(0, 0.52, 0);
    group.add(head);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.1, 0.1, 0.08);
    const leftEar = new THREE.Mesh(earGeo, furMat.clone());
    leftEar.position.set(-0.13, 0.7, 0);
    group.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo.clone(), furMat.clone());
    rightEar.position.set(0.13, 0.7, 0);
    group.add(rightEar);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.02);
    const lEye = new THREE.Mesh(eyeGeo, eyeMat);
    lEye.position.set(-0.07, 0.56, 0.14);
    group.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo.clone(), eyeMat.clone());
    rEye.position.set(0.07, 0.56, 0.14);
    group.add(rEye);

    // Nose
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const noseGeo = new THREE.BoxGeometry(0.06, 0.04, 0.03);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.48, 0.14);
    group.add(nose);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.12, 0.25, 0.12);
    const lArm = new THREE.Mesh(armGeo, furMat.clone());
    lArm.position.set(-0.25, 0.22, 0.05);
    lArm.rotation.z = 0.4;
    group.add(lArm);
    const rArm = new THREE.Mesh(armGeo.clone(), furMat.clone());
    rArm.position.set(0.25, 0.22, 0.05);
    rArm.rotation.z = -0.4;
    group.add(rArm);

    // Legs (sitting, splayed forward)
    const legGeo = new THREE.BoxGeometry(0.14, 0.12, 0.22);
    const lLeg = new THREE.Mesh(legGeo, furMat.clone());
    lLeg.position.set(-0.1, 0.06, 0.12);
    group.add(lLeg);
    const rLeg = new THREE.Mesh(legGeo.clone(), furMat.clone());
    rLeg.position.set(0.1, 0.06, 0.12);
    group.add(rLeg);

    return group;
  },

  lámpara() {
    // Floor lamp: tall pole + shade
    const group = new THREE.Group();

    // Base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.6 });
    const baseGeo = new THREE.BoxGeometry(0.3, 0.05, 0.3);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.025;
    group.add(base);

    // Pole
    const poleGeo = new THREE.BoxGeometry(0.04, 1.2, 0.04);
    const pole = new THREE.Mesh(poleGeo, baseMat.clone());
    pole.position.y = 0.65;
    group.add(pole);

    // Shade (trapezoid-ish box)
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xFFF8DC,
      roughness: 0.8,
      emissive: 0xFFF8DC,
      emissiveIntensity: 0.3,
    });
    const shadeGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 1.35;
    group.add(shade);

    return group;
  },

  libro() {
    // Small bookshelf with books on it
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7 });

    // Shelf frame — two sides + two shelves + back
    const sideGeo = new THREE.BoxGeometry(0.05, 0.9, 0.3);
    const leftSide = new THREE.Mesh(sideGeo, woodMat);
    leftSide.position.set(-0.3, 0.45, 0);
    group.add(leftSide);
    const rightSide = new THREE.Mesh(sideGeo.clone(), woodMat.clone());
    rightSide.position.set(0.3, 0.45, 0);
    group.add(rightSide);

    const shelfGeo = new THREE.BoxGeometry(0.65, 0.04, 0.3);
    const bottomShelf = new THREE.Mesh(shelfGeo, woodMat.clone());
    bottomShelf.position.set(0, 0.02, 0);
    group.add(bottomShelf);
    const midShelf = new THREE.Mesh(shelfGeo.clone(), woodMat.clone());
    midShelf.position.set(0, 0.45, 0);
    group.add(midShelf);
    const topShelf = new THREE.Mesh(shelfGeo.clone(), woodMat.clone());
    topShelf.position.set(0, 0.9, 0);
    group.add(topShelf);

    // Back panel
    const backGeo = new THREE.BoxGeometry(0.65, 0.9, 0.02);
    const back = new THREE.Mesh(backGeo, woodMat.clone());
    back.position.set(0, 0.45, -0.14);
    group.add(back);

    // Books on shelves (colored blocks, leaning)
    const bookColors = [0xEF4444, 0x3B82F6, 0x10B981, 0xF59E0B, 0x8B5CF6, 0xEC4899];
    const bookData = [
      // Bottom shelf
      { x: -0.15, y: 0.22, w: 0.08, h: 0.35, c: 0 },
      { x: -0.05, y: 0.22, w: 0.06, h: 0.38, c: 1 },
      { x: 0.04, y: 0.22, w: 0.07, h: 0.32, c: 2 },
      { x: 0.13, y: 0.22, w: 0.06, h: 0.36, c: 3 },
      // Top shelf
      { x: -0.12, y: 0.67, w: 0.07, h: 0.34, c: 4 },
      { x: -0.03, y: 0.67, w: 0.08, h: 0.30, c: 5 },
      { x: 0.08, y: 0.67, w: 0.06, h: 0.36, c: 0 },
    ];
    bookData.forEach((b) => {
      const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[b.c], roughness: 0.6 });
      const bookGeo = new THREE.BoxGeometry(b.w, b.h, 0.2);
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(b.x, b.y, 0);
      group.add(book);
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
    if (this.wordData.model) {
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
        this.createPlaceholder();
      }
    } else {
      // No GLB model — use geometric or generic placeholder
      this.createPlaceholder();
    }

    // Add invisible hit box for reliable click/hover detection
    this.addHitBox();

    this.createLabel();
  }

  addHitBox() {
    if (!this.mesh) return;

    // Compute bounding box of the mesh
    const box = new THREE.Box3().setFromObject(this.mesh);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Minimum clickable size
    size.x = Math.max(size.x, 0.5);
    size.y = Math.max(size.y, 0.5);
    size.z = Math.max(size.z, 0.5);

    const hitGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitBox = new THREE.Mesh(hitGeo, hitMat);
    // Position relative to group origin
    this.hitBox.position.copy(center).sub(this.group.position);
    this.group.add(this.hitBox);
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

    this.label = new CSS2DObject(div);
    this.label.position.set(0, 1.2, 0);
    this.label.visible = false; // hidden until learned + labels toggled on
    this.group.add(this.label);
  }

  showLabel() {
    this.labelVisible = true;
    this.learned = true;
    // Only actually display if global labels toggle is on
    if (this.label) {
      this.label.visible = !!this.game._labelsVisible;
    }
  }

  setLabelDisplay(visible) {
    if (!this.label) return;
    // Only show if this object has been learned AND global toggle is on
    this.label.visible = visible && this.labelVisible;
  }

  setHighlight(on) {
    if (!this.mesh) return;
    const intensity = on ? 0.4 : 0;
    const color = 0xfbbf24; // warm yellow highlight
    this.mesh.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        child.material.emissive.setHex(on ? color : 0x000000);
        child.material.emissiveIntensity = intensity;
      }
    });
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
