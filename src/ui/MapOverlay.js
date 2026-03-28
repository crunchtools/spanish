import { rooms } from '../config/vocabulary.js';

export class MapOverlay {
  constructor(game) {
    this.game = game;

    document.getElementById('map-close').addEventListener('click', () => this.hide());
  }

  show() {
    this.updateMap();
    document.getElementById('map-overlay').style.display = 'flex';
  }

  hide() {
    document.getElementById('map-overlay').style.display = 'none';
  }

  updateMap() {
    const totalStars = this.game.progress.getTotalStars();
    document.getElementById('map-total-stars').textContent = totalStars;

    // Update bedroom stars
    const bedroomStars = this.game.progress.getStars('bedroom');
    const starDisplay = '\u2605'.repeat(bedroomStars) + '\u2606'.repeat(3 - bedroomStars);
    document.getElementById('map-bedroom-stars').textContent = starDisplay;

    // Bedroom room card click
    const bedroomCard = document.getElementById('map-bedroom-card');
    bedroomCard.onclick = () => {
      this.hide();
      this.game.sceneManager.loadRoom('bedroom');
    };
  }
}
