import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  FileDown,
  MoreVertical,
  RotateCcw,
  Archive,
  History,
  Printer,
  HelpCircle,
  Presentation,
  CheckCircle2,
  Train,
  ChevronDown,
  Trash2,
} from 'lucide-react';

interface Props {
  onUploadExcelClick: () => void;
  onResetDefaultPdfClick: () => void;
  onClearAllDataClick: () => void;
  onLoadSampleClick?: () => void;
  onSaveToArchiveClick: () => void;
  onOpenArchiveHistoryClick: () => void;
  onExportPdfClick: () => void;
  onPrintClick: () => void;
  onOpenHelpClick: () => void;
  onOpenPptClick?: () => void;
  lastSavedTime?: string;
  archiveCount?: number;
}

export const HeaderNavbar: React.FC<Props> = ({
  onUploadExcelClick,
  onResetDefaultPdfClick,
  onClearAllDataClick,
  onLoadSampleClick,
  onSaveToArchiveClick,
  onOpenArchiveHistoryClick,
  onExportPdfClick,
  onPrintClick,
  onOpenHelpClick,
  onOpenPptClick,
  lastSavedTime,
  archiveCount = 0,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 shadow-xs sticky top-0 z-30 no-print">
      <div className="max-w-[1650px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white shadow-xs">
            <Train className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                港鐵保養工程報告系統
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 rounded">
                MTR PM Report
              </span>
            </div>
            {lastSavedTime && (
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>已自動暫存</span>
              </p>
            )}
          </div>
        </div>

        {/* Primary Action Buttons & More Dropdown */}
        <div className="flex items-center gap-2">
          {/* Core Button 1: Upload Excel */}
          <button
            type="button"
            onClick={onUploadExcelClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
            title="上傳港鐵保養清單 Excel 檔"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>上傳 Excel</span>
          </button>

          {/* Core Button 2: Export PDF */}
          <button
            type="button"
            onClick={onExportPdfClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
            title="匯出 A4 PDF 報告"
          >
            <FileDown className="w-4 h-4" />
            <span>匯出 PDF</span>
          </button>

          {/* More Options Dropdown (Cleanly collapses secondary buttons) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="更多工具與歷史紀錄"
            >
              <span>更多</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onSaveToArchiveClick();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-600" />
                  <span>儲存至歷史歸檔</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenArchiveHistoryClick();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-sky-600" />
                    <span>查看歷史歸檔</span>
                  </div>
                  {archiveCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 font-bold">
                      {archiveCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onPrintClick();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>直接列印畫面</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                {onLoadSampleClick && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      onLoadSampleClick();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 text-sky-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
                    <span>載入示範範本 (Load Sample)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onResetDefaultPdfClick();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-700 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>清空本站表格 (Clear Station)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onClearAllDataClick();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-700 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>清空全部資料 (Clear All)</span>
                </button>

                {onOpenPptClick && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      onOpenPptClick();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-purple-50 text-purple-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Presentation className="w-3.5 h-3.5 text-purple-600" />
                    <span>系統簡報 (PPT)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenHelpClick();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-600 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>操作說明</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
