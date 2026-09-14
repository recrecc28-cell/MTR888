import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Train,
  CheckCircle2,
  FileSpreadsheet,
  FileDown,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  Layout,
  Copy,
  Check,
  Presentation,
  Download,
  PenTool,
  Layers,
} from 'lucide-react';
import { exportPresentationPptx } from '../utils/pptxExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PPTModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPptx = () => {
    setIsDownloading(true);
    try {
      exportPresentationPptx();
    } catch (err) {
      console.error('Download PPT error:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const slides = [
    // Slide 1: Cover
    {
      id: 1,
      title: '港鐵保養工程報告自動化系統',
      subtitle: 'MTR Depot PM Performance Report Automation System',
      category: '系統簡報 Presentation',
      type: 'cover',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 ring-8 ring-red-100">
            <Train className="w-10 h-10" />
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-3 tracking-wide">
            MTR ENGINEERING DIGITALIZATION
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            港鐵保養工程報告自動化系統
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-6 leading-relaxed">
            智慧解析 Excel 保養清單 ‧ 工單自動對應 ‧ 即時雙向微調 ‧ A4 高清 PDF 一鍵導出
          </p>

          <div className="flex items-center gap-3 mb-8">
            <button
              type="button"
              onClick={handleDownloadPptx}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? '正在製作 PPT 檔案...' : '下載簡報檔 (.pptx)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-slate-200 text-sm text-slate-500 font-medium">
            <div>簡報對象：港鐵工程保養團隊</div>
            <div>•</div>
            <div>發布日期：2026 年 8 月</div>
          </div>
        </div>
      ),
    },

    // Slide 2: Pain Points & Background
    {
      id: 2,
      title: '一、背景與作業痛點',
      subtitle: 'Why We Need Automation',
      category: '問題分析 Background',
      type: 'standard',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center">
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-6 flex flex-col h-full justify-between">
            <div>
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">手動對照繁瑣耗時</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Maximo 導出的 Excel 保養工單數量龐大（包含多個車廠如 SHD、TWD、KBD 等），手動尋找並複製工單編號 (WO_WONUM) 耗費大量人工時間。
              </p>
            </div>
            <div className="text-xs text-red-700 font-semibold bg-red-100/60 p-2 rounded mt-4">
              ⚠️ 痛點：耗時約 2 小時/月
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-6 flex flex-col h-full justify-between">
            <div>
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">設備簡稱多變易出錯</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                不同車廠與設備名稱縮寫不一（如 CWP, METCHW, MCP, AHU, CDU, PU），人工匹配容易漏填或對錯欄位。
              </p>
            </div>
            <div className="text-xs text-amber-800 font-semibold bg-amber-100/60 p-2 rounded mt-4">
              ⚠️ 痛點：人工比對遺漏率高
            </div>
          </div>

          <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-6 flex flex-col h-full justify-between">
            <div>
              <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">PDF 排版與微調不便</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                報告須符合標準 A4 橫向格式，傳統 Word/Excel 轉檔常遇到換行折疊、頁面超出或無法多工單呈現等問題。
              </p>
            </div>
            <div className="text-xs text-slate-700 font-semibold bg-slate-200/60 p-2 rounded mt-4">
              ⚠️ 痛點：格式不符規範
            </div>
          </div>
        </div>
      ),
    },

    // Slide 3: Core Capabilities
    {
      id: 3,
      title: '二、系統核心功能亮點',
      subtitle: 'Key Features & Capabilities',
      category: '功能亮點 Core Features',
      type: 'standard',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-center">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">1. Excel 全工作表解析與分頁自選</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                支援上傳含多工作表的 Excel，可自選單一工作表或「全部工作表 (All Sheets)」，系統自動識別 20 個車站/車廠並同步分流填入。
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 bg-sky-100 text-sky-700 rounded-lg shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">2. WORK DESCRIPTION 自動整齊與全大寫規範</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                工作描述文字自動整齊排版，英文字母全面自動轉為標準大寫 (ALL CAPS)，並自動套用港鐵專用字典（如 <code className="text-sky-700 bg-sky-50 px-1 rounded">ACC</code> 轉為 <code className="text-emerald-700 bg-emerald-50 px-1 rounded">AIR-COOLED CHILLER</code>），無須人工二次排版。
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">3. 每個 REPORT 列印嚴格自動縮成一頁 A4 比例</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                系統根據設備子列數量自動動態計算行距與文字尺寸，鎖定 198mm 限高，無論資料多寡均自動最適化縮成精準一頁 A4 比例，徹底告別跨頁與截斷問題。
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">4. 線上電子手簽與印章上傳 (多重簽核)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prepared By、Verified By、Endorsed By 完整支援平滑手寫簽名與圖檔印章上傳，並具備「一鍵同步至全線 20 個站點」功能，大幅節省簽核時間。
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">5. 選擇站點「全部站點」線上即時預覽與直接列印</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                站點選單首項提供「全部站點」，上傳 Excel 後自動轉為所有站點內容（一頁一站），使用者可直接在畫面上垂直滾動預覽所有站點並直接列印輸出。
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: Operation Workflow
    {
      id: 4,
      title: '三、標準操作流程 (Workflow)',
      subtitle: 'Simple 4-Step Process',
      category: '操作步驟 Workflow',
      type: 'standard',
      content: (
        <div className="flex flex-col justify-center h-full gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                  1
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">選擇站點或「全部站點」</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  可選擇單一站點（如 LAK、SHD），或選擇首個「全部站點 (一頁一站)」總覽模式。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-red-600 font-medium">
                Step 01
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                  2
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">上傳 Excel 自動轉成各站</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  拖曳上傳 Excel，系統智慧解析各車站資料，自動將所有站點轉成一站一頁內容。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-600 font-medium">
                Step 02
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                  3
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">頁面預覽、全大寫與簽署</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  在頁面上即時預覽每站內容，文字自動整齊全大寫，並在下方手寫或上傳簽核樣式。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-sky-600 font-medium">
                Step 03
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                  4
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">直接列印或匯出 PDF</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  直接點擊「列印畫面」或「匯出全部」，每個 REPORT 自動縮成一頁 A4 比例輸出。
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-purple-600 font-medium">
                Step 04
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>介面精簡升級：整合單一「清空資料 (Clear Data)」按鈕，微調面板俐落收納，操作流暢無冗餘</span>
            </div>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold">
              極簡高效
            </span>
          </div>
        </div>
      ),
    },

    // Slide 5: Matching Rules & Tech
    {
      id: 5,
      title: '四、規則引擎與工作描述標準化規範',
      subtitle: 'Smart Matching & Work Description Normalization',
      category: '規則引擎 Algorithm',
      type: 'standard',
      content: (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 h-full flex flex-col justify-between font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Equipment Normalization & Regex Rules</span>
            </div>
            <span className="text-slate-400 text-[11px]">excelHelper.ts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs overflow-y-auto">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">
                // 1. WORK DESCRIPTION 整齊排版與全大寫規範
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                • <code className="text-amber-300">英文自動全部大寫 (ALL CAPS)</code>：無論 Excel 原稿大小寫如何混雜，系統一律自動規範為全大寫。<br />
                • <code className="text-amber-300">整齊排版</code>：自動清除首尾多餘標點空格，統一詞彙間距，工單報表美觀一致。
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">
                // 2. 嚴格一頁 A4 比例縮放算法 (Single-Page Fitting)
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                • <code className="text-sky-300">限高鎖定 198mm</code>：針對每站設備多子列數量動態計算每列高度與邊距。<br />
                • <code className="text-sky-300">列印與匯出保證一頁一站</code>：杜絕任何換行溢出、文字跨頁截斷問題。
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">
                // 3. 專用詞彙標準化 (Chiller & Fire Damper)
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                • <code className="text-rose-300">ACC</code> ➔ <code className="text-emerald-300 font-bold">AIR-COOLED CHILLER</code><br />
                • <code className="text-rose-300">MR TPB ECS-Electro-thermal linked fire damper</code><br />
                &nbsp;&nbsp;➔ <code className="text-emerald-300 font-bold">thermal linked fire damper</code>
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">// 4. 設備精確比對關鍵字</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                • 水泵風櫃：<code className="text-emerald-300">CWP, CHP, MUP, MWP, ECS-AHU</code><br />
                • 控制電櫃：<code className="text-emerald-300">MOTOR CONTROL PANEL, MCC-MCP, CDU</code>
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>支援同一設備自動填入多筆 PM W/O（獨立換行呈現），字體比例自動最適化</span>
            <span className="text-emerald-400 font-semibold">100% 格式規範保障</span>
          </div>
        </div>
      ),
    },

    // Slide 6: Digital Signature & Batch Export
    {
      id: 6,
      title: '五、多重電子簽章與全站點預覽列印',
      subtitle: 'Digital Signature & All Stations Online Preview & Print',
      category: '數位簽核與預覽 Signature & All Stations Preview',
      type: 'standard',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full items-center">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base mb-3">
                <PenTool className="w-5 h-5" />
                <span>Prepared / Verified / Endorsed 電子簽名</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>觸控手寫簽署：</strong>內建平滑 Canvas 手寫板，支援自選線條粗細 (細/中/粗) 與筆觸顏色。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>圖檔印章上傳：</strong>支援 PNG/JPG 簽名檔或工程透明職章直接上傳套入。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>一鍵同步全線：</strong>勾選「同步套用至全線 20 個車站/車廠」，只需簽名一次即刻套用全線。</span>
                </li>
              </ul>
            </div>
            <div className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 mt-3">
              ✨ 簽名直接精準嵌入報告三欄簽核格中，未簽署時保持空白便於列印後手簽。
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-purple-600 font-bold text-base mb-3">
                <Layers className="w-5 h-5" />
                <span>「全部站點」線上即時預覽與直接列印 (一頁一站)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>線上捲動全站預覽：</strong>上傳 Excel 後自動轉成所有站點，在主畫面一次向下預覽所有站點報表。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>直接列印畫面：</strong>支援點擊「列印畫面」直接呼叫系統列印，嚴格分頁每站自動縮成一頁 A4 橫向。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>一鍵批次匯出 PDF：</strong>全線 20 個站點 30 秒內自動編譯為單一高品質多頁合輯 PDF。</span>
                </li>
              </ul>
            </div>
            <div className="text-[11px] text-purple-700 bg-purple-50 border border-purple-200 rounded-lg p-2.5 mt-3">
              📑 檔名自動格式化：<code>MTR_PM_Reports_All_Stations_2026.pdf</code>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Expected Impact & Value
    {
      id: 7,
      title: '六、效益與管理價值',
      subtitle: 'Quantifiable Benefits & ROI',
      category: '實質效益 Benefits',
      type: 'standard',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">時間成本降低 95%</h4>
                <p className="text-xs text-slate-600">從原本每份報告 120 分鐘縮短至 1 分鐘內即可生成完成。</p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">人工錯填率歸零</h4>
                <p className="text-xs text-slate-600">程式精準邏輯比對，防止遺漏工單編號或放錯設備類別。</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center shrink-0">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">標準化格式統一管理</h4>
                <p className="text-xs text-slate-600">確保 SHD、TWD 等所有車廠產出的 PDF 報告樣式一致，便於審核。</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">完整雲端與歷史紀錄</h4>
                <p className="text-xs text-slate-600">支援月保養紀錄自動歸檔與歷史版本隨時調閱下載。</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 8: Conclusion
    {
      id: 8,
      title: '七、結語與 Q&A',
      subtitle: 'Conclusion & Next Steps',
      category: '結語 Summary',
      type: 'conclusion',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <Presentation className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            推進港鐵工程保養數位化升級
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mb-6">
            本自動化系統旨在提昇團隊工作效率，歡迎同仁於日常保養作業中積極使用與提出建議！
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPptx}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? '正在下載...' : '下載簡報檔 (.pptx)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>開始體驗系統</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const copyOutline = () => {
    const outlineText = slides
      .map(
        (s) =>
          `【${s.title}】\n${s.subtitle}\n`
      )
      .join('\n');
    navigator.clipboard.writeText(outlineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 no-print">
      <div
        className={`bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[85vh] max-h-[720px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                系統介紹簡報 (PPT)
              </h3>
              <p className="text-[11px] text-slate-500">
                港鐵保養工程報告自動化系統 ‧ 簡報模式
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPptx}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-xs"
              title="下載簡報檔 (.pptx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? '下載中...' : '下載 PPT (.pptx)'}</span>
            </button>

            <button
              type="button"
              onClick={copyOutline}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition-colors"
              title="複製簡報大綱文字"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製大綱' : '複製大綱'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors"
              title={isFullscreen ? '退出全螢幕' : '全螢幕播放'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-2"
              title="關閉簡報"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Slide Body Canvas */}
        <div className="flex-1 bg-slate-100/60 p-6 md:p-10 flex flex-col justify-center overflow-y-auto relative">
          {/* Active Slide Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg p-6 md:p-8 min-h-[420px] h-full flex flex-col justify-between max-w-4xl mx-auto w-full relative">
            {/* Slide Header Category tag */}
            {slide.type !== 'cover' && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                    {slide.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{slide.title}</h2>
                  <p className="text-xs text-slate-400">{slide.subtitle}</p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-400">
                  SLIDE {currentSlide + 1} / {slides.length}
                </div>
              </div>
            )}

            {/* Slide Content Slot */}
            <div className="flex-1 my-auto">{slide.content}</div>

            {/* Slide Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-red-600" />
                港鐵保養工程報告自動化系統 MTR PM Report System
              </span>
              <span>頁碼：{currentSlide + 1}</span>
            </div>
          </div>
        </div>

        {/* Bottom Slide Controller */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between rounded-b-2xl">
          {/* Thumbnails dots/selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  idx === currentSlide
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                P.{idx + 1}
              </button>
            ))}
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一頁</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 font-mono px-2">
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-lg shadow-xs transition-colors"
            >
              <span>下一頁</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
