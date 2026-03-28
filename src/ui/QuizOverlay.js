import { rooms } from '../config/vocabulary.js';
import { shuffle } from '../utils/shuffle.js';

export class QuizOverlay {
  constructor(game) {
    this.game = game;
    this.questions = [];
    this.index = 0;
    this.score = 0;
    this.roomId = null;

    document.getElementById('quiz-close').addEventListener('click', () => this.hide());
    document.getElementById('quiz-next-btn').addEventListener('click', () => this.nextQuestion());
  }

  show(roomId) {
    this.roomId = roomId;
    this.questions = shuffle([...rooms[roomId].words]);
    this.index = 0;
    this.score = 0;

    document.getElementById('quiz-overlay').style.display = 'flex';
    this.renderQuestion();
  }

  hide() {
    document.getElementById('quiz-overlay').style.display = 'none';
  }

  renderQuestion() {
    if (this.index >= this.questions.length) {
      this.finish();
      return;
    }

    const question = this.questions[this.index];
    const room = rooms[this.roomId];

    document.getElementById('quiz-emoji-display').textContent = question.emoji;
    document.getElementById('quiz-english-display').textContent = question.english;
    document.getElementById('quiz-score-display').textContent =
      `Score: ${this.score}/${this.index}`;
    document.getElementById('quiz-feedback-area').style.display = 'none';

    // Generate 4 options (1 correct + 3 wrong)
    const wrongOptions = room.words
      .filter((w) => w.word !== question.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = shuffle([question, ...wrongOptions]);

    const container = document.getElementById('quiz-options-area');
    container.innerHTML = '';

    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = opt.spanish;
      btn.addEventListener('click', () =>
        this.checkAnswer(btn, opt.word === question.word, question)
      );
      container.appendChild(btn);
    });
  }

  checkAnswer(button, isCorrect, question) {
    // Disable all buttons
    document.querySelectorAll('.quiz-option-btn').forEach((b) => {
      b.style.pointerEvents = 'none';
    });

    const feedbackArea = document.getElementById('quiz-feedback-area');
    const feedbackText = document.getElementById('quiz-feedback-text');

    if (isCorrect) {
      button.classList.add('correct');
      this.score++;
      feedbackText.textContent = '\u00A1Correcto! \u{1F389}';
      this.game.audio.speakCorrect();
    } else {
      button.classList.add('wrong');
      feedbackText.textContent = `Not quite! It's "${question.spanish}"`;
      // Highlight correct answer
      document.querySelectorAll('.quiz-option-btn').forEach((b) => {
        if (b.textContent === question.spanish) b.classList.add('correct');
      });
    }

    feedbackArea.style.display = 'block';
  }

  nextQuestion() {
    this.index++;
    this.renderQuestion();
  }

  finish() {
    this.hide();

    const pct = this.score / this.questions.length;
    if (pct >= 0.7 && this.game.progress.getStars(this.roomId) < 3) {
      this.game.progress.setStars(this.roomId, 3);
      this.game.hud.updateStars(this.roomId);
      this.game.hud.showCelebration(
        `You got ${this.score}/${this.questions.length} correct on the quiz!`
      );
    } else {
      this.game.hud.showCelebration(
        `Quiz done! ${this.score}/${this.questions.length} correct!`
      );
    }
  }
}
