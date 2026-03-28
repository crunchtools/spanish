import { rooms } from '../config/vocabulary.js';
import { shuffle } from '../utils/shuffle.js';

export class MatchingOverlay {
  constructor(game) {
    this.game = game;
    this.selected = null;
    this.matchesFound = 0;
    this.roomId = null;
    this.totalPairs = 4;

    document.getElementById('matching-close').addEventListener('click', () => this.hide());
  }

  show(roomId) {
    this.roomId = roomId;
    this.selected = null;
    this.matchesFound = 0;

    document.getElementById('matching-overlay').style.display = 'flex';
    document.getElementById('matching-status').textContent = `Pairs: 0/${this.totalPairs}`;
    this.setupGrid();
  }

  hide() {
    document.getElementById('matching-overlay').style.display = 'none';
  }

  setupGrid() {
    const room = rooms[this.roomId];
    const selectedWords = shuffle([...room.words]).slice(0, this.totalPairs);

    const cards = [];
    selectedWords.forEach((word) => {
      cards.push({ type: 'emoji', value: word.emoji, pairId: word.word });
      cards.push({ type: 'text', value: word.spanish, pairId: word.word });
    });

    const shuffled = shuffle(cards);

    const grid = document.getElementById('matching-grid');
    grid.innerHTML = '';

    shuffled.forEach((card, index) => {
      const div = document.createElement('div');
      div.className = 'match-card-3d';
      div.dataset.pairId = card.pairId;
      div.dataset.index = index;

      if (card.type === 'emoji') {
        div.innerHTML = `<span style="font-size:1.8rem">${card.value}</span>`;
      } else {
        div.textContent = card.value;
        div.style.fontSize = '0.85rem';
      }

      div.addEventListener('click', () => this.selectCard(div));
      grid.appendChild(div);
    });
  }

  selectCard(card) {
    if (card.classList.contains('matched') || card.classList.contains('selected')) return;

    card.classList.add('selected');

    if (!this.selected) {
      this.selected = card;
    } else {
      if (
        this.selected.dataset.pairId === card.dataset.pairId &&
        this.selected.dataset.index !== card.dataset.index
      ) {
        // Match found
        this.selected.classList.remove('selected');
        this.selected.classList.add('matched');
        card.classList.remove('selected');
        card.classList.add('matched');
        this.matchesFound++;
        document.getElementById('matching-status').textContent =
          `Pairs: ${this.matchesFound}/${this.totalPairs}`;

        const room = rooms[this.roomId];
        const wordData = room.words.find((w) => w.word === card.dataset.pairId);
        if (wordData) this.game.audio.speakSpanish(wordData.spanish);

        if (this.matchesFound >= this.totalPairs) {
          setTimeout(() => {
            this.hide();
            const currentStars = this.game.progress.getStars(this.roomId);
            if (currentStars < 2) {
              this.game.progress.setStars(this.roomId, Math.max(currentStars, 2));
              this.game.hud.updateStars(this.roomId);
            }
            this.game.hud.showCelebration('You matched all the pairs!');
          }, 800);
        }
      } else {
        // No match — deselect after delay
        const prev = this.selected;
        setTimeout(() => {
          prev.classList.remove('selected');
          card.classList.remove('selected');
        }, 600);
      }
      this.selected = null;
    }
  }
}
