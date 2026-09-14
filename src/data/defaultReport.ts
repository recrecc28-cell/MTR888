import { MaintenanceReportData, FineTuneSettings } from '../types';
import { getLocationTitle } from './mtrLocations';

export const defaultReportData: MaintenanceReportData = {
  id: 'report-empty',
  depotCode: '',
  depotTitle: '',
  reportMonthYear: '',
  contractNo: '',
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
    preparedByName: '',
    preparedByDate: '',
    verifiedByName: '',
    verifiedByDate: '',
    endorsedByName: '',
    endorsedByDate: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const ensureReportQuantities = (report: MaintenanceReportData, depotCode?: string): MaintenanceReportData => {
  return {
    ...report,
    depotCode: depotCode ? depotCode.toUpperCase() : (report.depotCode || ''),
  };
};

export const createEmptyReport = (depotCode: string = ''): MaintenanceReportData => {
  const code = (depotCode || '').toUpperCase();
  return {
    id: `report-${(code || 'new').toLowerCase()}-${Date.now()}`,
    depotCode: code,
    depotTitle: code ? getLocationTitle(code) : '',
    reportMonthYear: 'September - 2026',
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
      preparedByName: '',
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
  return createEmptyReport('LAK');
};

export const createDefaultReport = (depotCode: string = ''): MaintenanceReportData => {
  return createEmptyReport(depotCode);
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
