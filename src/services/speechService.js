// WebSpeech API Service for LoopBack PWA
export class VoiceRecognitionService {
  constructor(onResult, onError, onEnd) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SR;

    if (this.isSupported) {
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (onResult) onResult(final + interim, final.trim());
      };

      this.recognition.onerror = (e) => {
        if (onError) onError(e.error);
      };

      this.recognition.onend = () => {
        if (onEnd) onEnd();
      };
    }
  }

  start() {
    if (this.recognition) {
      try { this.recognition.start(); } catch (e) { /* already started */ }
    }
  }

  stop() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* not started */ }
    }
  }
}

export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }
};
