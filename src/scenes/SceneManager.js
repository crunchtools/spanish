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

    this.game.camera.position.set(0, 1.2, 3);
    this.game.camera.lookAt(0, 1.2, 0);

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
  }
}
