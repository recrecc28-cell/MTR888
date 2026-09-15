import React from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Printer,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  blobUrl: string | null;
  fileName: string;
  pageCount: number;
  stationCount: number;
  fileSizeKB: number;
}

export const PdfDownloadSuccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  blobUrl,
  fileName,
  pageCount,
  stationCount,
  fileSizeKB,
}) => {
  if (!isOpen || !blobUrl) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">PDF 報告已成功生成！</h2>
              <p className="text-xs text-emerald-100">
                一站一頁 ‧ 包含所有設備數據與手寫簽名
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="truncate">{fileName}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-200">
              <span>
                站點數：<strong className="text-emerald-700">{stationCount} 站</strong>
              </span>
              <span>‧</span>
              <span>
                總頁數：<strong className="text-emerald-700">{pageCount} 頁 (A4 橫向)</strong>
              </span>
              <span>‧</span>
              <span>
                大小：<strong className="text-slate-700">{fileSizeKB > 0 ? `${fileSizeKB} KB` : '已最佳化'}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            系統已嘗試觸發自動下載。如您的瀏覽器限制了自動下載，請點擊下方按鈕直接儲存或在新分頁中檢視：
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Direct Download Button */}
            <a
              href={blobUrl}
              download={fileName}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Download className="w-4 h-4" />
              <span>📥 點擊立即下載 PDF 檔案</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              {/* Open in New Tab Button */}
              <a
                href={blobUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                <span>在新分頁開啟 / 預覽</span>
              </a>

              {/* Native Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>瀏覽器列印 (另存 PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>格式符合港鐵 A4 標準橫向規範</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
