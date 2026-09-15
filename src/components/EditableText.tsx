import React, { useState, useEffect, useRef, useContext, createContext, useMemo } from 'react';

export const EditingContext = createContext<boolean>(true);

interface EditableTextProps {
  value?: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  isEditingEnabled?: boolean;
  stripAngleBrackets?: boolean; // User rule: no need the <> in WORK DESCRIPTION
}

/**
 * Format long text cleanly into at most 2 lines by splitting at a natural word boundary
 */
export function formatTwoLinesCleanly(text: string): string {
  if (!text) return '';
  const clean = text.replace(/[<>]/g, '').trim();
  if (clean.includes('\n')) {
    // Already has newlines - limit to at most 2 lines
    const lines = clean.split('\n');
    return lines.slice(0, 2).join('\n');
  }
  if (clean.length <= 26) {
    return clean;
  }
  // Find a good split point near character 20 to 35
  const mid = Math.floor(clean.length / 2);
  let bestSpaceIndex = -1;
  let minDiff = 999;

  // Prefer splitting at hyphen, slash, or space
  for (let i = 12; i < clean.length - 8; i++) {
    const ch = clean[i];
    if (ch === ' ' || ch === '/' || ch === '-') {
      const diff = Math.abs(i - mid);
      if (diff < minDiff) {
        minDiff = diff;
        bestSpaceIndex = i;
      }
    }
  }

  if (bestSpaceIndex > 0) {
    const part1 = clean.substring(0, bestSpaceIndex + (clean[bestSpaceIndex] === ' ' ? 0 : 1)).trim();
    const part2 = clean.substring(bestSpaceIndex + 1).trim();
    return `${part1}\n${part2}`;
  }

  return clean;
}

export const EditableText: React.FC<EditableTextProps> = React.memo(
  ({
    value = '',
    onChange,
    className = '',
    placeholder = '',
    style = {},
    multiline = false,
    isEditingEnabled: explicitEditingEnabled,
    stripAngleBrackets = false,
  }) => {
    const contextEditingEnabled = useContext(EditingContext);
    const isEditing = explicitEditingEnabled !== undefined ? explicitEditingEnabled : contextEditingEnabled;

    const sanitize = (val: string) => {
      if (!val) return '';
      if (stripAngleBrackets || multiline) {
        return val.replace(/[<>]/g, '');
      }
      return val;
    };

    const [localVal, setLocalVal] = useState<string>(() => sanitize(value || ''));
    const isFocusedRef = useRef(false);
    const isComposingRef = useRef(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const latestValRef = useRef(localVal);

    latestValRef.current = localVal;

    // Keep in sync with external value changes ONLY when input is not actively being edited by user
    useEffect(() => {
      if (!isFocusedRef.current) {
        setLocalVal(sanitize(value || ''));
      }
    }, [value]);

    // Clean up timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    const triggerChange = (val: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(val);
      }, 350);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let newVal = e.target.value;
      if (stripAngleBrackets || multiline) {
        newVal = newVal.replace(/[<>]/g, '');
      }
      setLocalVal(newVal);

      if (!isComposingRef.current) {
        triggerChange(newVal);
      }
    };

    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      isComposingRef.current = false;
      let newVal = (e.target as HTMLInputElement).value;
      if (stripAngleBrackets || multiline) {
        newVal = newVal.replace(/[<>]/g, '');
      }
      setLocalVal(newVal);
      triggerChange(newVal);
    };

    const handleFocus = () => {
      isFocusedRef.current = true;
    };

    const handleBlur = () => {
      isFocusedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      let finalVal = latestValRef.current;
      if (stripAngleBrackets || multiline) {
        finalVal = finalVal.replace(/[<>]/g, '');
      }
      if (finalVal !== value) {
        onChange(finalVal);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !multiline) {
        e.currentTarget.blur();
      }
    };

    const displayFormatted = useMemo(() => {
      const clean = sanitize(value || '');
      if (multiline) {
        return formatTwoLinesCleanly(clean);
      }
      return clean;
    }, [value, multiline]);

    if (!isEditing) {
      return (
        <span
          className={`whitespace-pre-wrap break-words leading-tight block select-text ${className}`}
          style={style}
        >
          {displayFormatted}
        </span>
      );
    }

    if (multiline) {
      const isLong = localVal.length > 24 || localVal.includes('\n');
      const rows = isLong ? 2 : 1;

      return (
        <textarea
          value={localVal}
          onChange={handleTextChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          className={`bg-transparent outline-none focus:bg-amber-50/70 hover:bg-slate-50/70 transition-colors w-full resize-none break-words whitespace-pre-wrap leading-tight overflow-hidden ${className}`}
          style={{
            color: 'inherit',
            font: 'inherit',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflow: 'hidden',
            resize: 'none',
            lineHeight: '1.25',
            minHeight: isLong ? '2.4em' : '1.25em',
            ...style,
          }}
        />
      );
    }

    return (
      <input
        type="text"
        value={localVal}
        onChange={handleTextChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-transparent outline-none focus:bg-amber-50/70 hover:bg-slate-50/70 transition-colors w-full leading-normal ${className}`}
        style={{ color: 'inherit', font: 'inherit', ...style }}
      />
    );
  }
);

EditableText.displayName = 'EditableText';

