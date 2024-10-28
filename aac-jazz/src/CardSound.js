export class CardSoundService { //Uses webspeech API to play audio when card is clicked
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
  
    speak(text) {
      if (!this.enabled) return;
  
      // Cancel any ongoing speech
      this.speechSynthesis.cancel();
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.volume;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      this.speechSynthesis.speak(utterance);
    }
  }
  
  // Creates a singleton instance
  export const cardSound = new CardSoundService();