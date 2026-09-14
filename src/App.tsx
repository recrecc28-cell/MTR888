import React, { useState, useEffect, useMemo } from 'react';
import { MaintenanceReportData, FineTuneSettings, ArchiveRecord, MaintenanceItem } from './types';
import {
  defaultReportData,
  defaultFineTuneSettings,
  createDefaultReport,
  createEmptyReport,
  createLAKReport,
  ensureReportQuantities,
} from './data/defaultReport';
import {
  ALL_MTR_LOCATIONS,
  MTR_STATIONS_LIST,
  MTR_DEPOTS_LIST,
  getLocationByCode,
  getLocationTitle,
} from './data/mtrLocations';
import { HeaderNavbar } from './components/HeaderNavbar';
import { ReportPDFPreview } from './components/ReportPDFPreview';
import { FineTunePanel } from './components/FineTunePanel';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { ArchiveHistoryModal } from './components/ArchiveHistoryModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { PPTModal } from './components/PPTModal';
import { exportToPdf, printDocument } from './utils/pdfExport';
import {
  Check,
  SlidersHorizontal,
  Train,
  RotateCcw,
  Trash2,
  FileSpreadsheet,
  ClipboardPaste,
} from 'lucide-react';

const STORAGE_KEY_REPORTS_MAP = 'mtr_pm_reports_v5_cleared_depots';
const STORAGE_KEY_ACTIVE_DEPOT = 'mtr_pm_active_depot_code';
const STORAGE_KEY_FINETUNE = 'mtr_pm_finetune_settings';
const STORAGE_KEY_ARCHIVES = 'mtr_pm_archives_history';
const STORAGE_KEY_TMD_TWD_PHD_PURGED = 'mtr_cleared_tmd_twd_phd_done_v3';

