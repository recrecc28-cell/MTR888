import React, { useState } from 'react';
import { FineTuneSettings } from '../types';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sliders,
  Type,
  LayoutGrid,
  Move,
  Columns,
  Palette,
  Eye,
  EyeOff,
} from 'lucide-react';
import { defaultFineTuneSettings } from '../data/defaultReport';

interface Props {
  settings: FineTuneSettings;
  onChangeSettings: (newSettings: FineTuneSettings) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const FineTunePanel: React.FC<Props> = ({
  settings,
  onChangeSettings,
  isOpen,
  onToggleOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'font' | 'spacing' | 'offset' | 'column' | 'style'>('font');

  const updateSetting = <K extends keyof FineTuneSettings>(
    key: K,
    value: FineTuneSettings[K]
  ) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleReset = () => {
    if (window.confirm('確定要恢復預設的 PDF 版面配置與微調設定嗎？')) {
      onChangeSettings(defaultFineTuneSettings);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 text-slate-900 shadow-2xl transition-all duration-300 no-print">
      {/* Header bar / Toggle handle */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleOpen}
            className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>PDF 畫面上位置與尺寸微調工具箱 (PDF Fine-Tuning Controls)</span>
            {isOpen ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronUp className="w-4 h-4 ml-1" />}
          </button>
          <span className="text-xs text-slate-500 hidden sm:inline">
            ({isOpen ? '可微調標題、字型、欄寬、間距與 X/Y 位移' : '點擊展開微調面板'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded border border-slate-300 transition-colors"
              title="重置位置與樣式設定"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢復預設位置</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleOpen}
            className="px-3 py-1 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white font-bold rounded shadow-xs transition-colors flex items-center gap-1"
          >
            {isOpen ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> 隱藏微調面板
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> 顯示微調面板
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Panel Content */}
      {isOpen && (
        <div className="p-3 sm:p-4 max-h-[280px] overflow-y-auto">
          {/* Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-1 pb-3 mb-3 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('font')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'font'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> 字型與大小 (Fonts)
            </button>

            <button
              onClick={() => setActiveTab('spacing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'spacing'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> 頁面與行距 (Padding)
            </button>

            <button
              onClick={() => setActiveTab('offset')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'offset'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Move className="w-3.5 h-3.5" /> X/Y 軸位置微調 (Offsets)
            </button>

            <button
              onClick={() => setActiveTab('column')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'column'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> 表格欄寬比例 (Col Widths)
            </button>

            <button
              onClick={() => setActiveTab('style')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'style'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> 邊框與視覺 (Borders)
            </button>
          </div>

          {/* TAB 1: Fonts */}
          {activeTab === 'font' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">廠組標題 (Header 1)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={14}
                    max={28}
                    value={settings.headerTitleSize}
                    onChange={(e) => updateSetting('headerTitleSize', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.headerTitleSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">月份標題 (Header 2)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={12}
                    max={24}
                    value={settings.headerSubTitleSize}
                    onChange={(e) => updateSetting('headerSubTitleSize', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.headerSubTitleSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">合約編號 (Contract No.)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={12}
                    max={22}
                    value={settings.contractNoSize}
                    onChange={(e) => updateSetting('contractNoSize', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.contractNoSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">表頭文字 (Table Header)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={9}
                    max={15}
                    value={settings.tableHeaderSize}
                    onChange={(e) => updateSetting('tableHeaderSize', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.tableHeaderSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">表格內容 (Table Cell)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={8}
                    max={14}
                    step={0.5}
                    value={settings.tableCellSize}
                    onChange={(e) => updateSetting('tableCellSize', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.tableCellSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">簽名處文字 (Signatures)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={9}
                    max={16}
                    value={settings.footerTextSize}
                    onChange={(e) => updateSetting('footerTextSize', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.footerTextSize}px</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Spacing & Padding */}
          {activeTab === 'spacing' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">上邊距 (Padding Top)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={settings.pagePaddingTop}
                    onChange={(e) => updateSetting('pagePaddingTop', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.pagePaddingTop}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">下邊距 (Padding Bottom)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={settings.pagePaddingBottom}
                    onChange={(e) => updateSetting('pagePaddingBottom', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.pagePaddingBottom}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">左邊距 (Padding Left)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={settings.pagePaddingLeft}
                    onChange={(e) => updateSetting('pagePaddingLeft', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.pagePaddingLeft}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">右邊距 (Padding Right)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={settings.pagePaddingRight}
                    onChange={(e) => updateSetting('pagePaddingRight', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.pagePaddingRight}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">表格行高 (Row Vertical Pad)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={0.5}
                    value={settings.tableRowPaddingY}
                    onChange={(e) => updateSetting('tableRowPaddingY', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.tableRowPaddingY}px</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Offsets */}
          {activeTab === 'offset' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">頁眉標題 X 偏移</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={settings.headerOffsetX}
                    onChange={(e) => updateSetting('headerOffsetX', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.headerOffsetX}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">頁眉標題 Y 偏移</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    value={settings.headerOffsetY}
                    onChange={(e) => updateSetting('headerOffsetY', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.headerOffsetY}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">表格區域 X 偏移</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={settings.tableOffsetX}
                    onChange={(e) => updateSetting('tableOffsetX', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.tableOffsetX}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">表格區域 Y 偏移</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    value={settings.tableOffsetY}
                    onChange={(e) => updateSetting('tableOffsetY', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.tableOffsetY}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">簽名欄區 X 偏移</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={settings.signatoryOffsetX}
                    onChange={(e) => updateSetting('signatoryOffsetX', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.signatoryOffsetX}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">簽名欄區 Y 偏移</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    value={settings.signatoryOffsetY}
                    onChange={(e) => updateSetting('signatoryOffsetY', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.signatoryOffsetY}px</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Column Widths */}
          {activeTab === 'column' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Station 車站欄寬 (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={4}
                      max={18}
                      value={settings.colWidthStation}
                      onChange={(e) => updateSetting('colWidthStation', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="w-8 font-mono text-amber-600">{settings.colWidthStation}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Work Description (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={20}
                      max={55}
                      value={settings.colWidthWorkDesc}
                      onChange={(e) => updateSetting('colWidthWorkDesc', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="w-8 font-mono text-amber-600">{settings.colWidthWorkDesc}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">PM W/O 工單號 (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={6}
                      max={25}
                      value={settings.colWidthPmWo}
                      onChange={(e) => updateSetting('colWidthPmWo', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="w-8 font-mono text-amber-600">{settings.colWidthPmWo}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">QTY 數量欄寬 (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={4}
                      max={18}
                      value={settings.colWidthQty}
                      onChange={(e) => updateSetting('colWidthQty', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <span className="w-8 font-mono text-amber-600">{settings.colWidthQty}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-amber-700 font-bold mb-1">TRADE / ECS 總欄寬 (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={25}
                      max={60}
                      value={settings.colWidthTradeGroup}
                      onChange={(e) => updateSetting('colWidthTradeGroup', Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <span className="w-8 font-mono text-amber-700 font-bold">{settings.colWidthTradeGroup}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                <span>
                  TRADE / ECS 組下包含 7 項週期 (M, 2M, 3M, 4M, 6M, Y, 2Y)，每單欄均分寬度為:{' '}
                  <strong className="text-amber-700 font-mono font-bold">
                    {(settings.colWidthTradeGroup / 7).toFixed(2)}%
                  </strong>{' '}
                  (足夠完整顯示 100% 及相關百分比數據)
                </span>
                <span className="font-mono">
                  欄寬總和: {settings.colWidthStation + settings.colWidthWorkDesc + settings.colWidthPmWo + settings.colWidthQty + settings.colWidthTradeGroup}%
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: Style & Borders */}
          {activeTab === 'style' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">表格網格線粗細 (px)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.5}
                    value={settings.tableBorderWidth}
                    onChange={(e) => updateSetting('tableBorderWidth', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="w-8 font-mono text-amber-600">{settings.tableBorderWidth}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">網格線顏色 (Border Color)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.tableBorderColor}
                    onChange={(e) => updateSetting('tableBorderColor', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-amber-600">{settings.tableBorderColor}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
