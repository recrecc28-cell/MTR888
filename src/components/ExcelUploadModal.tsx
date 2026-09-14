import React, { useState, useEffect } from 'react';
import {
  parseExcelFile,
  parsePastedText,
  downloadSampleExcelTemplate,
  ParsedTableResult,
} from '../utils/excelHelper';
import { MaintenanceReportData, MaintenanceItem } from '../types';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
  Train,
  ClipboardPaste,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ALL_MTR_LOCATIONS,
  MTR_STATIONS_LIST,
  MTR_DEPOTS_LIST,
  getLocationByCode,
} from '../data/mtrLocations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDataParsed: (parsedData: Partial<MaintenanceReportData>, fileName: string) => void;
  currentDepotCode?: string;
  existingItems?: MaintenanceItem[];
  defaultTab?: 'upload' | 'paste';
}

const SAMPLE_MAXIMO_DATA = `Workgroup\tWO_WONUM\tASSETNUM\tTARGSTARTDA\tASSET.DESCRIPTION\tJOBPLAN.DESCRIPTION\tJPNUM\tLOCATION
COURYODN\t5001800024\tLAK-ECS-ACC-101\t2026-09-01\tMR HTD ECS-AIR HANDLING UNIT ALL\tECS CONTRACT OUT PM JOB; RYODEN; (1M CHK)\tECS-ACC-T-LAK-1M-9\tLAK
COURYODN\t5001803983\tLAK-ECS-ACC-102\t2026-09-01\tMR HTD ECS-Electro-thermal linked fire damper - ALL\tECS CONTRACT OUT PM JOB; RYODEN; (4M CHK)\tECSRYHTD-4M-1\tLAK
COURYODN\t5001805715\tLAK-ECS-ACC-103\t2026-09-01\tMR HTD ECS-FAN COIL UNIT ALL\tECS VENTILATION SYSTEM CONTRACT OUT PM JOB; REC; (1Y CHK)\tECSRYHTD-1Y-1\tLAK
COURYODN\t5001801492\tLAK-ECS-ACC-104\t2026-09-01\tMR HTD ECS-Fusible linked fire damper - ALL\tECS CONTRACT OUT PM JOB; RYODEN; (6M CHK)\tECSRYHTD-6M-1\tLAK
COURYODN\t5001802345\tLAK-ECS-ACC-105\t2026-09-01\tMR PHD ECS-AIR COMPRESSOR - ALL\tECS CONTRACT OUT PM JOB; RYODEN; (18M CHK)\tECSRYHTD-18M-1\tLAK
COURYODN\t5001809991\tTIC-ECS-ACC-201\t2026-09-01\tMR HTD ECS-AIR HANDLING UNIT ALL\tECS CONTRACT OUT PM JOB; RYODEN; (1M CHK)\tECS-ACC-T-TIC-1M-9\tTIC
COURYODN\t5001809992\tTIC-ECS-ACC-202\t2026-09-01\tMR HTD ECS-Motorised Operated Damper - ALL\tECS CONTRACT OUT PM JOB; RYODEN; (2Y CHK)\tECSRYHTD-2Y-1\tTIC`;

