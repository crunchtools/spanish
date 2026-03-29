import { SWIPE_THRESHOLD, LOOK_SPEED } from '../utils/constants.js';

export class SwipeLook {
  constructor(game) {
    this.game = game;
    this.isSwiping = false;
    this.isPressed = false;
    this.startX = 0;
    this.startY = 0;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    const el = this.game.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointercancel', this.onPointerUp);
  }

  onPointerDown(event) {
    this.isPressed = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isSwiping = false;
  }

  onPointerMove(event) {
    if (!this.isPressed) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > SWIPE_THRESHOLD) {
      this.isSwiping = true;

      // Orbit around character via ThirdPersonCamera
      const tpc = this.game.thirdPersonCamera;
      if (tpc) {
        const movementX = event.movementX || 0;
        tpc.setOrbitAngle(tpc.orbitAngle + movementX * LOOK_SPEED * 3);
      }
    }
  }

  onPointerUp() {
    this.isPressed = false;
    // isSwiping flag stays true briefly so TapToMove/ObjectInteraction can check it
    if (this.isSwiping) {
      setTimeout(() => {
        this.isSwiping = false;
      }, 50);
    }
  }

  dispose() {
    const el = this.game.renderer.domElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointercancel', this.onPointerUp);
  }
}
