import React, { useState, useMemo } from 'react';
import {
  Check,
  Train,
  Search,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ALL_MTR_LOCATIONS,
  MTR_STATIONS_LIST,
  MTR_DEPOTS_LIST,
  MTRLocation,
} from '../data/mtrLocations';

export interface RegionOption {
  code: string;
  name: string;
  title: string;
  description: string;
}

export const REGIONS: RegionOption[] = ALL_MTR_LOCATIONS.map((loc) => ({
  code: loc.code,
  name: `${loc.nameZh} (${loc.code})`,
  title: loc.title,
  description: loc.description,
}));

interface Props {
  currentDepotCode: string;
  currentDepotTitle: string;
  onSelectRegion: (code: string, title: string) => void;
  woStats?: Record<string, { filled: number; total: number }>;
  onClose?: () => void;
}

export const RegionSelector: React.FC<Props> = ({
  currentDepotCode,
  currentDepotTitle,
  onSelectRegion,
  woStats,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'imported' | 'station' | 'depot'>('all');

  const importedLocationsCount = useMemo(() => {
    return ALL_MTR_LOCATIONS.filter((loc) => (woStats?.[loc.code]?.total || 0) > 0).length;
  }, [woStats]);

  const filteredLocations = useMemo(() => {
    let list: MTRLocation[] = ALL_MTR_LOCATIONS;
    if (activeTab === 'imported') {
      list = ALL_MTR_LOCATIONS.filter((loc) => (woStats?.[loc.code]?.total || 0) > 0);
    } else if (activeTab === 'station') {
      list = MTR_STATIONS_LIST;
    } else if (activeTab === 'depot') {
      list = MTR_DEPOTS_LIST;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (loc) =>
        loc.code.toLowerCase().includes(q) ||
        loc.nameZh.toLowerCase().includes(q) ||
        loc.nameEn.toLowerCase().includes(q) ||
        loc.line.toLowerCase().includes(q) ||
        loc.title.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery, woStats]);

  const totalLocationsCount = ALL_MTR_LOCATIONS.length;
  const stationCount = MTR_STATIONS_LIST.length;
  const depotCount = MTR_DEPOTS_LIST.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5 no-print">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <Train className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-800">
            選擇站點 / 車廠 ({totalLocationsCount})
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="隱藏站點清單"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px]">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1 px-1.5 rounded font-medium text-center transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          全部 ({totalLocationsCount})
        </button>
        {importedLocationsCount > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('imported')}
            className={`flex-1 py-1 px-1.5 rounded font-medium text-center transition-all cursor-pointer ${
              activeTab === 'imported'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            已導入 ({importedLocationsCount})
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('station')}
          className={`flex-1 py-1 px-1.5 rounded font-medium text-center transition-all cursor-pointer ${
            activeTab === 'station'
              ? 'bg-white text-emerald-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          車站 ({stationCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('depot')}
          className={`flex-1 py-1 px-1.5 rounded font-medium text-center transition-all cursor-pointer ${
            activeTab === 'depot'
              ? 'bg-white text-emerald-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          車廠 ({depotCount})
        </button>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜尋站名或代號 (如 AIR, HOK)..."
          className="w-full pl-8 pr-7 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Scrollable Station List */}
      <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin scrollbar-thumb-slate-200">
        {filteredLocations.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            找不到符合「{searchQuery}」的站點
          </div>
        ) : (
          filteredLocations.map((loc) => {
            const isSelected = currentDepotCode.toUpperCase() === loc.code.toUpperCase();
            const stat = woStats ? woStats[loc.code] : undefined;
            const isDepot = loc.type === 'depot';

            return (
              <button
                key={loc.code}
                type="button"
                onClick={() => onSelectRegion(loc.code, loc.title)}
                className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs ring-1 ring-emerald-500/30'
                    : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : isDepot
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {loc.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {loc.nameZh}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white shrink-0">
                      <Check className="w-2.5 h-2.5" />
                      目前
                    </span>
                  ) : stat && stat.filled > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-600 font-bold shrink-0">
                      {stat.filled}/{stat.total}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="truncate pr-1 text-slate-500">{loc.nameEn}</span>
                  <span className="shrink-0 text-[9px] bg-slate-200/60 px-1 py-0.2 rounded text-slate-500">
                    {loc.line}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
