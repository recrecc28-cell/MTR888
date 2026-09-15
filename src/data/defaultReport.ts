import { MaintenanceReportData, FineTuneSettings } from '../types';
import { getLocationTitle } from './mtrLocations';
import { createStandardStationReport, STATION_STANDARD_TEMPLATES } from './stationTemplates';

export const defaultReportData: MaintenanceReportData = createStandardStationReport('AIR', 'Aug - 2026');

export const ensureReportQuantities = (report: MaintenanceReportData, depotCode?: string): MaintenanceReportData => {
  const code = depotCode ? depotCode.toUpperCase() : (report.depotCode || '');
  return {
    ...report,
    depotCode: code,
  };
};

export const createEmptyReport = (depotCode: string = ''): MaintenanceReportData => {
  const code = (depotCode || '').toUpperCase().trim();
  if (code && STATION_STANDARD_TEMPLATES[code]) {
    return createStandardStationReport(code);
  }
  return {
    id: `report-${(code || 'new').toLowerCase()}-${Date.now()}`,
    depotCode: code,
    depotTitle: code ? getLocationTitle(code) : '',
    reportMonthYear: 'Aug - 2026',
    contractNo: 'M1202-19E',
    items: [],
    overallTotals: {
      pmWoTotal: '',
      qtyTotal: '',
      mTotal: '',
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
      preparedByName: 'NG KA HO 17914',
      preparedByDate: '',
      verifiedByName: '',
      verifiedByDate: '',
      endorsedByName: '',
      endorsedByDate: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createBlankReportWithoutItems = (depotCode: string = ''): MaintenanceReportData => {
  const code = (depotCode || '').toUpperCase().trim();
  return {
    id: `report-blank-${(code || 'new').toLowerCase()}-${Date.now()}`,
    depotCode: code,
    depotTitle: code ? getLocationTitle(code) : '',
    reportMonthYear: 'Aug - 2026',
    contractNo: 'M1202-19E',
    items: [],
    overallTotals: {
      pmWoTotal: '',
      qtyTotal: '',
      mTotal: '',
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
      preparedByName: 'NG KA HO 17914',
      preparedByDate: '',
      verifiedByName: '',
      verifiedByDate: '',
      endorsedByName: '',
      endorsedByDate: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createLAKReport = (): MaintenanceReportData => {
  return createStandardStationReport('LAK');
};

export const createDefaultReport = (depotCode: string = ''): MaintenanceReportData => {
  return createStandardStationReport(depotCode || 'AIR');
};

export const defaultFineTuneSettings: FineTuneSettings = {
  baseFontSize: 11,
  headerTitleSize: 20,
  headerSubTitleSize: 17,
  contractNoSize: 16,
  tableHeaderSize: 11,
  tableCellSize: 11,
  footerTextSize: 12,
  
  pagePaddingTop: 24,
  pagePaddingBottom: 24,
  pagePaddingLeft: 24,
  pagePaddingRight: 24,
  
  tableRowPaddingY: 3,
  tableBorderWidth: 1,
  tableBorderColor: '#000000',
  
  colWidthStation: 7,
  colWidthWorkDesc: 34,
  colWidthPmWo: 12,
  colWidthQty: 7,
  colWidthTradeGroup: 40,
  
  headerOffsetX: 0,
  headerOffsetY: 0,
  tableOffsetX: 0,
  tableOffsetY: 0,
  signatoryOffsetX: 0,
  signatoryOffsetY: 0,
  
  showGridLines: true,
  showSignatureLines: true,
  compactMode: false,
  mergeWorkDescription: true,
};
