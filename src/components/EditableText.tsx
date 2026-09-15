import React, { useState, useEffect, useRef, useContext, createContext } from 'react';

export const EditingContext = createContext<boolean>(true);

interface EditableTextProps {
  value?: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  isEditingEnabled?: boolean;
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
  }) => {
    const contextEditingEnabled = useContext(EditingContext);
    const isEditing = explicitEditingEnabled !== undefined ? explicitEditingEnabled : contextEditingEnabled;

    const [localVal, setLocalVal] = useState<string>(value || '');
    const isComposingRef = useRef(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Keep in sync with external value changes (e.g. template reload or station switch)
    useEffect(() => {
      setLocalVal(value || '');
    }, [value]);

    // Clean up timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    if (!isEditing) {
      return (
        <span
          className={`whitespace-pre-wrap break-words leading-snug block select-text ${className}`}
          style={style}
        >
          {value || ''}
        </span>
      );
    }

    const triggerChange = (val: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(val);
      }, 80);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newVal = e.target.value;
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
      const newVal = (e.target as HTMLInputElement).value;
      setLocalVal(newVal);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onChange(newVal);
    };

    const handleBlur = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (localVal !== value) {
        onChange(localVal);
      }
    };

    if (multiline) {
      // If content is long (> 24 chars or contains newline), display on 2 lines cleanly
      const isLong = localVal.length > 24 || localVal.includes('\n');
      const rows = isLong ? 2 : 1;

      return (
        <textarea
          value={localVal}
          onChange={handleTextChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          className={`bg-transparent outline-none focus:bg-amber-50/60 hover:bg-slate-50/70 transition-colors w-full resize-none break-words whitespace-pre-wrap leading-snug overflow-hidden ${className}`}
          style={{
            color: 'inherit',
            font: 'inherit',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflow: 'hidden',
            resize: 'none',
            lineHeight: '1.25',
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
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`bg-transparent outline-none focus:bg-amber-50/60 hover:bg-slate-50/70 transition-colors w-full leading-normal ${className}`}
        style={{ color: 'inherit', font: 'inherit', ...style }}
      />
    );
  }
);

EditableText.displayName = 'EditableText';
