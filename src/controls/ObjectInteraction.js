import * as THREE from 'three';
import { encouragements } from '../config/vocabulary.js';

export class ObjectInteraction {
  constructor(game) {
    this.game = game;
    this.room = null;
    this.raycaster = new THREE.Raycaster();
    this.justInteracted = false;
    this.jokeCounter = 0;
    this.hoveredVocab = null;

    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);

    this.game.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    this.game.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
  }

  setRoom(room) {
    this.room = room;
    this.hoveredVocab = null;
  }

  /**
   * Raycast to find which VocabObject (if any) is under the pointer.
   */
  raycastVocab(event) {
    if (!this.room) return null;

    const pointer = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(pointer, this.game.camera);

    const interactables = this.room.getVocabObjects().map((v) => v.group);
    const hits = this.raycaster.intersectObjects(interactables, true);

    if (hits.length > 0) {
      let hitGroup = hits[0].object;
      while (hitGroup.parent && !hitGroup.userData.vocabWord) {
        hitGroup = hitGroup.parent;
      }

      return this.room.getVocabObjects().find((v) => v.group === hitGroup) || null;
    }

    return null;
  }

  onPointerMove(event) {
    if (!this.room) return;

    const vocabObj = this.raycastVocab(event);

    if (vocabObj !== this.hoveredVocab) {
      // Unhighlight previous
      if (this.hoveredVocab) {
        this.hoveredVocab.setHighlight(false);
      }
      // Highlight new
      if (vocabObj) {
        vocabObj.setHighlight(true);
      }
      this.hoveredVocab = vocabObj;

      // Cursor
      this.game.renderer.domElement.style.cursor = vocabObj ? 'pointer' : '';
    }
  }

  onPointerUp(event) {
    if (!this.room || this.game.swipeLook.isSwiping || this.game.tapToMove.isMoving) return;

    const vocabObj = this.raycastVocab(event);

    if (vocabObj) {
      this.justInteracted = true;
      setTimeout(() => { this.justInteracted = false; }, 300);
      this.interactWith(vocabObj);
    }
  }

  interactWith(vocabObj) {
    const wordData = vocabObj.wordData;

    // Play TTS
    this.game.audio.speakSpanish(wordData.spanish);

    // Mark learned
    this.game.progress.learnWord(wordData.word);

    // Show label and bounce
    vocabObj.showLabel();
    vocabObj.bounce();

    // Show word popup
    this.game.hud.showWordPopup(wordData);

    // Update progress
    const roomData = this.room.roomData;
    const totalWords = roomData.words.length;
    const learnedInRoom = roomData.words.filter(
      (w) => this.game.progress.isWordLearned(w.word)
    ).length;

    // Check if all words learned
    const roomId = this.game.sceneManager.currentRoomId;
    if (learnedInRoom === totalWords && this.game.progress.getStars(roomId) < 1) {
      this.game.progress.setStars(roomId, 1);
      this.game.hud.updateStars(roomId);
      this.game.hud.showGuideMessage(
        '¡Increíble! You learned all the words! Try the activities to earn more stars!'
      );
      setTimeout(() => {
        this.game.hud.showCelebration('You learned all the bedroom words!');
      }, 500);
    } else {
      const enc = encouragements[Math.floor(Math.random() * encouragements.length)];
      this.game.hud.showGuideMessage(
        `${enc} ${learnedInRoom}/${totalWords} words learned!`
      );
    }

    // Knock-knock joke every 4 interactions
    this.jokeCounter++;
    if (this.jokeCounter % 4 === 0) {
      setTimeout(() => this.game.hud.showRandomJoke(), 800);
    }
  }

  dispose() {
    this.game.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
    this.game.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
  }
}
