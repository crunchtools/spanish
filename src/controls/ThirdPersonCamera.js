import * as THREE from 'three';
import { ROOM_WIDTH, ROOM_DEPTH, ROOM_HEIGHT } from '../utils/constants.js';

export class ThirdPersonCamera {
  constructor(camera) {
    this.camera = camera;

    // Offset from character (spherical coordinates)
    this.distance = 3;
    this.heightOffset = 2.2;
    this.orbitAngle = Math.PI; // start facing into the room (camera behind character looking toward -Z)

    // Smooth follow
    this.lerpFactor = 0.1;

    // Look-at Y offset (chest height of character)
    this.lookAtYOffset = 1.0;

    // Current desired position (for lerp)
    this._desiredPos = new THREE.Vector3();
    this._lookTarget = new THREE.Vector3();

    // Room boundary margins
    this._margin = 0.3;
  }

  /**
   * Set the orbit angle (called by SwipeLook).
   */
  setOrbitAngle(angle) {
    this.orbitAngle = angle;
  }

  /**
   * Update camera to follow a target position.
   * Call this every frame.
   * @param {THREE.Vector3} targetPos - The character's world position
   */
  update(targetPos) {
    // Calculate desired camera position from orbit angle + offset
    const offsetX = Math.sin(this.orbitAngle) * this.distance;
    const offsetZ = Math.cos(this.orbitAngle) * this.distance;

    this._desiredPos.set(
      targetPos.x + offsetX,
      targetPos.y + this.heightOffset,
      targetPos.z + offsetZ
    );

    // Clamp to room boundaries
    const halfW = ROOM_WIDTH / 2 - this._margin;
    const halfD = ROOM_DEPTH / 2 - this._margin;
    this._desiredPos.x = Math.max(-halfW, Math.min(halfW, this._desiredPos.x));
    this._desiredPos.z = Math.max(-halfD, Math.min(halfD, this._desiredPos.z));
    this._desiredPos.y = Math.min(ROOM_HEIGHT - 0.3, this._desiredPos.y);
    this._desiredPos.y = Math.max(0.5, this._desiredPos.y);

    // Lerp camera toward desired position
    this.camera.position.lerp(this._desiredPos, this.lerpFactor);

    // Look at character chest height
    this._lookTarget.set(
      targetPos.x,
      targetPos.y + this.lookAtYOffset,
      targetPos.z
    );
    this.camera.lookAt(this._lookTarget);
  }
}
