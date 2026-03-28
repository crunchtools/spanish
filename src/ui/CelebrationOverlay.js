export class CelebrationOverlay {
  constructor(game) {
    this.game = game;

    document.getElementById('celeb-continue').addEventListener('click', () => this.hide());
  }

  show(message) {
    document.getElementById('celeb-text').textContent = message;
    document.getElementById('celebration-overlay').style.display = 'flex';
  }

  hide() {
    document.getElementById('celebration-overlay').style.display = 'none';
  }
}
