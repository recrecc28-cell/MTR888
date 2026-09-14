import React from 'react';
import { MaintenanceReportData, FineTuneSettings, MaintenanceItem, SubWoEntry } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  reportData: MaintenanceReportData;
  fineTuneSettings: FineTuneSettings;
  onUpdateReportData: (newData: MaintenanceReportData) => void;
  isEditingEnabled?: boolean;
}

export const ReportPDFPreview: React.FC<Props> = ({
  reportData,
  fineTuneSettings,
  onUpdateReportData,
  isEditingEnabled = true,
}) => {
  const { items, signatories } = reportData;

  // Helper to normalize sub-entries for each item
  const getSubEntries = (item: MaintenanceItem): SubWoEntry[] => {
    if (item.subEntries && item.subEntries.length > 0) {
      return item.subEntries;
    }
    const lines = (item.pmWo || '').split('\n').map((s) => s.trim()).filter(Boolean);
    if (lines.length > 1) {
      return lines.map((wo, idx) => ({
        id: `${item.id}-sub-${idx}`,
        pmWo: wo,
        m: idx === 0 ? item.m : '',
        m3: idx === 0 ? item.m3 : '',
        m4: idx === 0 ? item.m4 : '',
        m6: idx === 0 ? item.m6 : '',
        y: idx === 0 ? item.y : '',
        m18: idx === 0 ? (item.m18 || '') : '',
        y2: idx === 0 ? item.y2 : '',
        y3: idx === 0 ? (item.y3 || '') : '',
      }));
    }
    return [
      {
        id: `${item.id}-sub-0`,
        pmWo: item.pmWo || '',
        m: item.m || '',
        m3: item.m3 || '',
        m4: item.m4 || '',
        m6: item.m6 || '',
        y: item.y || '',
        m18: item.m18 || '',
        y2: item.y2 || '',
        y3: item.y3 || '',
      },
    ];
  };

  // Handle cell edit for top-level item attributes
  const handleItemChange = (id: string, field: keyof MaintenanceItem, value: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    onUpdateReportData({
      ...reportData,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle sub-entry edit (for specific WO and frequency column)
  const handleSubEntryChange = (
    itemId: string,
    subIndex: number,
    field: keyof SubWoEntry,
    value: string
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id !== itemId) return item;
      const subs = [...getSubEntries(item)];
      subs[subIndex] = { ...subs[subIndex], [field]: value };
      const pmWoJoined = subs.map((s) => s.pmWo).filter(Boolean).join('\n');
      return {
        ...item,
        subEntries: subs,
        pmWo: pmWoJoined || subs[0]?.pmWo || '',
      };
    });

    onUpdateReportData({
      ...reportData,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Add new equipment row (QTY=1 forever, station assigned)
  const handleAddRow = (index?: number) => {
    const targetStn = reportData.depotCode || 'LAK';
    const newItem: MaintenanceItem = {
      id: `item-${Date.now()}`,
      station: targetStn,
      workDescription: '',
      pmWo: '',
      qty: '1',
      m: '100%',
      m2: '',
      m3: '',
      m4: '',
      m6: '',
      y: '',
      m18: '',
      y2: '',
      y3: '',
      subEntries: [
        {
          id: `sub-${Date.now()}-1`,
          pmWo: '',
          m: '100%',
          m2: '',
          m3: '',
          m4: '',
          m6: '',
          y: '',
          m18: '',
          y2: '',
          y3: '',
        },
      ],
    };

    const newItems = [...items];
    if (typeof index === 'number') {
      newItems.splice(index + 1, 0, newItem);
    } else {
      newItems.push(newItem);
    }

    onUpdateReportData({
      ...reportData,
      items: newItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Add a sub work order line to an item (completely blank)
  const handleAddSubLine = (itemId: string) => {
    const updatedItems = items.map((item) => {
      if (item.id !== itemId) return item;
      const subs = [...getSubEntries(item)];
      subs.push({
        id: `sub-${Date.now()}`,
        pmWo: '',
        m: '',
        m3: '',
        m4: '',
        m6: '',
        y: '',
        m18: '',
        y2: '',
        y3: '',
      });
      return {
        ...item,
        subEntries: subs,
        pmWo: subs.map((s) => s.pmWo).filter(Boolean).join('\n'),
      };
    });

    onUpdateReportData({
      ...reportData,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    onUpdateReportData({
      ...reportData,
      items: newItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete sub line
  const handleDeleteSubLine = (itemId: string, subIndex: number) => {
    const updatedItems = items.map((item) => {
      if (item.id !== itemId) return item;
      const subs = getSubEntries(item).filter((_, idx) => idx !== subIndex);
      if (subs.length === 0) {
        subs.push({
          id: `sub-${Date.now()}`,
          pmWo: '',
          m: '',
          m3: '',
          m4: '',
          m6: '',
          y: '',
          m18: '',
          y2: '',
          y3: '',
        });
      }
      return {
        ...item,
        subEntries: subs,
        pmWo: subs.map((s) => s.pmWo).filter(Boolean).join('\n'),
      };
    });

    onUpdateReportData({
      ...reportData,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Dynamic styles based on FineTuneSettings
  const containerStyle: React.CSSProperties = {
    paddingTop: `${fineTuneSettings.pagePaddingTop}px`,
    paddingBottom: `${fineTuneSettings.pagePaddingBottom}px`,
    paddingLeft: `${fineTuneSettings.pagePaddingLeft}px`,
    paddingRight: `${fineTuneSettings.pagePaddingRight}px`,
    fontSize: `${fineTuneSettings.baseFontSize}px`,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '210mm',
  };

  const headerStyle: React.CSSProperties = {
    transform: `translate(${fineTuneSettings.headerOffsetX}px, ${fineTuneSettings.headerOffsetY}px)`,
  };

  const tableStyle: React.CSSProperties = {
    transform: `translate(${fineTuneSettings.tableOffsetX}px, ${fineTuneSettings.tableOffsetY}px)`,
    borderCollapse: 'collapse',
    width: '100%',
    borderColor: fineTuneSettings.tableBorderColor,
  };

  const borderStyle = {
    border: `${fineTuneSettings.tableBorderWidth}px solid ${fineTuneSettings.tableBorderColor}`,
  };

  const cellPaddingStyle: React.CSSProperties = {
    paddingTop: `${fineTuneSettings.tableRowPaddingY}px`,
    paddingBottom: `${fineTuneSettings.tableRowPaddingY}px`,
    paddingLeft: '4px',
    paddingRight: '4px',
    fontSize: `${fineTuneSettings.tableCellSize}px`,
    lineHeight: '1.25',
  };

  const signatoryStyle: React.CSSProperties = {
    transform: `translate(${fineTuneSettings.signatoryOffsetX}px, ${fineTuneSettings.signatoryOffsetY}px)`,
    fontSize: `${fineTuneSettings.footerTextSize}px`,
  };

  // Editable inline text component
  const EditableText = ({
    value,
    onChange,
    className = '',
    placeholder = '',
    style = {},
  }: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    style?: React.CSSProperties;
  }) => {
    if (!isEditingEnabled) {
      return (
        <span className={`whitespace-pre-line ${className}`} style={style}>
          {value || ''}
        </span>
      );
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-transparent outline-none focus:bg-amber-50 hover:bg-slate-50 transition-colors w-full ${className}`}
        style={{ color: 'inherit', font: 'inherit', ...style }}
      />
    );
  };

  // Pre-calculate sub-entries and group by station for vertical merging
  const stationGroups = React.useMemo(() => {
    const groups: {
      station: string;
      totalSubRows: number;
      itemsWithSubs: {
        item: MaintenanceItem;
        subs: SubWoEntry[];
      }[];
    }[] = [];

    let currentGroup: {
      station: string;
      totalSubRows: number;
      itemsWithSubs: { item: MaintenanceItem; subs: SubWoEntry[] }[];
    } | null = null;

    items.forEach((item) => {
      const subs = getSubEntries(item);
      const stn = item.station || reportData.depotCode || 'LAK';

      if (!currentGroup || currentGroup.station !== stn) {
        currentGroup = {
          station: stn,
          totalSubRows: subs.length,
          itemsWithSubs: [{ item, subs }],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.totalSubRows += subs.length;
        currentGroup.itemsWithSubs.push({ item, subs });
      }
    });

    return groups;
  }, [items, reportData.depotCode]);

  return (
    <div className="w-full flex justify-center bg-slate-100 p-2 sm:p-4 overflow-x-auto">
      {/* Paper Container matching screenshot proportions */}
      <div
        id="pdf-report-canvas"
        style={containerStyle}
        className="bg-white shadow-xl border border-slate-300 rounded-sm max-w-[1050px] transition-all relative select-text"
      >
        {/* Faint Center Watermark (authentic to document preview) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.05] text-8xl font-sans font-bold text-slate-800 z-0 tracking-widest">
          第 1 頁
        </div>

        {/* --- HEADER SECTION --- */}
        <div style={headerStyle} className="text-center mb-5 relative z-10">
          <div className="font-bold text-center tracking-wide" style={{ fontSize: `${fineTuneSettings.headerTitleSize}px` }}>
            <EditableText
              value={reportData.depotTitle}
              onChange={(val) => onUpdateReportData({ ...reportData, depotTitle: val })}
              className="text-center font-bold"
              placeholder="請輸入車站/車廠標題 (如 MTRC AEL / TCL - LAK)"
            />
          </div>

          <div className="font-bold text-center tracking-wide mt-1" style={{ fontSize: `${fineTuneSettings.headerSubTitleSize}px` }}>
            <span>PM PERPROMANCE BREAKDOWN in </span>
            <EditableText
              value={reportData.reportMonthYear}
              onChange={(val) => onUpdateReportData({ ...reportData, reportMonthYear: val })}
              className="inline-block font-bold w-auto border-b border-dashed border-gray-300"
              style={{ width: '150px' }}
              placeholder="月份年份"
            />
          </div>

          <div className="font-bold text-center tracking-wider mt-1" style={{ fontSize: `${fineTuneSettings.contractNoSize}px` }}>
            <span>Contract No.</span>
            <EditableText
              value={reportData.contractNo}
              onChange={(val) => onUpdateReportData({ ...reportData, contractNo: val })}
              className="inline-block font-bold w-auto border-b border-dashed border-gray-300 ml-1"
              style={{ width: '140px' }}
              placeholder="合約編號"
            />
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div style={tableStyle} className="mb-6 relative z-10">
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              {/* Row 1 Header */}
              <tr className="text-center font-bold" style={{ fontSize: `${fineTuneSettings.tableHeaderSize}px` }}>
                <th
                  style={{ ...borderStyle, width: '8%' }}
                  rowSpan={3}
                  className="px-1 py-1 text-center font-bold align-middle"
                >
                  STATION
                </th>
                <th
                  style={{ ...borderStyle, width: '28%' }}
                  rowSpan={3}
                  className="px-2 py-1 text-center font-bold align-middle"
                >
                  WORK DESCRIPTION
                </th>
                <th
                  style={{ ...borderStyle, width: '14%' }}
                  rowSpan={3}
                  className="px-1 py-1 text-center font-bold align-middle"
                >
                  PM W/O
                </th>
                <th
                  style={{ ...borderStyle, width: '5%' }}
                  rowSpan={3}
                  className="px-1 py-1 text-center font-bold align-middle"
                >
                  QTY
                </th>
                <th
                  style={{ ...borderStyle, width: '45%' }}
                  colSpan={8}
                  className="px-1 py-0.5 text-center font-bold align-middle uppercase"
                >
                  TRADE
                </th>
                {isEditingEnabled && <th className="no-print w-10 border-0 bg-transparent"></th>}
              </tr>

              {/* Row 2 Sub-Header: ECS */}
              <tr className="text-center font-bold" style={{ fontSize: `${fineTuneSettings.tableHeaderSize}px` }}>
                <th
                  style={{ ...borderStyle, width: '45%' }}
                  colSpan={8}
                  className="px-1 py-0.5 text-center font-bold align-middle uppercase"
                >
                  ECS
                </th>
                {isEditingEnabled && <th className="no-print w-10 border-0 bg-transparent"></th>}
              </tr>

              {/* Row 3 Sub-Headers for TRADE/ECS frequencies: M, 3M, 4M, 6M, Y, 18M, 2Y, 3Y */}
              <tr className="text-center font-bold" style={{ fontSize: `${fineTuneSettings.tableHeaderSize}px` }}>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">M</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">3M</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">4M</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">6M</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">Y</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">18M</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">2Y</th>
                <th style={{ ...borderStyle, width: '5.625%' }} className="py-1 px-0.5 text-center whitespace-nowrap">3Y</th>
                {isEditingEnabled && <th className="no-print w-10 border-0 bg-transparent"></th>}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={isEditingEnabled ? 13 : 12}
                    style={{ ...borderStyle, padding: '28px 16px' }}
                    className="text-center text-slate-400 bg-slate-50/40"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 py-3">
                      <span className="text-xs font-medium text-slate-500">
                        （目前尚無資料，請點擊下方按鈕或匯入資料）
                      </span>
                      {isEditingEnabled && (
                        <button
                          type="button"
                          onClick={() => handleAddRow()}
                          className="mt-1.5 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          + 新增第一行設備項目 (Add Equipment Row)
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                stationGroups.map((stnGroup) => (
                  <React.Fragment key={`station-${stnGroup.station}`}>
                  {stnGroup.itemsWithSubs.map((itemObj, itemIndex) => {
                    const { item, subs } = itemObj;
                    const isFirstItemOfStation = itemIndex === 0;

                    // Work description grouping logic: if mergeWorkDescription is true, merge consecutive rows with identical description
                    const shouldMergeDesc = fineTuneSettings.mergeWorkDescription ?? true;
                    let isFirstOfDescGroup = true;
                    let descGroupRowSpan = subs.length;

                    if (shouldMergeDesc) {
                      const currentDesc = (item.workDescription || '').trim();
                      if (
                        itemIndex > 0 &&
                        (stnGroup.itemsWithSubs[itemIndex - 1].item.workDescription || '').trim() === currentDesc &&
                        currentDesc !== ''
                      ) {
                        isFirstOfDescGroup = false;
                      } else if (currentDesc !== '') {
                        for (let j = itemIndex + 1; j < stnGroup.itemsWithSubs.length; j++) {
                          if ((stnGroup.itemsWithSubs[j].item.workDescription || '').trim() === currentDesc) {
                            descGroupRowSpan += stnGroup.itemsWithSubs[j].subs.length;
                          } else {
                            break;
                          }
                        }
                      }
                    }

                    return subs.map((sub, subIndex) => {
                      const isFirstSubOfItem = subIndex === 0;

                      return (
                        <tr
                          key={`${item.id}-sub-${subIndex}`}
                          className="hover:bg-amber-50/40 transition-colors group"
                        >
                          {/* STATION COLUMN: Vertically merged for all rows of this station */}
                          {isFirstItemOfStation && isFirstSubOfItem && (
                            <td
                              rowSpan={stnGroup.totalSubRows}
                              style={{ ...borderStyle, ...cellPaddingStyle }}
                              className="text-center align-middle uppercase font-sans font-bold"
                            >
                              <EditableText
                                value={item.station}
                                onChange={(val) => handleItemChange(item.id, 'station', val)}
                                className="text-center font-bold"
                              />
                            </td>
                          )}

                          {/* WORK DESCRIPTION: Vertically merged across matching equipment rows */}
                          {isFirstSubOfItem && isFirstOfDescGroup && (
                            <td
                              rowSpan={shouldMergeDesc ? descGroupRowSpan : subs.length}
                              style={{ ...borderStyle, ...cellPaddingStyle }}
                              className="align-middle pl-2 font-sans"
                            >
                              <EditableText
                                value={item.workDescription}
                                onChange={(val) => handleItemChange(item.id, 'workDescription', val)}
                                className="text-left font-normal"
                              />
                            </td>
                          )}

                          {/* PM W/O: Each work order number in its own sub row */}
                          <td
                            style={{ ...borderStyle, ...cellPaddingStyle }}
                            className="text-center align-middle font-sans font-mono"
                          >
                            <EditableText
                              value={sub.pmWo}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'pmWo', val)}
                              className="text-center font-mono text-[11px]"
                            />
                          </td>

                          {/* QTY: QTY=1 on every row */}
                          <td
                            style={{ ...borderStyle, ...cellPaddingStyle }}
                            className="text-center align-middle font-sans"
                          >
                            <EditableText
                              value={item.qty || '1'}
                              onChange={(val) => handleItemChange(item.id, 'qty', val)}
                              className="text-center font-normal"
                            />
                          </td>

                          {/* FREQUENCIES: M, 3M, 4M, 6M, Y, 18M, 2Y, 3Y */}
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.m || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'm', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.m3 || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'm3', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.m4 || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'm4', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.m6 || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'm6', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.y || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'y', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5 font-bold">
                            <EditableText
                              value={sub.m18 || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'm18', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans font-bold"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.y2 || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'y2', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>
                          <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle whitespace-nowrap px-0.5">
                            <EditableText
                              value={sub.y3 || ''}
                              onChange={(val) => handleSubEntryChange(item.id, subIndex, 'y3', val)}
                              className="text-center whitespace-nowrap min-w-0 font-sans"
                            />
                          </td>

                          {/* Quick row actions in edit mode */}
                          {isEditingEnabled && (
                            <td className="no-print p-0 text-center align-middle border-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-0.5 justify-center">
                                {isFirstSubOfItem && (
                                  <button
                                    type="button"
                                    onClick={() => handleAddSubLine(item.id)}
                                    title="為此設備添加工單 (Add WO Line)"
                                    className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {subs.length > 1 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubLine(item.id, subIndex)}
                                    title="刪除此行工單"
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRow(item.id)}
                                    title="刪除此設備項目"
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    });
                  })}
                </React.Fragment>
              )))
            }

              {/* OVERALL TOTAL ROW */}
              <tr className="font-bold">
                <td
                  colSpan={3}
                  style={{ ...borderStyle, ...cellPaddingStyle }}
                  className="text-right pr-4 align-middle font-bold"
                >
                  Overall Total:
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle }} className="text-center align-middle font-bold">
                  {/* Empty in screenshot */}
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.mTotal}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, mTotal: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.m3Total}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, m3Total: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.m4Total}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, m4Total: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.m6Total}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, m6Total: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.yTotal}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, yTotal: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.m18Total || ''}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, m18Total: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.y2Total}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, y2Total: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                <td style={{ ...borderStyle, ...cellPaddingStyle, width: '5.625%' }} className="text-center align-middle font-bold whitespace-nowrap px-0.5">
                  <EditableText
                    value={reportData.overallTotals.y3Total || ''}
                    onChange={(val) =>
                      onUpdateReportData({
                        ...reportData,
                        overallTotals: { ...reportData.overallTotals, y3Total: val },
                      })
                    }
                    className="text-center font-bold whitespace-nowrap min-w-0"
                  />
                </td>
                {isEditingEnabled && <td className="no-print w-10 border-0"></td>}
              </tr>
            </tbody>
          </table>

          {/* Quick add row button at bottom of table */}
          {isEditingEnabled && (
            <div className="no-print mt-2 flex justify-start">
              <button
                type="button"
                onClick={() => handleAddRow()}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-600" />
                新增設備項目 (Add Equipment Row)
              </button>
            </div>
          )}
        </div>

        {/* --- SIGNATORY FOOTER TABLE SECTION (Exact 3-column Excel Grid Match) --- */}
        <div style={signatoryStyle} className="mt-8 relative z-10">
          <table className="w-full border-collapse text-left" style={{ borderCollapse: 'collapse', borderColor: fineTuneSettings.tableBorderColor }}>
            <tbody>
              {/* Row 1: Role Title */}
              <tr>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <span>Prepared By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                </td>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <span>Verified By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                </td>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <span>Endorsed By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                </td>
              </tr>

              {/* Row 2: Name & Staff No. */}
              <tr>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">Name & Staff No. &nbsp;&nbsp;:</span>
                    <EditableText
                      value={signatories.preparedByName}
                      onChange={(val) =>
                        onUpdateReportData({
                          ...reportData,
                          signatories: { ...signatories, preparedByName: val },
                        })
                      }
                      className="font-semibold ml-1"
                      placeholder="姓名與編號"
                    />
                  </div>
                </td>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">Name & Staff No. &nbsp;&nbsp;:</span>
                    <EditableText
                      value={signatories.verifiedByName}
                      onChange={(val) =>
                        onUpdateReportData({
                          ...reportData,
                          signatories: { ...signatories, verifiedByName: val },
                        })
                      }
                      className="font-semibold ml-1"
                      placeholder="姓名與編號"
                    />
                  </div>
                </td>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">Name & Staff No.:</span>
                    <EditableText
                      value={signatories.endorsedByName}
                      onChange={(val) =>
                        onUpdateReportData({
                          ...reportData,
                          signatories: { ...signatories, endorsedByName: val },
                        })
                      }
                      className="font-semibold ml-1"
                      placeholder="姓名與編號"
                    />
                  </div>
                </td>
              </tr>

              {/* Row 3: Date */}
              <tr>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                    <EditableText
                      value={signatories.preparedByDate}
                      onChange={(val) =>
                        onUpdateReportData({
                          ...reportData,
                          signatories: { ...signatories, preparedByDate: val },
                        })
                      }
                      className="ml-1"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </td>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                    <EditableText
                      value={signatories.verifiedByDate}
                      onChange={(val) =>
                        onUpdateReportData({
                          ...reportData,
                          signatories: { ...signatories, verifiedByDate: val },
                        })
                      }
                      className="ml-1"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </td>
                <td style={{ ...borderStyle, padding: '4px 6px', width: '33.33%' }} className="align-top font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                    <EditableText
                      value={signatories.endorsedByDate}
                      onChange={(val) =>
                        onUpdateReportData({
                          ...reportData,
                          signatories: { ...signatories, endorsedByDate: val },
                        })
                      }
                      className="ml-1"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
