import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { BedroomScene } from './rooms/BedroomScene.js';

const roomClasses = {
  bedroom: BedroomScene,
};

export class SceneManager {
  constructor(game) {
    this.game = game;
    this.activeScene = null;
    this.activeRoom = null;
    this.currentRoomId = null;
  }

  async loadRoom(roomId) {
    if (this.activeRoom) {
      await this.transitionOut();
      this.activeRoom.dispose();
    }

    const RoomClass = roomClasses[roomId];
    if (!RoomClass) {
      console.error(`Unknown room: ${roomId}`);
      return;
    }

    this.currentRoomId = roomId;
    this.activeRoom = new RoomClass(this.game);
    this.activeScene = this.activeRoom.scene;

    await this.activeRoom.load();

    // Add player character to scene at spawn waypoint
    const player = this.game.playerCharacter;
    if (player) {
      const spawnWp = this.activeRoom.getSpawnPoint();
      player.setPosition(spawnWp.x, 0, spawnWp.z);
      this.activeScene.add(player.group);
    }

    // Position camera behind character (ThirdPersonCamera handles follow)
    if (this.game.thirdPersonCamera && player) {
      const pos = player.getPosition();
      const tpc = this.game.thirdPersonCamera;
      // Place camera at its intended orbit position immediately (no lerp on first frame)
      const offsetX = Math.sin(tpc.orbitAngle) * tpc.distance;
      const offsetZ = Math.cos(tpc.orbitAngle) * tpc.distance;
      this.game.camera.position.set(
        pos.x + offsetX,
        pos.y + tpc.heightOffset,
        pos.z + offsetZ
      );
      this.game.camera.lookAt(pos.x, pos.y + tpc.lookAtYOffset, pos.z);
    }

    this.game.hud.updateRoom(roomId);
    this.game.objectInteraction.setRoom(this.activeRoom);
    this.game.tapToMove.setRoom(this.activeRoom);

    await this.transitionIn();
  }

  transitionOut() {
    return new Promise((resolve) => {
      const overlay = document.getElementById('fade-overlay');
      overlay.style.opacity = '1';
      setTimeout(resolve, 400);
    });
  }

  transitionIn() {
    return new Promise((resolve) => {
      const overlay = document.getElementById('fade-overlay');
      overlay.style.opacity = '0';
      setTimeout(resolve, 400);
    });
  }

  update(delta) {
    if (this.activeRoom) {
      this.activeRoom.update(delta);
    }

    // Update player character
    const player = this.game.playerCharacter;
    if (player) {
      player.update(delta);
    }

    // Update third person camera to follow player
    const tpc = this.game.thirdPersonCamera;
    if (tpc && player) {
      tpc.update(player.getPosition());
    }
  }
}
