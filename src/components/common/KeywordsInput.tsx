import React, { useState } from "react";
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";

const INITIAL_VISIBLE_COUNT = 6;

export function KeywordsInput({
  value = [],
  onChange,
  error,
  disabled = false,
}: {
  value?: string[];
  onChange: (keywords: string[]) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const addKeyword = (val: string) => {
    const trimmed = val?.trim();
    if (!trimmed) return;

    const lowercasedExisting = value?.map((k) => k?.toLowerCase()?.trim());
    if (lowercasedExisting?.includes(trimmed.toLowerCase())) {
      setInternalError(`Keyword "${trimmed}" already exists`);
      return;
    }

    const updated = [...value, trimmed];
    onChange(updated);
    setInternalError(null);
    setInput("");
  };

  const removeKeyword = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    if (updated.length === 0) {
      setInternalError("At least 1 keyword is required");
    } else {
      setInternalError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(input);
    }
  };

  const displayError = error || internalError;
  const hasHiddenKeywords = value?.length > INITIAL_VISIBLE_COUNT;
  const visibleKeywords = isExpanded
    ? value
    : value?.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = value?.length - INITIAL_VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-foreground">Keywords *</label>
        {value?.length > 0 && (
          <span className="text-xs font-semibold text-muted-foreground">
            {value?.length} {value?.length === 1 ? "keyword" : "keywords"}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            disabled={disabled}
            onChange={(e) => {
              setInput(e.target.value);
              if (internalError) setInternalError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type keyword and press Enter..."
            className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => addKeyword(input)}
            className="h-12 px-5 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="size-4" /> Add
          </button>
        </div>

        {value?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {visibleKeywords?.map((kw, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                {kw}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="hover:text-destructive transition-colors cursor-pointer">
                    <X className="size-3.5" />
                  </button>
                )}
              </span>
            ))}

            {hasHiddenKeywords && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors cursor-pointer border border-border">
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    +{hiddenCount} more <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-xs font-semibold text-destructive mt-0.5">
          {displayError}
        </p>
      )}
    </div>
  );
}

export default KeywordsInput;
