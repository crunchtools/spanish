export class WordPopup {
  constructor(game) {
    this.game = game;
    this.currentWord = null;

    document.getElementById('wp-close').addEventListener('click', () => this.hide());
    document.getElementById('wp-speak').addEventListener('click', () => this.speak());
    document.getElementById('wp-got-it').addEventListener('click', () => this.hide());
  }

  show(wordData) {
    this.currentWord = wordData;
    const emojiEl = document.getElementById('wp-emoji');
    if (wordData.image) {
      emojiEl.innerHTML = `<img src="${wordData.image}" alt="${wordData.english}" style="width:80px;height:80px;object-fit:contain">`;
    } else {
      emojiEl.textContent = wordData.emoji;
    }
    document.getElementById('wp-spanish').textContent = wordData.spanish;
    document.getElementById('wp-english').textContent = wordData.english;
    document.getElementById('word-popup-overlay').style.display = 'flex';
  }

  hide() {
    document.getElementById('word-popup-overlay').style.display = 'none';
  }

  speak() {
    if (this.currentWord) {
      this.game.audio.speakSpanish(this.currentWord.spanish);
    }
  }
}
