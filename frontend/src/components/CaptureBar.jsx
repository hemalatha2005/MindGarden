import { useState } from "react";
import { Sparkles, ArrowUp } from "lucide-react";

const CaptureBar = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <div className="mb-6">
      <form
        onSubmit={handleSubmit}
        className={`
          relative flex items-center bg-garden-surface rounded-xl transition-all duration-250
          border
          ${isFocused
            ? "border-garden-primary/40 shadow-glow"
            : "border-garden-border hover:border-garden-borderHover"}
        `}
      >
        <div className={`pl-4 transition-colors duration-200 ${isFocused ? "text-garden-primary" : "text-garden-muted/50"}`}>
          <Sparkles size={17} />
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Capture a thought... try /task, /note, /reminder, /idea"
          className="flex-1 bg-transparent py-3.5 px-3 text-[14px] text-garden-text placeholder:text-garden-muted/40 focus:outline-none"
          disabled={isLoading}
        />

        <div className="pr-2">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`
              flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
              ${text.trim() && !isLoading
                ? "bg-garden-primary text-white hover:bg-garden-primaryHover shadow-glow"
                : "bg-garden-elevated text-garden-muted/40 cursor-not-allowed"}
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp size={15} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaptureBar;
