import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { Easing } from '@tweenjs/tween.js';
import { tweenGroup } from './utils/tweenGroup.js';
import { SceneManager } from './scenes/SceneManager.js';
import { TapToMove } from './controls/TapToMove.js';
import { SwipeLook } from './controls/SwipeLook.js';
import { ThirdPersonCamera } from './controls/ThirdPersonCamera.js';
import { ObjectInteraction } from './controls/ObjectInteraction.js';
import { HUD } from './ui/HUD.js';
import { CharacterCreator } from './ui/CharacterCreator.js';
import { PlayerCharacter } from './objects/PlayerCharacter.js';
import { AudioManager } from './systems/AudioManager.js';
import { ProgressManager } from './systems/ProgressManager.js';
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR } from './utils/constants.js';

class Game {
  constructor() {
    this.renderer = null;
    this.css2DRenderer = null;
    this.camera = null;
    this.timer = new THREE.Timer();
    this.sceneManager = null;
    this.tapToMove = null;
    this.swipeLook = null;
    this.thirdPersonCamera = null;
    this.objectInteraction = null;
    this.hud = null;
    this.characterCreator = null;
    this.playerCharacter = null;
    this.audio = new AudioManager();
    this.progress = new ProgressManager();
    this.started = false;
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupCSS2DRenderer();

    this.sceneManager = new SceneManager(this);
    this.hud = new HUD(this);
    this.tapToMove = new TapToMove(this);
    this.swipeLook = new SwipeLook(this);
    this.thirdPersonCamera = new ThirdPersonCamera(this.camera);
    this.objectInteraction = new ObjectInteraction(this);
    this.characterCreator = new CharacterCreator(this);

    window.addEventListener('resize', () => this.onResize());

    this.showTitleScreen();
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'default',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    document.getElementById('game-container').appendChild(this.renderer.domElement);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    // Initial position (ThirdPersonCamera takes over during gameplay)
    this.camera.position.set(0, 2.5, 7);
    this.camera.lookAt(0, 1.0, 0);
  }

  setupCSS2DRenderer() {
    this.css2DRenderer = new CSS2DRenderer();
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css2DRenderer.domElement.style.position = 'absolute';
    this.css2DRenderer.domElement.style.top = '0';
    this.css2DRenderer.domElement.style.left = '0';
    this.css2DRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('game-container').appendChild(this.css2DRenderer.domElement);
  }

  showTitleScreen() {
    const titleScreen = document.getElementById('title-screen');
    titleScreen.style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';

    const playBtn = document.getElementById('btn-play');
    playBtn.addEventListener('click', () => {
      this.audio.initAfterGesture();
      titleScreen.style.display = 'none';

      // If player already has a saved character, skip creator
      if (this.progress.hasCharacter()) {
        this.startGameWithCharacter(this.progress.getCharacter());
      } else {
        // Show character creator
        this.characterCreator.show((config) => {
          this.startGameWithCharacter(config);
        });
      }
    }, { once: true });
  }

  startGameWithCharacter(config) {
    // Create the player character
    this.playerCharacter = new PlayerCharacter(config);

    // Show game
    document.getElementById('game-container').style.display = 'block';
    this.onResize();

    if (!this.started) {
      this.started = true;
      this.hud.show();
      this.sceneManager.loadRoom('bedroom');
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.timer.update();
    const delta = this.timer.getDelta();
    tweenGroup.update();

    if (this.sceneManager && this.sceneManager.activeScene) {
      this.sceneManager.update(delta);
      this.renderer.render(this.sceneManager.activeScene, this.camera);
      this.css2DRenderer.render(this.sceneManager.activeScene, this.camera);
    }
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.css2DRenderer.setSize(w, h);
  }
}

const game = new Game();
game.init();


export { game };