export const ExcelUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDataParsed,
  currentDepotCode = 'AIR',
  existingItems = [],
  defaultTab = 'upload',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>(defaultTab);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live parsed preview
  const [livePreview, setLivePreview] = useState<ParsedTableResult | null>(null);

  // Depot/Station Filter States
  const [targetDepotCode, setTargetDepotCode] = useState<string>(currentDepotCode || 'AIR');
  const [filterByDepot, setFilterByDepot] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setErrorMessage(null);
      if (currentDepotCode) {
        setTargetDepotCode(currentDepotCode);
      }
    } else {
      setSelectedFile(null);
      setPastedText('');
      setLivePreview(null);
    }
  }, [isOpen, currentDepotCode, defaultTab]);

  // Try to parse pasted text live
  useEffect(() => {
    if (activeTab === 'paste' && pastedText.trim()) {
      try {
        const parsed = parsePastedText(pastedText, {
          targetDepotCode,
          filterByDepot,
          existingItems,
        });
        setLivePreview(parsed);
        setErrorMessage(null);
        if (parsed.detectedLocation) {
          setTargetDepotCode(parsed.detectedLocation);
        }
      } catch (err: any) {
        setLivePreview(null);
        setErrorMessage(err.message || '無法解析貼上的資料');
      }
    } else if (activeTab === 'paste' && !pastedText.trim()) {
      setLivePreview(null);
      setErrorMessage(null);
    }
  }, [pastedText, activeTab, targetDepotCode, filterByDepot]);

  if (!isOpen) return null;

  // Try to auto-detect station code from uploaded file name
  const detectStationFromFileName = (fileName: string): string | null => {
    const cleanName = fileName.toUpperCase().replace(/\.[^/.]+$/, '');
    for (const loc of ALL_MTR_LOCATIONS) {
      if (
        cleanName === loc.code ||
        cleanName.startsWith(loc.code + '-') ||
        cleanName.startsWith(loc.code + '_') ||
        cleanName.startsWith(loc.code + ' ')
      ) {
        return loc.code;
      }
    }
    for (const loc of ALL_MTR_LOCATIONS) {
      if (cleanName.includes(loc.code)) {
        return loc.code;
      }
    }
    return null;
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setSelectedFile(file);
        setErrorMessage(null);
        const detected = detectStationFromFileName(file.name);
        if (detected) setTargetDepotCode(detected);

        // Run live parse
        try {
          const parsed = await parseExcelFile(file, {
            targetDepotCode: detected || targetDepotCode,
            filterByDepot,
            existingItems,
          });
          setLivePreview(parsed);
          if (parsed.detectedLocation) setTargetDepotCode(parsed.detectedLocation);
        } catch (err: any) {
          setLivePreview(null);
        }
      } else {
        setErrorMessage('請上傳有效的 Excel 檔案 (.xlsx, .xls, .csv)');
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMessage(null);
      const detected = detectStationFromFileName(file.name);
      if (detected) setTargetDepotCode(detected);

      try {
        const parsed = await parseExcelFile(file, {
          targetDepotCode: detected || targetDepotCode,
          filterByDepot,
          existingItems,
        });
        setLivePreview(parsed);
        if (parsed.detectedLocation) setTargetDepotCode(parsed.detectedLocation);
      } catch (err: any) {
        setLivePreview(null);
      }
    }
  };

  const handleProcessSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let parsedData: ParsedTableResult;
      let label = '數據輸入';

      if (activeTab === 'paste') {
        if (!pastedText.trim()) {
          throw new Error('請先貼上資料內容');
        }
        parsedData = parsePastedText(pastedText, {
          targetDepotCode: targetDepotCode.trim().toUpperCase() || 'AIR',
          filterByDepot,
          existingItems,
        });
        label = '貼上資料';
      } else {
        if (!selectedFile) {
          throw new Error('請先選擇或拖放 Excel 檔案');
        }
        parsedData = await parseExcelFile(selectedFile, {
          targetDepotCode: targetDepotCode.trim().toUpperCase() || 'AIR',
          filterByDepot,
          existingItems,
        });
        label = selectedFile.name;
      }

      onDataParsed(parsedData, label);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '讀取資料失敗，請確認格式。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setPastedText(SAMPLE_MAXIMO_DATA);
  };

  const currentLocation = getLocationByCode(targetDepotCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 no-print animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full text-slate-900 p-6 relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">讀取港鐵保養數據 (Read Data)</h2>
            <p className="text-xs text-slate-500">
              支援上傳 Excel 檔或直接貼上 Maximo 表格，自動提取工單號碼並填入報告
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-medium">
              <span className="bg-emerald-100/70 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                WO_WONUM = WONUM
              </span>
              <span>‧</span>
              <span className="bg-emerald-100/70 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                ASSET.DESCRIPTION → 設備名稱提取
              </span>
              <span>‧</span>
              <span className="bg-emerald-100/70 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                JOBPLAN.DESCRIPTION → 週期 (1M, 3M, 4M, 6, 1Y, 18M, 2Y, 3Y)
              </span>
            </div>
          </div>
        </div>

        {/* Two Switchable Tabs: Upload File vs Paste Data */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-4 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>📁 上傳 Excel 檔案</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>📋 直接貼上資料 (Paste)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
          {/* Target Station Selection & Filter Options */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-slate-700">目標站點 / 車廠:</span>
                <select
                  value={targetDepotCode}
                  onChange={(e) => setTargetDepotCode(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-emerald-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <optgroup label="選擇站點">
                    {MTR_STATIONS_LIST.map((loc) => (
                      <option key={loc.code} value={loc.code}>
                        {loc.code} - {loc.nameZh} ({loc.nameEn})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="車廠">
                    {MTR_DEPOTS_LIST.map((loc) => (
                      <option key={loc.code} value={loc.code}>
                        {loc.code} - {loc.nameZh} ({loc.nameEn})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={filterByDepot}
                  onChange={(e) => setFilterByDepot(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500"
                />
                <Filter className="w-3 h-3 text-emerald-600" />
                <span>嚴格過濾此站 (非此站忽略)</span>
              </label>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              目標站點：
              <span className="text-emerald-700 font-bold font-mono ml-1">
                {targetDepotCode}
              </span>
              {currentLocation ? ` (${currentLocation.nameZh} - ${currentLocation.line})` : ''}
              。系統優先檢查 <span className="font-semibold text-slate-700">ASSETNUM 頭 3 個英文字</span>（如 LAK、TIC、CRP、DIH），非所選站點將自動忽略不用，QTY 固定為 1。
            </p>
          </div>

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50'
                  : selectedFile
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
              onClick={() => document.getElementById('excel-file-input')?.click()}
            >
              <input
                id="excel-file-input"
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-1.5">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-700">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB ‧ 點擊更換檔案
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    拖拽 Excel (.xlsx) 檔案到此處，或{' '}
                    <span className="text-emerald-600 underline">點擊瀏覽檔案</span>
                  </p>
                  <p className="text-xs text-slate-500">支援單站 Excel (如 LAK.xlsx, AIR.xlsx) 或綜合清單</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Direct Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  貼上表格資料 (複製 Excel 儲存格或 Maximo 匯出內容)：
                </span>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>帶入範例資料 (含 LAK 與 TIC 測試忽略)</span>
                </button>
              </div>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`貼上資料格式範例：\nWorkgroup\tWO_WONUM\tASSETNUM\tTARGSTARTDA\tASSET.DESCRIPTION\tLOCATION\nCOURYODN\t5001800024\tLAK-ECS-ACC-101\t2026-09-01\tAir Cooled Chiller\tLAK\n...`}
                rows={5}
                className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 leading-relaxed resize-none"
              />
            </div>
          )}

          {/* Live Recognition Summary Card (WHEN DATA IS PARSED) */}
          {livePreview && (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>系統已成功識別數據</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60">
                <div>
                  <span className="text-slate-500">識別站點：</span>
                  <span className="font-bold text-emerald-800 font-mono ml-1">
                    {livePreview.detectedLocation || targetDepotCode}
                  </span>
                  {getLocationByCode(livePreview.detectedLocation || targetDepotCode) && (
                    <span className="text-slate-600 ml-1">
                      ({getLocationByCode(livePreview.detectedLocation || targetDepotCode)?.nameZh})
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">識別月份：</span>
                  <span className="font-bold text-emerald-800 ml-1">
                    {livePreview.detectedMonthYear || livePreview.reportMonthYear}
                  </span>
                </div>
              </div>

              {livePreview.matchedItemsSummary && livePreview.matchedItemsSummary.length > 0 && (
                <div className="mt-1 pt-1.5 border-t border-emerald-200/60 text-xs">
                  <span className="text-slate-600 font-medium">對應項目明細：</span>
                  <div className="mt-1 space-y-1 max-h-28 overflow-y-auto">
                    {livePreview.matchedItemsSummary.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 p-1.5 rounded border border-emerald-100 flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{item.workDescription}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            工單：{item.wos.slice(0, 4).join(', ')}
                            {item.wos.length > 4 ? ` ...(+${item.wos.length - 4})` : ''}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-emerald-700">{item.count} 個工單</span>
                          <p className="text-[10px] text-slate-400 font-mono">頻率: {item.frequency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3.5">
          <button
            type="button"
            onClick={downloadSampleExcelTemplate}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下載標準 Excel 範本</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              disabled={isLoading || (activeTab === 'upload' && !selectedFile) || (activeTab === 'paste' && !pastedText.trim())}
              onClick={handleProcessSubmit}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isLoading ? (
                '處理中...'
              ) : (
                <>
                  <span>確認讀取並填入報告</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
