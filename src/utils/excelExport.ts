import * as XLSX from 'xlsx';
import { MaintenanceReportData, MaintenanceItem, SubWoEntry } from '../types';
import { getLocationByCode } from '../data/mtrLocations';

/**
 * Clean string helper
 */
function clean(val: any): string {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

/**
 * Builds standard MTR PM Performance breakdown table rows for an individual station
 */
export function generateStationWorksheetData(reportData: MaintenanceReportData): any[][] {
  const loc = getLocationByCode(reportData.depotCode);
  const stationNameZh = loc?.nameZh || reportData.depotCode;
  const stationNameEn = loc?.nameEn || '';
  const monthYear = reportData.reportMonthYear || 'Aug - 2026';
  const contractNo = reportData.contractNo || 'M1202-19E';
  const signatories = reportData.signatories || {
    preparedByName: '',
    preparedByDate: '',
    verifiedByName: '',
    verifiedByDate: '',
    endorsedByName: '',
    endorsedByDate: '',
  };

  const rows: any[][] = [];

  // Header Titles
  rows.push(['MTR CORPORATION LIMITED']);
  rows.push([`PM PERFORMANCE BREAKDOWN FOR THE MONTH OF ${monthYear.toUpperCase()}`]);
  rows.push([`Contract No.: ${contractNo}`, '', '', '', '', `Station: ${reportData.depotCode} - ${stationNameZh} (${stationNameEn})`]);
  rows.push([]); // Empty spacing row

  // Table Column Headers
  // Multi-tier header representation in Excel
  rows.push([
    'STATION',
    'WORK DESCRIPTION',
    'PM W/O',
    'QTY',
    'TRADE / ECS',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  rows.push([
    '',
    '',
    '',
    '',
    'M',
    '2M',
    '3M',
    '4M',
    '6M',
    'Y',
    '18M',
    '2Y',
    '3Y',
  ]);

  // Data rows
  let totalQty = 0;
  let totalM = 0;
  let totalM2 = 0;
  let totalM3 = 0;
  let totalM4 = 0;
  let totalM6 = 0;
  let totalY = 0;
  let totalM18 = 0;
  let totalY2 = 0;
  let totalY3 = 0;

  const items = reportData.items || [];

  if (items.length === 0) {
    // Empty row placeholder
    rows.push([
      reportData.depotCode,
      '(尚未填寫任何設備維修項目)',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  } else {
    items.forEach((item) => {
      // Gather sub rows
      const subs: SubWoEntry[] =
        item.subEntries && item.subEntries.length > 0
          ? item.subEntries
          : [
              {
                id: 'sub-0',
                pmWo: item.pmWo || '',
                m: item.m,
                m2: item.m2,
                m3: item.m3,
                m4: item.m4,
                m6: item.m6,
                y: item.y,
                m18: item.m18,
                y2: item.y2,
                y3: item.y3,
              },
            ];

      subs.forEach((sub, subIdx) => {
        const isFirstSub = subIdx === 0;
        const qtyNum = isFirstSub && item.qty ? Number(item.qty) || 1 : '';
        if (isFirstSub && typeof qtyNum === 'number') {
          totalQty += qtyNum;
        }

        // Parse frequencies
        const mVal = sub.m ? 1 : '';
        const m2Val = sub.m2 ? 1 : '';
        const m3Val = sub.m3 ? 1 : '';
        const m4Val = sub.m4 ? 1 : '';
        const m6Val = sub.m6 ? 1 : '';
        const yVal = sub.y ? 1 : '';
        const m18Val = sub.m18 ? 1 : '';
        const y2Val = sub.y2 ? 1 : '';
        const y3Val = sub.y3 ? 1 : '';

        if (mVal) totalM++;
        if (m2Val) totalM2++;
        if (m3Val) totalM3++;
        if (m4Val) totalM4++;
        if (m6Val) totalM6++;
        if (yVal) totalY++;
        if (m18Val) totalM18++;
        if (y2Val) totalY2++;
        if (y3Val) totalY3++;

        rows.push([
          isFirstSub ? item.station || reportData.depotCode : '',
          isFirstSub ? item.workDescription : '',
          sub.pmWo || '',
          qtyNum,
          mVal,
          m2Val,
          m3Val,
          m4Val,
          m6Val,
          yVal,
          m18Val,
          y2Val,
          y3Val,
        ]);
      });
    });
  }

  // Summary Row (TOTAL)
  rows.push([
    'TOTAL',
    '',
    '',
    totalQty > 0 ? totalQty : clean(reportData.overallTotals?.qtyTotal),
    totalM > 0 || (reportData.items && reportData.items.length > 0) ? '100%' : clean(reportData.overallTotals?.mTotal),
    totalM2 > 0 ? '100%' : clean(reportData.overallTotals?.m2Total),
    totalM3 > 0 ? '100%' : clean(reportData.overallTotals?.m3Total),
    totalM4 > 0 ? '100%' : clean(reportData.overallTotals?.m4Total),
    totalM6 > 0 ? '100%' : clean(reportData.overallTotals?.m6Total),
    totalY > 0 ? '100%' : clean(reportData.overallTotals?.yTotal),
    totalM18 > 0 ? '100%' : clean(reportData.overallTotals?.m18Total),
    totalY2 > 0 ? '100%' : clean(reportData.overallTotals?.y2Total),
    totalY3 > 0 ? '100%' : clean(reportData.overallTotals?.y3Total),
  ]);

  rows.push([]); // Space row

  // Signatures Section
  rows.push([
    'Prepared by:',
    '',
    '',
    '',
    'Verified by:',
    '',
    '',
    '',
    'Endorsed by:',
    '',
    '',
    '',
    '',
  ]);
  rows.push([
    'Name & Staff No. :',
    clean(signatories.preparedByName),
    '',
    '',
    'Name & Staff No. :',
    clean(signatories.verifiedByName),
    '',
    '',
    'Name & Staff No. :',
    clean(signatories.endorsedByName),
    '',
    '',
    '',
  ]);
  rows.push([
    'Date :',
    clean(signatories.preparedByDate),
    '',
    '',
    'Date :',
    clean(signatories.verifiedByDate),
    '',
    '',
    'Date :',
    clean(signatories.endorsedByDate),
    '',
    '',
    '',
  ]);

  return rows;
}

/**
 * Standard column widths for Excel sheet
 */
export const MTR_EXCEL_COL_WIDTHS = [
  { wch: 12 }, // STATION
  { wch: 44 }, // WORK DESCRIPTION
  { wch: 16 }, // PM W/O
  { wch: 8 },  // QTY
  { wch: 7 },  // M
  { wch: 7 },  // 2M
  { wch: 7 },  // 3M
  { wch: 7 },  // 4M
  { wch: 7 },  // 6M
  { wch: 7 },  // Y
  { wch: 7 },  // 18M
  { wch: 7 },  // 2Y
  { wch: 7 },  // 3Y
];

/**
 * Exports a single station's maintenance report directly to an Excel (.xlsx) file.
 */
export function exportSingleStationToExcel(
  reportData: MaintenanceReportData,
  customFileName?: string
): { success: boolean; fileName: string; rowCount: number } {
  const rows = generateStationWorksheetData(reportData);
  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = MTR_EXCEL_COL_WIDTHS;

  const wb = XLSX.utils.book_new();
  const sheetName = (reportData.depotCode || 'Station').slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const safeMonth = (reportData.reportMonthYear || '2026').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName =
    customFileName || `MTR_PM_Report_${reportData.depotCode}_${safeMonth}.xlsx`;

  XLSX.writeFile(wb, fileName);

  return {
    success: true,
    fileName,
    rowCount: rows.length,
  };
}

/**
 * Exports multiple stations (or all active stations on screen) to a multi-sheet Excel file.
 * Includes:
 * 1. "全站總覽 (All Stations)" summary worksheet
 * 2. Individual worksheets for each station (e.g. LAK, ADM, CEN...)
 */
export function exportAllStationsToExcel(
  reportsByDepot: Record<string, MaintenanceReportData>,
  stationCodes: string[],
  monthYear: string = 'Aug - 2026',
  contractNo: string = 'M1202-19E',
  customFileName?: string
): { success: boolean; fileName: string; sheetCount: number; stationCount: number } {
  const wb = XLSX.utils.book_new();

  // 1. Build Consolidated Summary Sheet
  const summaryRows: any[][] = [];
  summaryRows.push(['MTR CORPORATION LIMITED']);
  summaryRows.push([`PM PERFORMANCE BREAKDOWN - ALL STATIONS (${monthYear.toUpperCase()})`]);
  summaryRows.push([`Contract No.: ${contractNo}`, '', '', '', '', `Total Stations: ${stationCodes.length}`]);
  summaryRows.push([]);

  // Table header
  summaryRows.push([
    'STATION',
    'WORK DESCRIPTION',
    'PM W/O',
    'QTY',
    'M',
    '2M',
    '3M',
    '4M',
    '6M',
    'Y',
    '18M',
    '2Y',
    '3Y',
  ]);

  let grandTotalQty = 0;
  let grandTotalM = 0;
  let grandTotalM2 = 0;
  let grandTotalM3 = 0;
  let grandTotalM4 = 0;
  let grandTotalM6 = 0;
  let grandTotalY = 0;
  let grandTotalM18 = 0;
  let grandTotalY2 = 0;
  let grandTotalY3 = 0;

  stationCodes.forEach((code) => {
    const rep = reportsByDepot[code];
    if (!rep || !rep.items || rep.items.length === 0) return;

    rep.items.forEach((item) => {
      const subs =
        item.subEntries && item.subEntries.length > 0
          ? item.subEntries
          : [
              {
                id: 'sub-0',
                pmWo: item.pmWo || '',
                m: item.m,
                m2: item.m2,
                m3: item.m3,
                m4: item.m4,
                m6: item.m6,
                y: item.y,
                m18: item.m18,
                y2: item.y2,
                y3: item.y3,
              },
            ];

      subs.forEach((sub, subIdx) => {
        const isFirstSub = subIdx === 0;
        const qtyNum = isFirstSub && item.qty ? Number(item.qty) || 1 : '';
        if (isFirstSub && typeof qtyNum === 'number') grandTotalQty += qtyNum;

        const mVal = sub.m ? 1 : '';
        const m2Val = sub.m2 ? 1 : '';
        const m3Val = sub.m3 ? 1 : '';
        const m4Val = sub.m4 ? 1 : '';
        const m6Val = sub.m6 ? 1 : '';
        const yVal = sub.y ? 1 : '';
        const m18Val = sub.m18 ? 1 : '';
        const y2Val = sub.y2 ? 1 : '';
        const y3Val = sub.y3 ? 1 : '';

        if (mVal) grandTotalM++;
        if (m2Val) grandTotalM2++;
        if (m3Val) grandTotalM3++;
        if (m4Val) grandTotalM4++;
        if (m6Val) grandTotalM6++;
        if (yVal) grandTotalY++;
        if (m18Val) grandTotalM18++;
        if (y2Val) grandTotalY2++;
        if (y3Val) grandTotalY3++;

        summaryRows.push([
          isFirstSub ? item.station || code : '',
          isFirstSub ? item.workDescription : '',
          sub.pmWo || '',
          qtyNum,
          mVal,
          m2Val,
          m3Val,
          m4Val,
          m6Val,
          yVal,
          m18Val,
          y2Val,
          y3Val,
        ]);
      });
    });
  });

  // Grand total row
  summaryRows.push([
    'GRAND TOTAL',
    '',
    '',
    grandTotalQty,
    grandTotalM,
    grandTotalM2,
    grandTotalM3,
    grandTotalM4,
    grandTotalM6,
    grandTotalY,
    grandTotalM18,
    grandTotalY2,
    grandTotalY3,
  ]);

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = MTR_EXCEL_COL_WIDTHS;
  XLSX.utils.book_append_sheet(wb, wsSummary, '全站總覽 (All Stations)');

  // 2. Append Individual Station Worksheets
  let addedSheets = 1;
  stationCodes.forEach((code) => {
    const rep = reportsByDepot[code];
    if (!rep) return;
    const stnRows = generateStationWorksheetData(rep);
    const wsStn = XLSX.utils.aoa_to_sheet(stnRows);
    wsStn['!cols'] = MTR_EXCEL_COL_WIDTHS;
    const safeSheetName = code.replace(/[:\\/?*[\]]/g, '').slice(0, 31);
    XLSX.utils.book_append_sheet(wb, wsStn, safeSheetName);
    addedSheets++;
  });

  const safeMonth = monthYear.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName =
    customFileName || `MTR_PM_Report_All_Stations_${safeMonth}.xlsx`;

  XLSX.writeFile(wb, fileName);

  return {
    success: true,
    fileName,
    sheetCount: addedSheets,
    stationCount: stationCodes.length,
  };
}
