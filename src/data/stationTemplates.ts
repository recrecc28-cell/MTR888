import { MaintenanceItem, MaintenanceReportData } from '../types';
import { getLocationTitle } from './mtrLocations';

export interface StationStandardItem {
  workDescription: string;
  qty: string;
}

export interface StationTemplateDefinition {
  code: string;
  title: string;
  items: StationStandardItem[];
}

export const STATION_STANDARD_TEMPLATES: Record<string, StationTemplateDefinition> = {
  AIR: {
    code: 'AIR',
    title: 'MTRC AEL / TCL - AIR',
    items: [
      { workDescription: 'Air Handling Unit (G01)', qty: '16' },
      { workDescription: 'Air Handling Unit (G02)', qty: '16' },
      { workDescription: 'Primary Air Handling Unit', qty: '2' },
      { workDescription: 'Fan Coil Unit', qty: '48' },
    ],
  },
  AWE: {
    code: 'AWE',
    title: 'MTRC AEL / TCL - AWE',
    items: [
      { workDescription: 'Air Handling Unit', qty: '5' },
      { workDescription: 'Fan Coil Unit', qty: '2' },
    ],
  },
  CHT: {
    code: 'CHT',
    title: 'MTRC AEL / TCL - CHT',
    items: [
      { workDescription: 'Make-Up Air Unit / Primary Air Handling Unit', qty: '4' },
    ],
  },
  HIC: {
    code: 'HIC',
    title: 'MTRC AEL / TCL - HIC',
    items: [
      { workDescription: 'Penstock', qty: '3' },
      { workDescription: 'Intake Bar Screen', qty: '6' },
      { workDescription: 'Travelling Band Screen (NO:1)', qty: '1' },
      { workDescription: 'Travelling Band Screen (NO:2)', qty: '1' },
      { workDescription: 'Travelling Band Screen (NO:3)', qty: '1' },
      { workDescription: 'Auto Backwash Strainer', qty: '4' },
      { workDescription: 'Desander', qty: '2' },
      { workDescription: 'Backwash Pump (NO:1)', qty: '1' },
      { workDescription: 'Backwash Pump (NO:2)', qty: '1' },
      { workDescription: 'Electrochlorinator', qty: '3' },
      { workDescription: 'Degas Tank', qty: '2' },
      { workDescription: 'Sea Water Pump', qty: '8' },
      { workDescription: 'Chlorinator Booster (Seawater) Pump', qty: '3' },
      { workDescription: 'Sea Water Chamber', qty: '6' },
      { workDescription: 'Chemical Dosing pump / Tank', qty: '1' },
      { workDescription: 'Chlorinator Dosing Pump', qty: '3' },
    ],
  },
  HOK: {
    code: 'HOK',
    title: 'MTRC AEL / TCL - HOK',
    items: [
      { workDescription: 'Air Handling Unit', qty: '34' },
      { workDescription: 'Primary Air Handling Unit', qty: '9' },
      { workDescription: 'Fan Coil Unit (G01)', qty: '100' },
      { workDescription: 'Fan Coil Unit (G02)', qty: '100' },
      { workDescription: 'Water Cooled Chiller', qty: '5' },
      { workDescription: 'Condensing Water Pump (G01)', qty: '9' },
      { workDescription: 'Condensing Water Pump (G02)', qty: '3' },
      { workDescription: 'Refrigerant Recovery Unit', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/01)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/02)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/03)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/04)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/06)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/07)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/08)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/09)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-B2/10)', qty: '1' },
    ],
  },
  KIC: {
    code: 'KIC',
    title: 'MTRC AEL / TCL - KIC',
    items: [
      { workDescription: 'Penstock', qty: '2' },
      { workDescription: 'Intake Bar Screen', qty: '8' },
      { workDescription: 'Travelling Band Screen -001', qty: '1' },
      { workDescription: 'Travelling Band Screen -002', qty: '1' },
      { workDescription: 'Cyclone Separator (Desander)', qty: '2' },
      { workDescription: 'Travelling Band Screen Sea Water Pump-001', qty: '1' },
      { workDescription: 'Travelling Band Screen Sea Water Pump-002', qty: '1' },
      { workDescription: 'Electrochlorinator', qty: '2' },
      { workDescription: 'Degas Tank', qty: '2' },
      { workDescription: 'Chlorinator Dosing Pump', qty: '2' },
      { workDescription: 'Chlorinated Seawater Pump', qty: '2' },
      { workDescription: 'Sea Water Chamber', qty: '4' },
      { workDescription: 'Condensing Water Pump', qty: '4' },
      { workDescription: 'Plate Heat Exchanger (PHE-001)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-002)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-003)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-004)', qty: '1' },
      { workDescription: 'Sea Water Pump', qty: '4' },
    ],
  },
  KOW: {
    code: 'KOW',
    title: 'MTRC AEL / TCL - KOW',
    items: [
      { workDescription: 'Air Handling Unit (Group 1)', qty: '24' },
      { workDescription: 'Air Handling Unit (Group 2)', qty: '24' },
      { workDescription: 'Primary Air Handling Unit', qty: '12' },
      { workDescription: 'Fan Coil Unit (Group 1)', qty: '56' },
      { workDescription: 'Fan Coil Unit (Group 2)', qty: '52' },
      { workDescription: 'Water Cooled Chiller', qty: '4' },
      { workDescription: 'Condensing Water Pump', qty: '2' },
      { workDescription: 'Refrigerant Recovery Unit', qty: '1' },
    ],
  },
  LAK: {
    code: 'LAK',
    title: 'MTRC AEL / TCL - LAK',
    items: [
      { workDescription: 'Air Cooled Chiller ACC-101', qty: '1' },
      { workDescription: 'Air Cooled Chiller ACC-102', qty: '1' },
      { workDescription: 'Air Cooled Chiller ACC-103', qty: '1' },
      { workDescription: 'Air Cooled Chiller ACC-104', qty: '1' },
    ],
  },
  NIC: {
    code: 'NIC',
    title: 'MTRC-NIC (PHX)',
    items: [
      { workDescription: 'PHE-001 Cleaning', qty: '1' },
      { workDescription: 'PHE-002 Cleaning', qty: '1' },
      { workDescription: 'PHE-003 Cleaning', qty: '1' },
      { workDescription: 'PHE-004 Cleaning', qty: '1' },
    ],
  },
  SST: {
    code: 'SST',
    title: 'MTRC AEL / TCL - SST',
    items: [
      { workDescription: 'Make-Up Air Unit / Primary Air Handling Unit', qty: '4' },
    ],
  },
  TIC: {
    code: 'TIC',
    title: 'MTRC-TIC (PHX)',
    items: [
      { workDescription: 'PHE-001 Cleaning', qty: '1' },
      { workDescription: 'PHE-002 Cleaning', qty: '1' },
      { workDescription: 'PHE-003 Cleaning', qty: '1' },
      { workDescription: 'PHE-004 Cleaning', qty: '1' },
    ],
  },
  TSY: {
    code: 'TSY',
    title: 'MTRC AEL / TCL - TSY',
    items: [
      { workDescription: 'Air Handling Unit (Group 1)', qty: '19' },
      { workDescription: 'Air Handling Unit (Group 2)', qty: '20' },
      { workDescription: 'Primary Air Handling Unit', qty: '15' },
      { workDescription: 'Fan Coil Unit (Group1)', qty: '76' },
      { workDescription: 'Fan Coil Unit (Group2)', qty: '58' },
      { workDescription: 'Water Cooled Chiller', qty: '4' },
      { workDescription: 'Condensing Water Pump', qty: '5' },
      { workDescription: 'Refrigerant Recovery Unit', qty: '1' },
      { workDescription: 'Penstock', qty: '3' },
      { workDescription: 'Intake Bar Screen', qty: '4' },
      { workDescription: 'Travelling Band Screen(NO:1)', qty: '1' },
      { workDescription: 'Travelling Band Screen(NO:2)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-001)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-002)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-003)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-004)', qty: '1' },
      { workDescription: 'Plate Heat Exchanger (PHE-005)', qty: '1' },
      { workDescription: 'Sea Water Pump', qty: '5' },
      { workDescription: 'Auto Backwash Strainer', qty: '2' },
      { workDescription: 'Desander', qty: '1' },
      { workDescription: 'Chlorinator Booster (Seawater) Pump', qty: '3' },
      { workDescription: 'Backwash Pump', qty: '2' },
      { workDescription: 'Electrochlorinator', qty: '3' },
      { workDescription: 'Degas Tank', qty: '1' },
      { workDescription: 'Chlorinator Dosing Pump(01)', qty: '1' },
      { workDescription: 'Chlorinator Dosing Pump(02)', qty: '1' },
      { workDescription: 'Chlorinator Dosing Pump(03)', qty: '1' },
      { workDescription: 'Sea Water Chamber', qty: '5' },
    ],
  },
  TTS: {
    code: 'TTS',
    title: 'MTRC AEL / TCL - TTS',
    items: [
      { workDescription: 'Make-Up Air Unit / Primary Air Handling Unit', qty: '4' },
    ],
  },
  TUC: {
    code: 'TUC',
    title: 'MTRC AEL / TCL - TUC',
    items: [
      { workDescription: 'Air Handling Unit', qty: '6' },
      { workDescription: 'Air Cooled Chiller', qty: '3' },
    ],
  },
  YOT: {
    code: 'YOT',
    title: 'MTRC AEL / TCL - YOT',
    items: [
      { workDescription: 'Make-Up Air Unit / Primary Air Handling Unit', qty: '6' },
    ],
  },
};

