/**
 * utils/voiceCapture.js — Web Speech API Wrapper
 *
 * Provides a simple interface to the browser's built-in speech recognition.
 * Works in Chrome and Edge. Limited support in Firefox / Safari.
 *
 * Usage:
 *   const { startListening, stopListening, isSupported } = useVoiceCapture(onResult, onError);
 */

/**
 * isVoiceSupported()
 * Checks if the browser supports the Web Speech API.
 *
 * @returns {boolean}
 */
export const isVoiceSupported = () => {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
};

/**
 * createVoiceRecognizer(onResult, onError)
 * Creates and configures a SpeechRecognition instance.
 *
 * @param {function} onResult - callback receiving the transcript string
 * @param {function} onError  - callback receiving an error message string
 * @returns {{ start: function, stop: function }}
 */
export const createVoiceRecognizer = (onResult, onError) => {
  // Use the webkit prefix for Chrome, or the standard API for others
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Voice input is not supported in your browser. Try Chrome or Edge.");
    return null;
  }

  const recognition = new SpeechRecognition();

  // Settings
  recognition.lang = "en-US";          // Language for recognition
  recognition.continuous = false;       // Stop after first pause
  recognition.interimResults = false;   // Only return final results

  // Called when speech is successfully recognized
  recognition.onresult = (event) => {
    // event.results[0][0].transcript contains the recognized text
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  // Called on error (e.g., microphone denied, no speech detected)
  recognition.onerror = (event) => {
    const messages = {
      "not-allowed": "Microphone access was denied. Please allow it in browser settings.",
      "no-speech": "No speech detected. Please try again.",
      "network": "Network error during voice recognition.",
    };
    onError(messages[event.error] || `Voice error: ${event.error}`);
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  };
};
