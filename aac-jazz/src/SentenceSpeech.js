export class SentenceSpeechService {
    constructor() {
      this.speechSynthesis = window.speechSynthesis;
      this.enabled = true;
      this.volume = 1.0;
    }
  
    setEnabled(enabled) {
      this.enabled = enabled;
    }
  
    setVolume(volume) {
      // Convert 0-100 range to 0-1
      this.volume = volume / 100;
    }
  
    speak(text, options = {}) {
      if (!this.enabled) return;
  
      // Cancel any ongoing speech
      this.speechSynthesis.cancel();
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = options.volume !== undefined ? options.volume : this.volume;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
  
      // Optionally set voice
      if (options.voice) {
        utterance.voice = options.voice;
      }
  
      this.speechSynthesis.speak(utterance);
    }
  
    cancel() {
      this.speechSynthesis.cancel();
    }
  }
  
  // Creates a singleton instance
  export const sentenceSpeech = new SentenceSpeechService();
  