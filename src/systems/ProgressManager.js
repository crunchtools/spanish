const STORAGE_KEY = 'mundoDePalabras_v1';

export class ProgressManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === 1) {
          return parsed;
        }
      }
    } catch {
      // Corrupted data, start fresh
    }
    return this.createFresh();
  }

  createFresh() {
    return {
      version: 1,
      learnedWords: [],
      stars: { bedroom: 0 },
      unlockedRooms: ['bedroom'],
      lastRoom: 'bedroom',
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // localStorage full or unavailable
    }
  }

  learnWord(word) {
    if (!this.data.learnedWords.includes(word)) {
      this.data.learnedWords.push(word);
      this.save();
    }
  }

  isWordLearned(word) {
    return this.data.learnedWords.includes(word);
  }

  getStars(roomId) {
    return this.data.stars[roomId] || 0;
  }

  setStars(roomId, count) {
    this.data.stars[roomId] = Math.max(this.data.stars[roomId] || 0, count);
    this.save();
  }

  getTotalStars() {
    return Object.values(this.data.stars).reduce((a, b) => a + b, 0);
  }

  isRoomUnlocked(roomId) {
    return this.data.unlockedRooms.includes(roomId);
  }

  unlockRoom(roomId) {
    if (!this.data.unlockedRooms.includes(roomId)) {
      this.data.unlockedRooms.push(roomId);
      this.save();
    }
  }

  setLastRoom(roomId) {
    this.data.lastRoom = roomId;
    this.save();
  }
}
