export interface SubWoEntry {
  id: string;
  pmWo: string;
  m?: string;
  m3?: string;
  m4?: string;
  m6?: string;
  y?: string;
  m18?: string;
  y2?: string;
  y3?: string;
  m2?: string;
}

export interface MaintenanceItem {
  id: string;
  station: string; // e.g. LAK, TWD
  workDescription: string; // e.g. Air Cooled Chiller ACC-101
  pmWo: string; // PM Work Order number or reference
  qty: string; // e.g. 1
  m: string; // Monthly
  m2?: string; // 2M
  m3: string; // 3M
  m4: string; // 4M
  m6: string; // 6M
  y: string; // Yearly
  m18?: string; // 18M
  y2: string; // 2Y
  y3?: string; // 3Y
  subEntries?: SubWoEntry[];
}

export interface SignatoryInfo {
  preparedByName: string; // e.g. NG KA HO 17914
  preparedByDate: string;
  preparedBySig?: string; // image base64 or status
  verifiedByName: string;
  verifiedByDate: string;
  verifiedBySig?: string;
  endorsedByName: string;
  endorsedByDate: string;
  endorsedBySig?: string;
}

export interface MaintenanceReportData {
  id: string;
  depotCode: string; // e.g. LAK
  depotTitle: string; // e.g. MTRC AEL / TCL - LAK
  reportMonthYear: string; // e.g. AUG - 2026
  contractNo: string; // e.g. M1202-19E
  items: MaintenanceItem[];
  overallTotals: {
    pmWoTotal: string;
    qtyTotal: string;
    mTotal: string;
    m2Total?: string;
    m3Total: string;
    m4Total: string;
    m6Total: string;
    yTotal: string;
    m18Total?: string;
    y2Total: string;
    y3Total?: string;
  };
  signatories: SignatoryInfo;
  createdAt: string;
  updatedAt: string;
}

export interface FineTuneSettings {
  // Global & Typography
  baseFontSize: number; // in px, default 11
  headerTitleSize: number; // in px, default 18
  headerSubTitleSize: number; // in px, default 16
  contractNoSize: number; // in px, default 15
  tableHeaderSize: number; // in px, default 11
  tableCellSize: number; // in px, default 10.5
  footerTextSize: number; // in px, default 11
  
  // Layout & Margins (mm or px)
  pagePaddingTop: number; // px, default 20
  pagePaddingBottom: number; // px, default 20
  pagePaddingLeft: number; // px, default 24
  pagePaddingRight: number; // px, default 24
  
  // Table Specifics
  tableRowPaddingY: number; // px, default 3.5
  tableBorderWidth: number; // px, default 1
  tableBorderColor: string; // default "#000000"
  
  // Column Width Ratios (%)
  colWidthStation: number; // %, default 9
  colWidthWorkDesc: number; // %, default 35
  colWidthPmWo: number; // %, default 11
  colWidthQty: number; // %, default 7
  colWidthTradeGroup: number; // %, default 38
  
  // Fine Nudge Offsets (px)
  headerOffsetX: number;
  headerOffsetY: number;
  tableOffsetX: number;
  tableOffsetY: number;
  signatoryOffsetX: number;
  signatoryOffsetY: number;
  
  // Toggle Visibility
  showGridLines: boolean;
  showSignatureLines: boolean;
  compactMode: boolean;
  mergeWorkDescription?: boolean;
}

export interface ArchiveRecord {
  id: string;
  reportData: MaintenanceReportData;
  fineTuneSettings: FineTuneSettings;
  archivedAt: string;
  notes?: string;
  fileName?: string;
}
