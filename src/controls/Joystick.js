import { ROOM_WIDTH, ROOM_DEPTH } from '../utils/constants.js';

/**
 * Virtual joystick for tablet/touch movement.
 * Sits in the bottom-left corner. Dragging the stick moves the character
 * continuously in that direction (relative to camera orbit angle).
 */
export class Joystick {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.dx = 0; // normalized -1..1
    this.dy = 0;
    this.touchId = null;

    this.zone = document.getElementById('joystick-zone');
    this.base = document.getElementById('joystick-base');
    this.stick = document.getElementById('joystick-stick');

    this.maxRadius = 35; // max pixels the stick can move from center

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.zone.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.zone.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.zone.addEventListener('touchend', this.onTouchEnd);
    this.zone.addEventListener('touchcancel', this.onTouchEnd);

    // Mouse fallback for desktop testing
    this.zone.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.zone.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.zone.addEventListener('pointerup', this.onPointerUp.bind(this));
  }

  show() {
    this.zone.style.display = 'block';
  }

  hide() {
    this.zone.style.display = 'none';
  }

  onTouchStart(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    this.touchId = touch.identifier;
    this.active = true;
    this.updateStick(touch.clientX, touch.clientY);
  }

  onTouchMove(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.identifier === this.touchId) {
        this.updateStick(touch.clientX, touch.clientY);
        break;
      }
    }
  }

  onTouchEnd(e) {
    for (const touch of e.changedTouches) {
      if (touch.identifier === this.touchId) {
        this.resetStick();
        break;
      }
    }
  }

  onPointerDown(e) {
    if (e.pointerType === 'touch') return; // handled by touch events
    this.active = true;
    this.updateStick(e.clientX, e.clientY);
  }

  onPointerMove(e) {
    if (!this.active || e.pointerType === 'touch') return;
    this.updateStick(e.clientX, e.clientY);
  }

  onPointerUp(e) {
    if (e.pointerType === 'touch') return;
    this.resetStick();
  }

  updateStick(clientX, clientY) {
    const rect = this.base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let offsetX = clientX - centerX;
    let offsetY = clientY - centerY;

    // Clamp to maxRadius
    const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    if (dist > this.maxRadius) {
      offsetX = (offsetX / dist) * this.maxRadius;
      offsetY = (offsetY / dist) * this.maxRadius;
    }

    // Update visual
    this.stick.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

    // Normalize to -1..1
    this.dx = offsetX / this.maxRadius;
    this.dy = offsetY / this.maxRadius; // positive = down on screen = forward in world
  }

  resetStick() {
    this.active = false;
    this.dx = 0;
    this.dy = 0;
    this.touchId = null;
    this.stick.style.transform = 'translate(-50%, -50%)';
  }

  /**
   * Call every frame to move the character based on joystick input.
   * @param {number} delta - frame delta in seconds
   */
  update(delta) {
    if (!this.active || (Math.abs(this.dx) < 0.1 && Math.abs(this.dy) < 0.1)) return;

    const player = this.game.playerCharacter;
    const tpc = this.game.thirdPersonCamera;
    if (!player || !tpc || player.isWalking) return;

    const speed = 3.0; // units per second
    const moveX = this.dx * speed * delta;
    const moveZ = -this.dy * speed * delta; // screen Y inverted vs world Z toward camera

    // Rotate movement by camera orbit angle so "up" on joystick = forward from camera perspective
    const angle = tpc.orbitAngle;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const worldX = moveX * cosA - moveZ * sinA;
    const worldZ = moveX * sinA + moveZ * cosA;

    const pos = player.group.position;
    const newX = pos.x + worldX;
    const newZ = pos.z + worldZ;

    // Clamp to room bounds
    const halfW = ROOM_WIDTH / 2 - 0.5;
    const halfD = ROOM_DEPTH / 2 - 0.5;
    pos.x = Math.max(-halfW, Math.min(halfW, newX));
    pos.z = Math.max(-halfD, Math.min(halfD, newZ));

    // Face direction of movement
    if (Math.abs(worldX) > 0.001 || Math.abs(worldZ) > 0.001) {
      player.group.rotation.y = Math.atan2(worldX, worldZ);
    }
  }

  dispose() {
    this.zone.removeEventListener('touchstart', this.onTouchStart);
    this.zone.removeEventListener('touchmove', this.onTouchMove);
    this.zone.removeEventListener('touchend', this.onTouchEnd);
    this.zone.removeEventListener('touchcancel', this.onTouchEnd);
  }
}
