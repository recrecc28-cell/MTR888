import React from 'react';
import { X, FileSpreadsheet, Sliders, Archive, FileDown, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 no-print">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-2xl w-full text-slate-900 p-6 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-1">
          港鐵保養工程師 - PM 報告自動化與 PDF 微調指南
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          專為港鐵 Depot 維修工程團隊設計，簡化每月 Excel 數據提取、自動歸檔與 PDF 精細對位工作流程。
        </p>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="flex gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 mb-0.5">1. 上傳與對應 Excel 清單</h3>
              <p className="text-slate-500">
                點擊「上傳 Excel 檔」，選擇港鐵發出的保養清單 (.xlsx, .xls)。系統會自動識別 Depot (如 TWD)、月份、合約編號、保養項目、WO 工單與數量 QTY，並自動對應輸入至 PDF 預覽畫面。
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 mb-0.5">2. PDF 畫面上直接編輯與全位置微調</h3>
              <p className="text-slate-500">
                點擊 PDF 預覽畫面上的任何文字 (如廠組名稱、數量、工單號或填報工程師姓名) 均可即時編輯修改。位於頁面最底部的微調面板（可隨時顯示/隱藏）可精細調整字型大小、欄寬比例、行距及 X/Y 軸位置偏移。
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 mb-0.5">3. 每月數據自動歸檔與搜尋</h3>
              <p className="text-slate-500">
                點擊頂部「自動歸檔」，即可將當月 PM 報告完整保存至本機歷史紀錄庫。方便隨時查閱過往月份紀錄、重新載入編輯或對比差異。
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 mb-0.5">4. 高清 A4 PDF 匯出與列印</h3>
              <p className="text-slate-500">
                點擊「匯出 PDF 檔」，可輸出向量級高清 A4 橫向 PDF 檔案，格式與港鐵官方標準 PM Performance Breakdown 100% 吻合，方便直接呈交審批。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white rounded-lg transition-colors"
          >
            明白並開始使用
          </button>
        </div>
      </div>
    </div>
  );
};
