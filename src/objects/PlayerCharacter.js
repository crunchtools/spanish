import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { tweenGroup } from '../utils/tweenGroup.js';
import { CharacterBuilder } from './CharacterBuilder.js';
import { TWEEN_DURATION } from '../utils/constants.js';

export class PlayerCharacter {
  constructor(config) {
    this.group = CharacterBuilder.create(config);
    this.group.castShadow = true;

    // Animation state
    this.isWalking = false;
    this.idleTime = 0;
    this.baseY = 0;
    this.walkTween = null;
    this.legTweens = [];

    // Get leg pivots for walk animation
    this.leftLegPivot = this.group.getObjectByName('leftLegPivot');
    this.rightLegPivot = this.group.getObjectByName('rightLegPivot');

    this.startIdle();
  }

  /**
   * Rebuild the character mesh with new config (e.g. after customization).
   */
  rebuild(config) {
    const pos = this.group.position.clone();
    const rot = this.group.rotation.y;
    const parent = this.group.parent;

    // Dispose old
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
    if (parent) parent.remove(this.group);

    // Build new
    this.group = CharacterBuilder.create(config);
    this.group.position.copy(pos);
    this.group.rotation.y = rot;
    this.leftLegPivot = this.group.getObjectByName('leftLegPivot');
    this.rightLegPivot = this.group.getObjectByName('rightLegPivot');

    if (parent) parent.add(this.group);
    this.startIdle();
  }

  /**
   * Place the character at a position.
   */
  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
    this.baseY = y;
  }

  getPosition() {
    return this.group.position;
  }

  /**
   * Walk to a target (x, z) on the floor.
   */
  walkTo(x, z) {
    // Stop any existing walk
    if (this.walkTween) {
      this.walkTween.stop();
    }

    this.isWalking = true;

    // Face direction of travel
    const dx = x - this.group.position.x;
    const dz = z - this.group.position.z;
    const targetAngle = Math.atan2(dx, dz);
    this.group.rotation.y = targetAngle;

    // Start walk animation (leg swing)
    this.startWalkAnimation();

    // Tween position
    this.walkTween = new Tween(this.group.position, tweenGroup)
      .to({ x, z }, TWEEN_DURATION)
      .easing(Easing.Quadratic.InOut)
      .onComplete(() => {
        this.isWalking = false;
        this.walkTween = null;
        this.stopWalkAnimation();
        this.startIdle();
      })
      .start();
  }

  startWalkAnimation() {
    this.stopWalkAnimation();

    if (!this.leftLegPivot || !this.rightLegPivot) return;

    // Left leg forward
    const leftForward = new Tween(this.leftLegPivot.rotation, tweenGroup)
      .to({ x: 0.4 }, 200)
      .easing(Easing.Sinusoidal.InOut);
    const leftBack = new Tween(this.leftLegPivot.rotation, tweenGroup)
      .to({ x: -0.4 }, 200)
      .easing(Easing.Sinusoidal.InOut);

    // Right leg opposite
    const rightForward = new Tween(this.rightLegPivot.rotation, tweenGroup)
      .to({ x: -0.4 }, 200)
      .easing(Easing.Sinusoidal.InOut);
    const rightBack = new Tween(this.rightLegPivot.rotation, tweenGroup)
      .to({ x: 0.4 }, 200)
      .easing(Easing.Sinusoidal.InOut);

    // Chain: left forward + right back → left back + right forward → repeat
    leftForward.chain(leftBack);
    leftBack.chain(leftForward);
    rightForward.chain(rightBack);
    rightBack.chain(rightForward);

    leftForward.start();
    rightForward.start();

    this.legTweens = [leftForward, leftBack, rightForward, rightBack];
  }

  stopWalkAnimation() {
    this.legTweens.forEach((t) => t.stop());
    this.legTweens = [];

    // Reset leg rotations
    if (this.leftLegPivot) this.leftLegPivot.rotation.x = 0;
    if (this.rightLegPivot) this.rightLegPivot.rotation.x = 0;
  }

  startIdle() {
    this.idleTime = 0;
  }

  update(delta) {
    if (!this.isWalking) {
      // Idle bob
      this.idleTime += delta;
      this.group.position.y = this.baseY + Math.sin(this.idleTime * 2) * 0.03;
    }
  }

  dispose() {
    if (this.walkTween) this.walkTween.stop();
    this.stopWalkAnimation();
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
