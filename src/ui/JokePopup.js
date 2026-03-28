export class JokePopup {
  constructor(game) {
    this.game = game;

    document.getElementById('joke-close-btn').addEventListener('click', () => this.hide());
  }

  show(joke) {
    const content = document.getElementById('joke-content-area');
    content.innerHTML = `
      <div class="joke-line">${joke.setup}</div>
      <div class="joke-line" style="color:#b45309">${joke.who}</div>
      <div class="joke-line">${joke.punchSetup}</div>
      <div class="joke-line" style="color:#b45309">${joke.punchWho}</div>
      <div class="joke-line joke-punchline">${joke.punchline}</div>
    `;
    document.getElementById('joke-overlay').style.display = 'flex';
  }

  hide() {
    document.getElementById('joke-overlay').style.display = 'none';
  }
}
