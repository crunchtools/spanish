import { rooms } from '../config/vocabulary.js';

export class FlashcardOverlay {
  constructor(game) {
    this.game = game;
    this.currentIndex = 0;
    this.roomId = null;
    this.words = [];

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('fc-close').addEventListener('click', () => this.hide());
    document.getElementById('fc-prev').addEventListener('click', () => this.prev());
    document.getElementById('fc-next').addEventListener('click', () => this.next());
    document.getElementById('fc-card').addEventListener('click', () => this.flip());
    document.getElementById('fc-speak').addEventListener('click', (e) => {
      e.stopPropagation();
      this.speak();
    });
  }

  show(roomId) {
    this.roomId = roomId;
    this.words = rooms[roomId].words;
    this.currentIndex = 0;

    document.getElementById('flashcard-overlay').style.display = 'flex';
    this.render();
  }

  hide() {
    document.getElementById('flashcard-overlay').style.display = 'none';

    // Award star if went through all cards
    if (this.currentIndex === 0 && this.words.length > 0) {
      const currentStars = this.game.progress.getStars(this.roomId);
      if (currentStars < 2) {
        this.game.progress.setStars(this.roomId, Math.max(currentStars, 2));
        this.game.hud.updateStars(this.roomId);
        this.game.hud.showCelebration('You reviewed all the flashcards!');
      }
    }
  }

  render() {
    const word = this.words[this.currentIndex];
    document.getElementById('fc-emoji-display').textContent = word.emoji;
    document.getElementById('fc-spanish-text').textContent = word.spanish;
    document.getElementById('fc-english-text').textContent = word.english;
    document.getElementById('fc-progress').textContent =
      `${this.currentIndex + 1} / ${this.words.length}`;

    // Show front
    document.getElementById('fc-front-face').style.display = 'flex';
    document.getElementById('fc-back-face').style.display = 'none';
  }

  flip() {
    const front = document.getElementById('fc-front-face');
    const back = document.getElementById('fc-back-face');
    if (front.style.display !== 'none') {
      front.style.display = 'none';
      back.style.display = 'flex';
    } else {
      front.style.display = 'flex';
      back.style.display = 'none';
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.words.length;
    this.render();

    if (this.currentIndex === 0) {
      const currentStars = this.game.progress.getStars(this.roomId);
      if (currentStars < 2) {
        this.game.progress.setStars(this.roomId, Math.max(currentStars, 2));
        this.game.hud.updateStars(this.roomId);
        this.game.hud.showCelebration('You reviewed all the flashcards!');
      }
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.words.length) % this.words.length;
    this.render();
  }

  speak() {
    const word = this.words[this.currentIndex];
    this.game.audio.speakSpanish(word.spanish);
  }
}