export default function App() {
  // Active Station/Depot Tab - default to LAK
  const [currentDepot, setCurrentDepot] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_DEPOT);
      if (saved && getLocationByCode(saved)) {
        return saved;
      }
      return 'LAK';
    } catch {
      return 'LAK';
    }
  });

  // Helper to clean phantom preset items (e.g. Air Cooled Chiller with no PM W/O, or empty items)
  const cleanPresetItems = (report: MaintenanceReportData): MaintenanceReportData => {
    if (!report || !Array.isArray(report.items)) return report;
    const filteredItems = report.items.filter((item) => {
      const hasNoWo = !item.pmWo || item.pmWo.trim() === '';
      const isAirCooled = (item.workDescription || '').trim().toLowerCase() === 'air cooled chiller';
      const isBlank = !(item.workDescription || '').trim();
      // Filter out phantom items with no WO that are Air Cooled Chiller or empty
      if (hasNoWo && (isAirCooled || isBlank)) {
        return false;
      }
      return true;
    });

    if (filteredItems.length !== report.items.length) {
      return {
        ...report,
        items: filteredItems,
        overallTotals: {
          ...report.overallTotals,
          qtyTotal: String(filteredItems.length),
          mTotal: String(
            filteredItems.filter((i) => i.m && i.m.trim() !== '').length ||
              (filteredItems.length ? '100%' : '')
          ),
        },
      };
    }
    return report;
  };

  // Reports Map by Station/Depot
  const [reportsByDepot, setReportsByDepot] = useState<Record<string, MaintenanceReportData>>(() => {
    try {
      const isPurged = localStorage.getItem(STORAGE_KEY_TMD_TWD_PHD_PURGED);
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS_MAP);
      let parsedMap: Record<string, any> = {};

      if (saved) {
        try {
          parsedMap = JSON.parse(saved) || {};
        } catch (e) {
          console.error('Failed to parse saved reports map', e);
        }
      }

      const result: Record<string, MaintenanceReportData> = {};
      ALL_MTR_LOCATIONS.forEach((loc) => {
        const code = loc.code;
        // User directive: TMD/TWD/PHD 車廠的PM W/O, WORK DESCRIPTION 的預設內容，全部刪除, 只留車站名
        if (!isPurged && (code === 'TMD' || code === 'TWD' || code === 'PHD')) {
          result[code] = createEmptyReport(code);
        } else if (parsedMap[code]) {
          result[code] = cleanPresetItems(parsedMap[code]);
        } else {
          result[code] = createEmptyReport(code);
        }
      });

      // Mark migration flag so new user imports to TMD/TWD/PHD will be preserved
      if (!isPurged) {
        try {
          localStorage.setItem(STORAGE_KEY_TMD_TWD_PHD_PURGED, 'true');
          localStorage.removeItem('mtr_pm_reports_empty_v2');
          localStorage.removeItem('mtr_pm_reports_empty_v1');
        } catch {}
      }

      return result;
    } catch (e) {
      const result: Record<string, MaintenanceReportData> = {};
      ALL_MTR_LOCATIONS.forEach((loc) => {
        result[loc.code] = createEmptyReport(loc.code);
      });
      return result;
    }
  });

  // Current Active Report Data (empty by default)
  const reportData = useMemo(() => {
    return reportsByDepot[currentDepot] || createEmptyReport(currentDepot);
  }, [reportsByDepot, currentDepot]);

  // Current Location Info
  const currentLocationInfo = useMemo(() => {
    return getLocationByCode(currentDepot);
  }, [currentDepot]);

  // Helper to update current report
  const setReportData = (
    newDataOrFn: MaintenanceReportData | ((prev: MaintenanceReportData) => MaintenanceReportData)
  ) => {
    setReportsByDepot((prevMap) => {
      const current = prevMap[currentDepot] || createEmptyReport(currentDepot);
      const updated = typeof newDataOrFn === 'function' ? newDataOrFn(current) : newDataOrFn;
      return {
        ...prevMap,
        [currentDepot]: updated,
      };
    });
  };

  const [fineTuneSettings, setFineTuneSettings] = useState<FineTuneSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINETUNE);
      return saved ? JSON.parse(saved) : defaultFineTuneSettings;
    } catch (e) {
      return defaultFineTuneSettings;
    }
  });

  const [archives, setArchives] = useState<ArchiveRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARCHIVES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals & Panel Toggles
  const [isFineTuneOpen, setIsFineTuneOpen] = useState(false);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [uploadModalTab, setUploadModalTab] = useState<'upload' | 'paste'>('upload');
  const [isArchiveHistoryOpen, setIsArchiveHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPptOpen, setIsPptOpen] = useState(false);

  const handleOpenUploadModal = () => {
    setUploadModalTab('upload');
    setIsExcelUploadOpen(true);
  };

  const handleOpenPasteModal = () => {
    setUploadModalTab('paste');
    setIsExcelUploadOpen(true);
  };

  // Status banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | undefined>();

  // WO Fill Stats
  const woStats = useMemo(() => {
    const stats: Record<string, { filled: number; total: number }> = {};
    ALL_MTR_LOCATIONS.forEach((loc) => {
      const code = loc.code;
      const rep = reportsByDepot[code];
      if (rep && Array.isArray(rep.items)) {
        const filled = rep.items.filter((item) => item.pmWo && item.pmWo.trim() !== '').length;
        stats[code] = { filled, total: rep.items.length };
      } else {
        stats[code] = { filled: 0, total: 0 };
      }
    });
    return stats;
  }, [reportsByDepot]);

  // Auto-save active depot
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_DEPOT, currentDepot);
    } catch (err) {
      console.error('Failed to save active depot', err);
    }
  }, [currentDepot]);

  // Auto-save reportsByDepot map
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS_MAP, JSON.stringify(reportsByDepot));
      setLastSavedTime(new Date().toISOString());
    } catch (err) {
      console.error('Failed to save reportsByDepot to localStorage', err);
    }
  }, [reportsByDepot]);

  // Save fine-tune settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINETUNE, JSON.stringify(fineTuneSettings));
    } catch (err) {
      console.error('Failed to save fine-tune settings', err);
    }
  }, [fineTuneSettings]);

  // Save archives
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARCHIVES, JSON.stringify(archives));
    } catch (err) {
      console.error('Failed to save archives', err);
    }
  }, [archives]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleDataParsedFromExcel = (
    parsedData: any,
    fileName: string
  ) => {
    const targetCode = (parsedData.detectedLocation || parsedData.depotCode || currentDepot).toUpperCase();

    // Ensure all items strictly respect user's rules:
    // QTY = '1', Station = targetCode
    const finalItems: MaintenanceItem[] = Array.isArray(parsedData.items)
      ? (parsedData.items as MaintenanceItem[]).map((it, idx) => ({
          ...it,
          id: it.id || `item-${idx + 1}`,
          station: targetCode,
          qty: '1', // QTY=1 forever
        }))
      : [];

    setReportsByDepot((prev) => {
      const nextMap = { ...prev };
      const currentForTarget = nextMap[targetCode] || createEmptyReport(targetCode);
      nextMap[targetCode] = {
        ...currentForTarget,
        ...parsedData,
        depotCode: targetCode,
        depotTitle: parsedData.depotTitle || getLocationTitle(targetCode),
        reportMonthYear: parsedData.reportMonthYear || parsedData.detectedMonthYear || currentForTarget.reportMonthYear || 'September - 2026',
        contractNo: parsedData.contractNo || currentForTarget.contractNo || 'M1202-19E',
        items: finalItems, // ONLY items from the uploaded Excel!
        overallTotals: parsedData.overallTotals || {
          pmWoTotal: '',
          qtyTotal: String(finalItems.length),
          mTotal: String(finalItems.filter((i) => i.m && i.m.trim() !== '').length || (finalItems.length ? '100%' : '')),
          m2Total: '',
          m3Total: '',
          m4Total: '',
          m6Total: '',
          yTotal: '',
          m18Total: '',
          y2Total: '',
          y3Total: '',
        },
        signatories: {
          ...currentForTarget.signatories,
          ...(parsedData.signatories || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      // Also merge any other stations found in the imported file
      if (parsedData.reportsByStationMap) {
        Object.entries(parsedData.reportsByStationMap).forEach(([stnCode, stnReport]: [string, any]) => {
          if (!stnReport || !stnReport.items || stnCode === targetCode) return;
          const curr = nextMap[stnCode] || createEmptyReport(stnCode);
          nextMap[stnCode] = {
            ...curr,
            ...stnReport,
            depotCode: stnCode,
            depotTitle: stnReport.depotTitle || getLocationTitle(stnCode),
            reportMonthYear: stnReport.reportMonthYear || parsedData.reportMonthYear || 'September - 2026',
            contractNo: stnReport.contractNo || 'M1202-19E',
            items: (stnReport.items as MaintenanceItem[]).map((it, idx) => ({
              ...it,
              id: it.id || `item-${stnCode}-${idx + 1}`,
              station: stnCode,
              qty: '1',
            })),
            updatedAt: new Date().toISOString(),
          };
        });
      }

      return nextMap;
    });

    if (targetCode !== currentDepot) {
      setCurrentDepot(targetCode);
    }

    showToast(`成功匯入 ${fileName} (站點: ${targetCode})`);
  };

  const handleSaveToArchive = () => {
    const newRecord: ArchiveRecord = {
      id: `archive-${Date.now()}`,
      reportData: { ...reportData },
      fineTuneSettings: { ...fineTuneSettings },
      archivedAt: new Date().toISOString(),
      notes: `${reportData.depotTitle} (${reportData.reportMonthYear}) - ${reportData.items.length} 項目`,
    };

    setArchives([newRecord, ...archives]);
    showToast(`已歸檔「${reportData.depotTitle} (${reportData.reportMonthYear})」！`);
  };

  const handleLoadArchive = (record: ArchiveRecord) => {
    if (record.reportData.depotCode) {
      setCurrentDepot(record.reportData.depotCode);
    }
    setReportData(record.reportData);
    if (record.fineTuneSettings) {
      setFineTuneSettings(record.fineTuneSettings);
    }
    showToast(`已載入歸檔紀錄「${record.reportData.depotTitle}」！`);
  };

  const handleDeleteArchive = (id: string) => {
    if (window.confirm('確定要刪除這筆歸檔歷史紀錄嗎？')) {
      setArchives(archives.filter((a) => a.id !== id));
      showToast('已刪除歸檔紀錄');
    }
  };

  const handleClearAllArchives = () => {
    if (window.confirm('確定要清空所有已歸檔的歷史報告嗎？此動作不可撤銷。')) {
      setArchives([]);
      showToast('已清空所有歷史歸檔紀錄');
    }
  };

  const handleExportPdf = async () => {
    showToast('正在產生並下載 A4 PDF 報告...');
    try {
      const fileName = `MTR_PM_Report_${reportData.depotCode}_${reportData.reportMonthYear.replace(/\s+/g, '_')}.pdf`;
      await exportToPdf('pdf-report-canvas', fileName, 'landscape');
      showToast('PDF 報告下載完成！');
    } catch (err) {
      console.error(err);
      showToast('切換為列印輸出模式');
      window.print();
    }
  };

  const handleLoadSampleLak = () => {
    if (
      window.confirm(
        '是否載入 LAK (荔景站) 的示範保養工程數據？\n（包含冷卻機、通風機等設備的標準工單編號與週期數據）'
      )
    ) {
      const sample = createLAKReport();
      setReportData(sample);
      showToast('已載入 LAK 示範數據！');
    }
  };

  const handleResetDefaultPdf = () => {
    const loc = getLocationByCode(currentDepot);
    const locName = loc ? `${loc.nameZh} (${loc.code})` : currentDepot;

    if (
      window.confirm(
        `確定要清空目前「${locName}」的表格資料嗎？\n（將清空所有設備項目與已填寫內容）`
      )
    ) {
      const freshReport = createEmptyReport(currentDepot);
      setReportData(freshReport);
      setFineTuneSettings(JSON.parse(JSON.stringify(defaultFineTuneSettings)));
      showToast(`已清空「${currentDepot}」表格資料！`);
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        '⚠️ 警告：確定要清空所有資料嗎？(CLEAR ALL DATA)\n\n此操作將會：\n1. 清空所有 20 個車站/車廠已填寫的設備與工單資料\n2. 重置為完全空白的初始表格\n3. 重置所有版面微調參數\n\n此操作無法撤銷，是否確定執行？'
      )
    ) {
      try {
        localStorage.removeItem(STORAGE_KEY_REPORTS_MAP);
        localStorage.removeItem('mtr_pm_reports_empty_v1');
        localStorage.removeItem('mtr_pm_reports_by_depot_v6');
        localStorage.removeItem('mtr_pm_reports_by_depot_v5');
        localStorage.removeItem('mtr_pm_reports_by_depot_v4');
        localStorage.removeItem('mtr_pm_reports_by_depot_v3');
        localStorage.removeItem(STORAGE_KEY_FINETUNE);
        localStorage.removeItem(STORAGE_KEY_ACTIVE_DEPOT);
      } catch (e) {
        console.error('Failed to clear storage', e);
      }

      const freshMap: Record<string, MaintenanceReportData> = {};
      ALL_MTR_LOCATIONS.forEach((loc) => {
        freshMap[loc.code] = createEmptyReport(loc.code);
      });

      setReportsByDepot(freshMap);
      setCurrentDepot('LAK');
      setFineTuneSettings(JSON.parse(JSON.stringify(defaultFineTuneSettings)));
      showToast('已成功清空所有站點資料！');
    }
  };

  const handlePrint = () => {
    printDocument('pdf-report-canvas');
  };

  const handleSelectRegion = (code: string, newTitle: string) => {
    const targetCode = code.toUpperCase();
    setCurrentDepot(targetCode);

    setReportsByDepot((prev) => {
      if (!prev[targetCode]) {
        return {
          ...prev,
          [targetCode]: createDefaultReport(targetCode),
        };
      }
      return prev;
    });

    showToast(`已切換至 ${targetCode} 分頁 (${newTitle})`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-slate-900 text-white px-3.5 py-2 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navbar: Simplified to Upload Excel, Export PDF, and clean More dropdown */}
      <HeaderNavbar
        onUploadExcelClick={() => setIsExcelUploadOpen(true)}
        onResetDefaultPdfClick={handleResetDefaultPdf}
        onClearAllDataClick={handleClearAllData}
        onLoadSampleClick={handleLoadSampleLak}
        onSaveToArchiveClick={handleSaveToArchive}
        onOpenArchiveHistoryClick={() => setIsArchiveHistoryOpen(true)}
        onExportPdfClick={handleExportPdf}
        onPrintClick={handlePrint}
        onOpenHelpClick={() => setIsHelpOpen(true)}
        onOpenPptClick={() => setIsPptOpen(true)}
        lastSavedTime={lastSavedTime}
        archiveCount={archives.length}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-[1650px] w-full mx-auto p-3 sm:p-5 space-y-3">
        {/* Single Streamlined Control Bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
          {/* Left: Station Quick Selector & Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">選擇站點:</span>
              <select
                value={currentDepot}
                onChange={(e) => {
                  const code = e.target.value;
                  const loc = getLocationByCode(code);
                  handleSelectRegion(code, loc?.title || `MTRC Station - ${code}`);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer"
              >
                <optgroup label={`選擇站點 (${MTR_STATIONS_LIST.length})`}>
                  {MTR_STATIONS_LIST.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      {loc.code} - {loc.nameZh} ({loc.nameEn})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={`車廠 (${MTR_DEPOTS_LIST.length})`}>
                  {MTR_DEPOTS_LIST.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      {loc.code} - {loc.nameZh} ({loc.nameEn})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Station details & Quick Read Actions */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-300">‧</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {currentLocationInfo?.line || '港鐵'}
              </span>
              <span className="text-[11px] font-mono text-slate-600">
                PM W/O 已填: <strong className="text-emerald-700 font-bold">{woStats[currentDepot]?.filled || 0}</strong> / {woStats[currentDepot]?.total || 0}
              </span>

              <span className="text-slate-300">‧</span>

              {/* Direct Paste & Upload shortcuts for fast input */}
              <button
                type="button"
                onClick={handleOpenPasteModal}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                title="直接貼上複製的表格或 Maximo 工單數據"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-emerald-600" />
                <span>貼上資料 (Paste)</span>
              </button>

              <button
                type="button"
                onClick={handleOpenUploadModal}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                title="上傳 Excel 檔案自動識別"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                <span>上傳 Excel</span>
              </button>
            </div>
          </div>

          {/* Right: Reset, Clear All Data, Fine-Tune Toggle & Meta info */}
          <div className="flex items-center gap-2">
            <span className="hidden xl:inline text-xs text-slate-500 font-mono mr-1">
              {reportData.reportMonthYear} ‧ {reportData.items.length} 項
            </span>

            {/* Clear Current Station Button */}
            <button
              type="button"
              onClick={handleResetDefaultPdf}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="清空目前選取站點的所有資料 (Clear Current Station)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>清空本站 (Clear Station)</span>
            </button>

            {/* Clear All Data Button */}
            <button
              type="button"
              onClick={handleClearAllData}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="清空所有 20 個車站及車廠的資料，還原為初始狀態 (Clear All Data)"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>清空全部資料 (Clear All)</span>
            </button>

            {/* Fine-Tune Toggle */}
            <button
              type="button"
              onClick={() => setIsFineTuneOpen(!isFineTuneOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
                isFineTuneOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="調整 PDF 字體大小、邊距與欄寬"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>{isFineTuneOpen ? '關閉微調' : '微調排版'}</span>
            </button>
          </div>
        </div>

        {/* Full-Width Live Editable PDF Preview Sheet */}
        <div className="w-full relative">
          <ReportPDFPreview
            reportData={reportData}
            fineTuneSettings={fineTuneSettings}
            onUpdateReportData={setReportData}
            isEditingEnabled={true}
          />
        </div>
      </main>

      {/* Bottom Fine-Tuning Drawer Panel */}
      <FineTunePanel
        settings={fineTuneSettings}
        onChangeSettings={setFineTuneSettings}
        isOpen={isFineTuneOpen}
        onToggleOpen={() => setIsFineTuneOpen(!isFineTuneOpen)}
      />

      {/* Clean Modals */}
      <ExcelUploadModal
        isOpen={isExcelUploadOpen}
        onClose={() => setIsExcelUploadOpen(false)}
        onDataParsed={handleDataParsedFromExcel}
        currentDepotCode={reportData.depotCode}
        existingItems={reportData.items}
        defaultTab={uploadModalTab}
      />

      <ArchiveHistoryModal
        isOpen={isArchiveHistoryOpen}
        onClose={() => setIsArchiveHistoryOpen(false)}
        archives={archives}
        onLoadArchive={handleLoadArchive}
        onDeleteArchive={handleDeleteArchive}
        onClearAllArchives={handleClearAllArchives}
      />

      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <PPTModal
        isOpen={isPptOpen}
        onClose={() => setIsPptOpen(false)}
      />
    </div>
  );
}
