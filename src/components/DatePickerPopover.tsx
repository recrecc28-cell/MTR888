import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface DatePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // 'YYYY-MM-DD' or other format to normalize
  onSelectDate: (formattedDate: string, syncToAllSignatories: boolean, syncToAllStations: boolean) => void;
  roleName?: string; // e.g. 'Prepared By', 'Verified By', 'Endorsed By'
  triggerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Normalizes any date string (ISO, YYYY/MM/DD, DD/MM/YYYY, etc.) to standard 'YYYY-MM-DD'
 */
export function normalizeToStandardDate(val: string | null | undefined): string {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (!trimmed) return '';

  // Already standard YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = trimmed.match(/^(\d{4})[./\-](\d{1,2})[./\-](\d{1,2})$/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, '0');
    const d = ymdMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[./\-](\d{1,2})[./\-](\d{4})$/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${y}-${m}-${d}`;
  }

  // Native Date parsing fallback
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch {
    // ignore
  }

  return trimmed;
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  roleName = '簽名日期',
  triggerRef,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse initial view year and month from selectedDate or today
  const normalizedInitial = normalizeToStandardDate(selectedDate);
  const initialDateObj = normalizedInitial ? new Date(normalizedInitial) : new Date();
  const validInitial = !isNaN(initialDateObj.getTime()) ? initialDateObj : new Date();

  const [viewYear, setViewYear] = useState<number>(validInitial.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(validInitial.getMonth()); // 0 - 11
  const [syncToAllSignatories, setSyncToAllSignatories] = useState<boolean>(false);
  const [syncToAllStations, setSyncToAllStations] = useState<boolean>(false);

  // Update calendar view when modal opens
  useEffect(() => {
    if (isOpen) {
      const norm = normalizeToStandardDate(selectedDate);
      const d = norm ? new Date(norm) : new Date();
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [isOpen, selectedDate]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        if (triggerRef?.current && triggerRef.current.contains(target)) {
          return;
        }
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar matrix (matching user reference screenshot)
  // Day of week headers: 日 一 二 三 四 五 六 (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  // Days calculation
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Previous month trailing days
  const prevDays: { day: number; isCurrentMonth: boolean; year: number; month: number }[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    prevDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      year: prevY,
      month: prevM,
    });
  }

  // Current month days
  const currentDays: { day: number; isCurrentMonth: boolean; year: number; month: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    currentDays.push({
      day: d,
      isCurrentMonth: true,
      year: viewYear,
      month: viewMonth,
    });
  }

  // Next month leading days to complete 35 or 42 grid slots
  const totalSlots = prevDays.length + currentDays.length <= 35 ? 35 : 42;
  const nextSlotsNeeded = totalSlots - (prevDays.length + currentDays.length);
  const nextDays: { day: number; isCurrentMonth: boolean; year: number; month: number }[] = [];
  for (let d = 1; d <= nextSlotsNeeded; d++) {
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    nextDays.push({
      day: d,
      isCurrentMonth: false,
      year: nextY,
      month: nextM,
    });
  }

  const allCalendarDays = [...prevDays, [...currentDays], ...nextDays].flat();

  // Today
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const currentSelectedStr = normalizeToStandardDate(selectedDate);

  const handleDayClick = (y: number, m: number, d: number) => {
    const formatted = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onSelectDate(formatted, syncToAllSignatories, syncToAllStations);
    onClose();
  };

  const handleSelectToday = () => {
    onSelectDate(todayStr, syncToAllSignatories, syncToAllStations);
    onClose();
  };

  const handleSelectMonthEnd = () => {
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    onSelectDate(formatted, syncToAllSignatories, syncToAllStations);
    onClose();
  };

  const handleClearDate = () => {
    onSelectDate('', syncToAllSignatories, syncToAllStations);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs sm:absolute sm:inset-auto sm:z-50"
      style={{
        // On desktop, can float relative to trigger or center
      }}
    >
      <div
        className="w-full max-w-[320px] bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}
      >
        {/* Header Bar */}
        <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <CalendarIcon className="w-4 h-4 text-sky-600" />
            <span>選擇日期 ({roleName})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded transition-colors"
            title="關閉"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Calendar Nav: < 2026年 9月 > (exact match to user screenshot layout) */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/70 border-b border-slate-100">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 text-slate-600 hover:text-sky-700 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="上一月"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className="font-semibold text-xs text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-sky-400"
            >
              {Array.from({ length: 25 }, (_, idx) => 2015 + idx).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}年
                </option>
              ))}
            </select>

            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              className="font-semibold text-xs text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-sky-400"
            >
              {Array.from({ length: 12 }, (_, idx) => idx).map((m) => (
                <option key={m} value={m}>
                  {m + 1}月
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 text-slate-600 hover:text-sky-700 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="下一月"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Weekday Names: 日 一 二 三 四 五 六 */}
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-600 bg-slate-100/50 py-1 border-b border-slate-100">
          {weekdays.map((w, idx) => (
            <div
              key={w}
              className={`py-0.5 ${idx === 0 || idx === 6 ? 'text-amber-700' : 'text-slate-700'}`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-0.5 p-2 text-center text-xs">
          {allCalendarDays.map((item, idx) => {
            const dateKey = `${item.year}-${String(item.month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
            const isSelected = currentSelectedStr === dateKey;
            const isToday = todayStr === dateKey;

            return (
              <button
                key={`${dateKey}-${idx}`}
                type="button"
                onClick={() => handleDayClick(item.year, item.month, item.day)}
                className={`h-7 w-7 mx-auto flex items-center justify-center rounded transition-all cursor-pointer text-xs ${
                  !item.isCurrentMonth
                    ? 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                    : isSelected
                    ? 'border-2 border-rose-600 font-bold text-rose-700 bg-rose-50 shadow-xs' // Red border box matching user's image!
                    : isToday
                    ? 'border border-sky-400 font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100'
                    : 'text-slate-800 hover:bg-slate-100 hover:font-semibold'
                }`}
                title={dateKey}
              >
                {item.day}
              </button>
            );
          })}
        </div>

        {/* Quick Buttons Bar: matches user reference image with "今天" button in pink highlight */}
        <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleClearDate}
            className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors cursor-pointer"
          >
            清除
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSelectMonthEnd}
              className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded border border-slate-200 transition-colors cursor-pointer"
              title="選擇當月最後一日"
            >
              月底
            </button>

            {/* Prominent "今天" button with tactile border matching user reference image */}
            <button
              type="button"
              onClick={handleSelectToday}
              className="px-3 py-1 text-xs font-bold text-slate-800 bg-linear-to-b from-slate-50 to-slate-200 hover:from-slate-100 hover:to-slate-300 active:to-slate-200 border border-slate-400 rounded shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              title="選擇今天日期"
            >
              <span>今天</span>
            </button>
          </div>
        </div>

        {/* Synchronization toggles for batch signing */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-[11px] space-y-1 text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={syncToAllSignatories}
              onChange={(e) => setSyncToAllSignatories(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 accent-sky-600 cursor-pointer"
            />
            <span>同步套用至其餘 2 位簽名人（預設未勾選，3人可選不同日期）</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={syncToAllStations}
              onChange={(e) => setSyncToAllStations(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 accent-sky-600 cursor-pointer"
            />
            <span>同步套用至所有站點 (All Stations)</span>
          </label>
        </div>

        {/* Unified Format Tag */}
        <div className="px-3 py-1 bg-slate-100 text-[10px] text-slate-500 text-center border-t border-slate-200 flex items-center justify-center gap-1">
          <Check className="w-3 h-3 text-emerald-600" />
          <span>統一日期標準格式：<strong className="font-mono text-slate-700">YYYY-MM-DD</strong> (例如 2026-09-15)</span>
        </div>
      </div>
    </div>
  );
};
