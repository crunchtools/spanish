import * as THREE from 'three';
import { CharacterBuilder, DEFAULT_CHARACTER } from '../objects/CharacterBuilder.js';

const HAIR_STYLES = ['short', 'long', 'ponytail', 'curly'];

const HAIR_COLORS = ['#8B4513', '#2C1608', '#D4A017', '#C0392B', '#E67E22', '#1A1A2E'];
const SKIN_COLORS = ['#FDDBB4', '#DEB887', '#C68642', '#8D5524', '#70401A', '#503020'];
const SHIRT_COLORS = ['#FF6B9D', '#C084FC', '#60A5FA', '#2DD4BF', '#4ADE80', '#FBBF24', '#FB923C', '#EF4444'];
const PANTS_COLORS = ['#60A5FA', '#1E3A5F', '#8B4513', '#4A4A4A', '#2DD4BF', '#C084FC'];
const SHOE_COLORS = ['#FFFFFF', '#222222', '#FF6B9D', '#8B4513'];

const SHIRT_PATTERNS = ['solid', 'stripes', 'star'];

export class CharacterCreator {
  constructor(game) {
    this.game = game;
    this.config = { ...DEFAULT_CHARACTER };
    this.previewRenderer = null;
    this.previewScene = null;
    this.previewCamera = null;
    this.previewCharacter = null;
    this.animationId = null;
    this.previewTime = 0;

    this.onReady = null; // callback when player clicks "Ready!"
  }

  /**
   * Show the character creator overlay.
   * @param {Function} onReady - called with config when player clicks Ready
   */
  show(onReady) {
    this.onReady = onReady;

    // Load saved config if exists
    const saved = this.game.progress.data.character;
    if (saved) {
      this.config = { ...DEFAULT_CHARACTER, ...saved };
    }

    const overlay = document.getElementById('character-creator-overlay');
    overlay.style.display = 'flex';

    this.setupPreview();
    this.setupControls();
    this.updatePreview();
  }

  hide() {
    const overlay = document.getElementById('character-creator-overlay');
    overlay.style.display = 'none';
    this.disposePreview();
  }

  setupPreview() {
    const canvas = document.getElementById('cc-preview-canvas');

    this.previewScene = new THREE.Scene();
    this.previewScene.background = new THREE.Color(0xe0e7ff);

    // Camera looking at character
    this.previewCamera = new THREE.PerspectiveCamera(40, 200 / 300, 0.1, 20);
    this.previewCamera.position.set(0, 1.2, 3.5);
    this.previewCamera.lookAt(0, 0.9, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    this.previewScene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 3, 2);
    this.previewScene.add(dir);
    const fill = new THREE.DirectionalLight(0xffeedd, 0.4);
    fill.position.set(-2, 1, -1);
    this.previewScene.add(fill);

    // Floor disc for grounding
    const floorGeo = new THREE.CircleGeometry(1.2, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xc7a882, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.previewScene.add(floor);

    // Renderer
    this.previewRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.previewRenderer.setSize(200, 300);
    this.previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.previewRenderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Start animation loop
    this.previewTime = 0;
    this.animatePreview();
  }

  animatePreview() {
    this.animationId = requestAnimationFrame(() => this.animatePreview());

    if (!this.previewCharacter) return;

    // Idle bob + slow turntable rotation
    this.previewTime += 0.016;
    this.previewCharacter.position.y = Math.sin(this.previewTime * 2) * 0.03;
    this.previewCharacter.rotation.y += 0.005;

    this.previewRenderer.render(this.previewScene, this.previewCamera);
  }

  updatePreview() {
    // Remove old character
    if (this.previewCharacter) {
      this.previewScene.remove(this.previewCharacter);
      this.previewCharacter.traverse((child) => {
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

    this.previewCharacter = CharacterBuilder.create(this.config);
    this.previewScene.add(this.previewCharacter);

    // Render once immediately
    if (this.previewRenderer) {
      this.previewRenderer.render(this.previewScene, this.previewCamera);
    }
  }

  setupControls() {
    // Hair style buttons
    this.setupOptionButtons('cc-hair-style', HAIR_STYLES, this.config.hair, (val) => {
      this.config.hair = val;
      this.updatePreview();
    }, (val) => {
      // Label map
      const labels = { short: 'Short', long: 'Long', ponytail: 'Pony', curly: 'Curly' };
      return labels[val] || val;
    });

    // Hair colors
    this.setupColorSwatches('cc-hair-colors', HAIR_COLORS, this.config.hairColor, (color) => {
      this.config.hairColor = color;
      this.updatePreview();
    });

    // Skin colors
    this.setupColorSwatches('cc-skin-colors', SKIN_COLORS, this.config.skinColor, (color) => {
      this.config.skinColor = color;
      this.updatePreview();
    });

    // Shirt colors
    this.setupColorSwatches('cc-shirt-colors', SHIRT_COLORS, this.config.shirtColor, (color) => {
      this.config.shirtColor = color;
      this.updatePreview();
    });

    // Shirt patterns
    this.setupOptionButtons('cc-shirt-pattern', SHIRT_PATTERNS, this.config.shirtPattern, (val) => {
      this.config.shirtPattern = val;
      this.updatePreview();
    }, (val) => {
      const labels = { solid: 'Solid', stripes: 'Stripes', star: 'Star' };
      return labels[val] || val;
    });

    // Pants colors
    this.setupColorSwatches('cc-pants-colors', PANTS_COLORS, this.config.pantsColor, (color) => {
      this.config.pantsColor = color;
      this.updatePreview();
    });

    // Shoe colors
    this.setupColorSwatches('cc-shoe-colors', SHOE_COLORS, this.config.shoeColor, (color) => {
      this.config.shoeColor = color;
      this.updatePreview();
    });

    // Ready button
    const readyBtn = document.getElementById('cc-ready-btn');
    const handler = () => {
      readyBtn.removeEventListener('click', handler);
      // Save to progress
      this.game.progress.data.character = { ...this.config };
      this.game.progress.save();

      this.hide();
      if (this.onReady) {
        this.onReady(this.config);
      }
    };
    readyBtn.addEventListener('click', handler);
  }

  setupOptionButtons(containerId, options, currentValue, onChange, labelFn) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'cc-option-btn' + (opt === currentValue ? ' active' : '');
      btn.textContent = labelFn ? labelFn(opt) : opt;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.cc-option-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        onChange(opt);
      });
      container.appendChild(btn);
    });
  }

  setupColorSwatches(containerId, colors, currentColor, onChange) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    colors.forEach((color) => {
      const swatch = document.createElement('button');
      swatch.className = 'cc-color-swatch' + (color === currentColor ? ' active' : '');
      swatch.style.backgroundColor = color;
      swatch.addEventListener('click', () => {
        container.querySelectorAll('.cc-color-swatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        onChange(color);
      });
      container.appendChild(swatch);
    });
  }

  disposePreview() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.previewCharacter) {
      this.previewCharacter.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.previewCharacter = null;
    }
    if (this.previewRenderer) {
      this.previewRenderer.dispose();
      this.previewRenderer = null;
    }
    this.previewScene = null;
    this.previewCamera = null;
  }
}
