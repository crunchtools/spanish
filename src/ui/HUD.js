import { rooms, guides, jokes } from '../config/vocabulary.js';
import { FlashcardOverlay } from './FlashcardOverlay.js';
import { QuizOverlay } from './QuizOverlay.js';
import { MatchingOverlay } from './MatchingOverlay.js';
import { MapOverlay } from './MapOverlay.js';
import { WordPopup } from './WordPopup.js';
import { CelebrationOverlay } from './CelebrationOverlay.js';
import { JokePopup } from './JokePopup.js';

export class HUD {
  constructor(game) {
    this.game = game;
    this.currentRoomId = null;

    this.flashcard = new FlashcardOverlay(game);
    this.quiz = new QuizOverlay(game);
    this.matching = new MatchingOverlay(game);
    this.map = new MapOverlay(game);
    this.wordPopup = new WordPopup(game);
    this.celebration = new CelebrationOverlay(game);
    this.jokePopup = new JokePopup(game);

    this.bindButtons();
  }

  bindButtons() {
    document.getElementById('btn-back').addEventListener('click', () => {
      this.map.show();
    });

    document.getElementById('btn-change-char').addEventListener('click', () => {
      if (this.game.characterCreator) {
        this.game.characterCreator.show((config) => {
          // Rebuild the in-scene character with new config
          if (this.game.playerCharacter) {
            this.game.playerCharacter.rebuild(config);
          }
        });
      }
    });

    document.getElementById('btn-flashcards').addEventListener('click', () => {
      this.flashcard.show(this.currentRoomId);
    });

    document.getElementById('btn-quiz').addEventListener('click', () => {
      this.quiz.show(this.currentRoomId);
    });

    document.getElementById('btn-matching').addEventListener('click', () => {
      this.matching.show(this.currentRoomId);
    });
  }

  show() {
    document.getElementById('hud').style.display = 'flex';
  }

  hide() {
    document.getElementById('hud').style.display = 'none';
  }

  updateRoom(roomId) {
    this.currentRoomId = roomId;
    const roomData = rooms[roomId];
    const guideData = guides[roomData.guide];

    document.getElementById('hud-room-name').textContent =
      `${roomData.name}`;
    this.updateStars(roomId);
    this.showGuideMessage(guideData.greetings[
      Math.floor(Math.random() * guideData.greetings.length)
    ]);
  }

  updateStars(roomId) {
    const stars = this.game.progress.getStars(roomId);
    const display = '\u2605'.repeat(stars) + '\u2606'.repeat(3 - stars);
    document.getElementById('hud-stars').textContent = display;
  }

  showGuideMessage(message) {
    const bubble = document.getElementById('guide-bubble');
    const text = document.getElementById('guide-bubble-text');
    text.textContent = message;
    bubble.style.display = 'block';

    // Auto-hide after 4 seconds
    clearTimeout(this._guideTimeout);
    this._guideTimeout = setTimeout(() => {
      bubble.style.display = 'none';
    }, 4000);
  }

  showWordPopup(wordData) {
    this.wordPopup.show(wordData);
  }

  showCelebration(message) {
    this.celebration.show(message);
    this.game.audio.speakCelebration();
  }

  showRandomJoke() {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    this.jokePopup.show(joke);
  }
}
