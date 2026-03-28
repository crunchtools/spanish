export class AudioManager {
  constructor() {
    this.initialized = false;
  }

  initAfterGesture() {
    // iOS Safari requires a user gesture to unlock AudioContext/speechSynthesis
    if (this.initialized) return;
    this.initialized = true;

    // Pre-load voices
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
  }

  speakSpanish(text) {
    if (!('speechSynthesis' in window)) return;

    // Cancel any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    speechSynthesis.speak(utterance);
  }

  speakCelebration() {
    this.speakSpanish('¡Fantástico!');
  }

  speakCorrect() {
    this.speakSpanish('¡Correcto!');
  }
}
