import React, { useState } from 'react';
import { ArchiveRecord } from '../types';
import { Archive, Search, Trash2, ExternalLink, Calendar, FileText, Download, X, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  archives: ArchiveRecord[];
  onLoadArchive: (record: ArchiveRecord) => void;
  onDeleteArchive: (id: string) => void;
  onClearAllArchives: () => void;
}

export const ArchiveHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  archives,
  onLoadArchive,
  onDeleteArchive,
  onClearAllArchives,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredArchives = archives.filter((rec) => {
    const term = searchTerm.toLowerCase();
    const data = rec.reportData;
    return (
      data.depotTitle.toLowerCase().includes(term) ||
      data.reportMonthYear.toLowerCase().includes(term) ||
      data.contractNo.toLowerCase().includes(term) ||
      data.signatories.preparedByName.toLowerCase().includes(term) ||
      (rec.notes && rec.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 no-print">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-3xl w-full text-slate-900 p-6 relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">港鐵保養報告自動歸檔歷史庫</h2>
            <p className="text-xs text-slate-500">已儲存 {archives.length} 份每月 PM 保養清單記錄</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋廠組 (如 TWD), 月份 (如 July - 2026), 合約編號或負責工程師..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Archive List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredArchives.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2 border border-dashed border-slate-300 rounded-xl">
              <FileText className="w-8 h-8 mx-auto opacity-50 text-slate-500" />
              <p className="text-sm font-medium">尚無找到相關歸檔紀錄</p>
              <p className="text-xs text-slate-600">填寫好 PDF 報告後，點選頂部「自動歸檔」按紐即可將資料安全儲存於此。</p>
            </div>
          ) : (
            filteredArchives.map((record) => {
              const data = record.reportData;
              return (
                <div
                  key={record.id}
                  className="bg-white border border-slate-200/80 hover:border-sky-500/80 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded">
                        {data.depotCode || 'TWD'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{data.depotTitle}</h3>
                      <span className="text-xs text-slate-500">({data.reportMonthYear})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>合約: <strong className="text-slate-700">{data.contractNo}</strong></span>
                      <span>項目數量: <strong className="text-slate-700">{data.items.length} 項</strong></span>
                      <span>填報人: <strong className="text-slate-700">{data.signatories.preparedByName || '未填寫'}</strong></span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>歸檔時間: {new Date(record.archivedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadArchive(record);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors shadow-sm"
                      title="載入至 PDF 編輯器中編輯"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      載入編輯
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteArchive(record.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="刪除此歸檔紀錄"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {archives.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <span>共 {archives.length} 筆歸檔紀錄 (儲存於本機瀏覽器)</span>
            <button
              type="button"
              onClick={onClearAllArchives}
              className="text-rose-600 hover:text-rose-700 hover:underline"
            >
              清空所有歷史歸檔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
