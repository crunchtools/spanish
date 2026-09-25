import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetLoader {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.cache = new Map();
    this.totalToLoad = 0;
    this.loaded = 0;

    this.loadingManager.onStart = () => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) overlay.style.display = 'flex';
    };

    this.loadingManager.onProgress = (_url, loaded, total) => {
      const progress = (loaded / total) * 100;
      this.updateLoadingBar(progress);
    };

    this.loadingManager.onLoad = () => {
      this.hideLoadingBar();
    };

    // Failed loads don't block startup; VocabObject falls back to a placeholder.
    this.loadingManager.onError = (url) => {
      console.warn(`Asset failed to load: ${url}`);
    };
  }

  loadModel(path) {
    if (this.cache.has(path)) {
      const cached = this.cache.get(path);
      return Promise.resolve({
        scene: cached.scene.clone(),
      });
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => {
          this.cache.set(path, gltf);
          resolve(gltf);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateLoadingBar(progress) {
    const fillEl = document.getElementById('loading-bar-fill');
    const text = document.getElementById('loading-text');
    if (fillEl) fillEl.style.width = `${progress}%`;
    if (text) text.textContent = `Loading... ${Math.round(progress)}%`;
  }

  hideLoadingBar() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }
  }
}
