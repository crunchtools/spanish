import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { guides } from '../config/vocabulary.js';
import { EYE_HEIGHT } from '../utils/constants.js';

export class GuideModel {
  constructor(guideId, game) {
    this.game = game;
    this.guideData = guides[guideId];
    this.time = 0;
    this.baseY = EYE_HEIGHT + 0.3;

    // Create sprite from emoji text rendered to canvas
    this.sprite = this.createEmojiSprite(this.guideData.emoji);
    this.sprite.position.set(-1.5, this.baseY, 2);
    this.sprite.scale.set(0.6, 0.6, 0.6);

    // Speech bubble via CSS2D — created but managed by HUD
    this.labelObject = null;
  }

  createEmojiSprite(emoji) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = '96px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });

    return new THREE.Sprite(material);
  }

  update(delta) {
    this.time += delta;
    // Sine-wave bob
    this.sprite.position.y = this.baseY + Math.sin(this.time * 2) * 0.08;

    // Face the camera
    // Sprites auto-face camera by default in Three.js
  }

  getGreeting() {
    const greetings = this.guideData.greetings;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  dispose() {
    if (this.sprite.material.map) {
      this.sprite.material.map.dispose();
    }
    this.sprite.material.dispose();
  }
}
