/**
 * components/CaptureBar.jsx
 *
 * Command-palette style input bar. Clean, highly polished.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { createVoiceRecognizer, isVoiceSupported } from "../utils/voiceCapture";

const CaptureBar = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef(null);
  const recognizerRef = useRef(null);

  const voiceSupported = isVoiceSupported();

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setText("");
    setVoiceError("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoice = () => {
    setVoiceError("");

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognizer = createVoiceRecognizer(
      (transcript) => {
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      },
      (errorMsg) => {
        setVoiceError(errorMsg);
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
      setTimeout(() => setIsListening(false), 10000);
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-8 pt-4 pointer-events-none">
      {/* Subtle fade gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pointer-events-none -z-10" />

      <div className="relative max-w-2xl mx-auto pointer-events-auto">
        <AnimatePresence>
          {voiceError && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 mb-2 font-medium"
            >
              {voiceError}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500 font-medium">Listening...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Palette Style Input */}
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(74, 96, 91, 0.2)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(229, 231, 235, 1)",
          }}
          className="bg-white rounded-xl flex items-end p-2 transition-shadow duration-200"
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Capture something..."
            rows={1}
            className="
              flex-1 resize-none bg-transparent text-sm text-gray-900
              placeholder-gray-400 focus:outline-none leading-relaxed
              min-h-[24px] max-h-[120px] py-1.5 px-3
            "
          />

          <div className="flex items-center gap-1.5 px-1 pb-0.5">
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                title="Voice Input"
                className={`
                  flex-shrink-0 p-1.5 rounded-md transition-colors
                  ${
                    isListening
                      ? "bg-red-50 text-red-600"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={!hasText || isLoading}
              title="Capture"
              className={`
                flex-shrink-0 p-1.5 rounded-md transition-colors
                ${
                  hasText && !isLoading
                    ? "bg-[#111827] text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </motion.div>

        {isFocused && (
           <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide">
             ENTER TO SUBMIT · SHIFT + ENTER FOR NEW LINE
           </p>
        )}
      </div>
    </div>
  );
};

export default CaptureBar;
