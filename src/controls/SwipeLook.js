import { SWIPE_THRESHOLD, LOOK_SPEED } from '../utils/constants.js';

export class SwipeLook {
  constructor(game) {
    this.game = game;
    this.isSwiping = false;
    this.startX = 0;
    this.startY = 0;
    this.yaw = 0;

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
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isSwiping = false;
  }

  onPointerMove(event) {
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > SWIPE_THRESHOLD) {
      this.isSwiping = true;
      // Y-axis rotation only (horizontal swipe)
      this.game.camera.rotation.y -= (event.movementX || 0) * LOOK_SPEED;

      // Clamp vertical look slightly
      const pitchDelta = (event.movementY || 0) * LOOK_SPEED * 0.5;
      this.game.camera.rotation.x = Math.max(
        -0.5,
        Math.min(0.3, this.game.camera.rotation.x - pitchDelta)
      );
    }
  }

  onPointerUp() {
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
