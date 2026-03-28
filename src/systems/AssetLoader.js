import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.loadingManager = new THREE.LoadingManager();
    this.cache = new Map();

    this.loadingManager.onProgress = (url, loaded, total) => {
      const progress = (loaded / total) * 100;
      this.updateLoadingBar(progress);
    };

    this.loadingManager.onLoad = () => {
      this.hideLoadingBar();
    };
  }

  loadModel(path) {
    if (this.cache.has(path)) {
      // Clone cached model
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
          console.warn(`Failed to load model: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  updateLoadingBar(progress) {
    const bar = document.getElementById('loading-bar-fill');
    const text = document.getElementById('loading-text');
    if (bar) bar.style.width = `${progress}%`;
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
