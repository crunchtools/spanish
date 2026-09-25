export class JokePopup {
  constructor(game) {
    this.game = game;

    document.getElementById('joke-close-btn').addEventListener('click', () => this.hide());
  }

  show(joke) {
    const content = document.getElementById('joke-content-area');
    const lines = [
      [joke.setup, false],
      [joke.who, true],
      [joke.punchSetup, false],
      [joke.punchWho, true],
    ].map(([text, isReply]) => {
      const div = document.createElement('div');
      div.className = 'joke-line';
      if (isReply) div.style.color = '#b45309';
      div.textContent = text;
      return div;
    });
    const punchline = document.createElement('div');
    punchline.className = 'joke-line joke-punchline';
    punchline.textContent = joke.punchline;
    content.replaceChildren(...lines, punchline);
    document.getElementById('joke-overlay').style.display = 'flex';
  }

  hide() {
    document.getElementById('joke-overlay').style.display = 'none';
  }
}