/**
 * Creates a standard station report populated with the official standard
 * WORK DESCRIPTION, fixed QTY, Contract No: M1202-19E, and Prepared By: NG KA HO 17914.
 */
export function createStandardStationReport(
  depotCode: string,
  monthYear: string = 'Aug - 2026'
): MaintenanceReportData {
  const code = (depotCode || 'LAK').toUpperCase().trim();
  const template = STATION_STANDARD_TEMPLATES[code];
  const depotTitle = template ? template.title : getLocationTitle(code);

  const items: MaintenanceItem[] = template
    ? template.items.map((std, idx) => ({
        id: `item-${code}-${idx + 1}-${Date.now()}`,
        station: code,
        workDescription: std.workDescription,
        pmWo: '',
        qty: std.qty,
        m: '',
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
            id: `sub-${code}-${idx + 1}-0`,
            pmWo: '',
            m: '',
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
      }))
    : [];

  const totalQty = items.reduce((sum, it) => {
    const n = parseInt(it.qty, 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return {
    id: `report-${code.toLowerCase()}-${Date.now()}`,
    depotCode: code,
    depotTitle,
    reportMonthYear: monthYear,
    contractNo: 'M1202-19E',
    items,
    overallTotals: {
      pmWoTotal: '',
      qtyTotal: totalQty > 0 ? String(totalQty) : '',
      mTotal: items.length > 0 ? '100%' : '',
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
}
