import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { MaintenanceReportData, MaintenanceItem } from '../types';
import { ALL_MTR_LOCATIONS, getLocationTitle, getLocationByCode } from '../data/mtrLocations';

export const STANDARD_MTR_ITEMS = [
  'Air Handling Unit /Primary Air Handling Unit',
  'Fan Coil Unit',
  'AIR-COOLED CHILLER',
  'Water Cooled Chiller',
  'Chilled Water Pump',
  'Cooling Tower',
  'Sea Water Pump',
  'Air Compressor',
  'Chlorination Plant',
  'Chlorination Degas Cyclone',
  'Oxidation-Reduction Potential System',
  'Sea Water Intake Screen',
  'Washable Panel Filter',
  'Chem. Dosing Unit',
  'Motor Control Centre',
  'Motor Control Panel',
  'Differential By-pass Valve & Control',
  'Disposal Bag Filter',
  'Chemical Feed Tank',
  'F & E Tank',
  'Make Up Water Tank',
  'Metering Pump',
  'Presurization Unit',
  'Plate Heat Exchanger',
  'Pipework',
  'Motorised Operated Valve',
  'Valve',
  'Sensor',
  'Flexible Connection',
  'Pipework Insulation',
  'thermal linked fire damper',
  'Fusible linked fire damper',
  'Motorised Operated Damper',
  'Smoke Extraction System',
  'Smoke Extraction Fan',
  'VAC System',
];

/**
 * Intelligent keyword & acronym matcher for MTR Work Descriptions
 */
export function matchStandardWorkDescription(rawText: string): string {
  if (!rawText) return '';
  const text = rawText.toUpperCase().trim();

  // Water Cooled Chiller (WCC)
  if (
    text.includes('WATER COOLED CHILLER') ||
    text.includes('WATER-COOLED CHILLER') ||
    text.includes('ECS-WCC') ||
    text.includes('-WCC-') ||
    text.endsWith('-WCC') ||
    text.includes('WCC-ALL') ||
    /\bWCC\b/.test(text)
  ) {
    return 'Water Cooled Chiller';
  }

  // 1. Air Cooled Chiller (ACC) -> Standardised to AIR-COOLED CHILLER
  if (
    text === 'ACC' ||
    text.includes('AIR COOLED CHILLER') ||
    text.includes('AIR-COOLED CHILLER') ||
    text.includes('ECS-ACC') ||
    text.includes('-ACC-') ||
    text.endsWith('-ACC') ||
    text.includes('ACC-ALL') ||
    (text.includes('CHILLER') && !text.includes('WATER PUMP') && !text.includes('PUMP') && !text.includes('WATER COOLED') && !text.includes('WATER-COOLED')) ||
    /\bACC\b/.test(text)
  ) {
    return 'AIR-COOLED CHILLER';
  }

  // 2. Disposal Bag Filter (DBF)
  if (
    text.includes('DISPOSAL BAG FILTER') ||
    text.includes('BAG FILTER') ||
    text.includes('ECS-DBF') ||
    text.includes('-DBF-') ||
    text.endsWith('-DBF') ||
    text.includes('DBF-ALL') ||
    /\bDBF\b/.test(text)
  ) {
    return 'Disposal Bag Filter';
  }

  // 4. Motor Control Panel (MCP) - Check before MCC if text explicitly mentions PANEL or MCP
  if (
    text.includes('MOTOR CONTROL PANEL') ||
    text.includes('ECS-MCP') ||
    text.includes('-MCP-') ||
    text.endsWith('-MCP') ||
    text.includes('MCP-ALL') ||
    /\bMCP\b/.test(text)
  ) {
    return 'Motor Control Panel';
  }

  // 3. Motor Control Centre (MCC)
  if (
    text.includes('MOTOR CONTROL CENTER') ||
    text.includes('MOTOR CONTROL CENTRE') ||
    text.includes('ECS-MCC') ||
    text.includes('-MCC-') ||
    text.endsWith('-MCC') ||
    text.includes('MCC-ALL') ||
    /\bMCC\b/.test(text)
  ) {
    return 'Motor Control Centre';
  }

  // 5. Motorised Operated Valve (MOV)
  if (
    text.includes('MOTORISED OPERATED VALVE') ||
    text.includes('MOTORIZED OPERATED VALVE') ||
    text.includes('MOTORISED VALVE') ||
    text.includes('MOTORIZED VALVE') ||
    text.includes('ECS-MOV') ||
    text.includes('-MOV-') ||
    text.endsWith('-MOV') ||
    text.includes('MOV-ALL') ||
    /\bMOV\b/.test(text)
  ) {
    return 'Motorised Operated Valve';
  }

  // 6. Washable Panel Filter (WPF)
  if (
    text.includes('WASHABLE PANEL FILTER') ||
    text.includes('PANEL FILTER') ||
    text.includes('ECS-WPF') ||
    text.includes('-WPF-') ||
    text.endsWith('-WPF') ||
    text.includes('WPF-ALL') ||
    /\bWPF\b/.test(text)
  ) {
    return 'Washable Panel Filter';
  }

  // 7. Air Handling Unit / Primary Air Handling Unit (AHU)
  if (
    text.includes('AIR HANDLING') ||
    text.includes('AIR HANDING') ||
    text.includes('PRIMARY AIR') ||
    text.includes('ECS-AHU') ||
    text.includes('-AHU-') ||
    text.endsWith('-AHU') ||
    text.includes('AHU-ALL') ||
    /\bAHU\b/.test(text)
  ) {
    return 'Air Handling Unit /Primary Air Handling Unit';
  }

  // 8. Fan Coil Unit (FCU)
  if (
    text.includes('FAN COIL') ||
    text.includes('ECS-FCU') ||
    text.includes('-FCU-') ||
    text.endsWith('-FCU') ||
    text.includes('FCU-ALL') ||
    /\bFCU\b/.test(text)
  ) {
    return 'Fan Coil Unit';
  }

  // 9. Chilled Water Pump (CWP / CHP / MUP / SHD-METCHW / CHILLER PUMP ROOM equipment)
  if (
    text.includes('5001618422') ||
    text.includes('5001618424') ||
    text.includes('5001618425') ||
    text.includes('5001618426') ||
    text.includes('CHILLED WATER PUMP') ||
    text.includes('CHILLER PUMP') ||
    text.includes('CHILLED PUMP') ||
    text.includes('MR-SHD-CP') ||
    text.includes('MR-SHD-MDP') ||
    text.includes('MR-SHD-MTP') ||
    text.includes('MR-SHD-ORP') ||
    text.includes('SHD-ECS-METCHW') ||
    text.includes('SHD-ECS-PHC') ||
    text.includes('SHD-ECS-CHP') ||
    text.includes('ECS-CWP') ||
    text.includes('-CWP-') ||
    text.endsWith('-CWP') ||
    text.includes('CWP-ALL') ||
    /\bCWP\b/.test(text) ||
    text.includes('ECS-CHP') ||
    text.includes('-CHP-') ||
    text.endsWith('-CHP') ||
    text.includes('CHP-') ||
    /\bCHP\b/.test(text) ||
    text.includes('ECS-MTP') ||
    text.includes('-MTP-') ||
    text.endsWith('-MTP') ||
    text.includes('MTP-') ||
    /\bMTP\b/.test(text) ||
    text.includes('ECS-MUP') ||
    text.includes('-MUP-') ||
    text.endsWith('-MUP') ||
    text.includes('MUP-') ||
    text.includes('ECS-MWP') ||
    text.includes('-MWP-') ||
    text.includes('MR-SHD-MUP') ||
    /\bMUP\b/.test(text) ||
    /\bMWP\b/.test(text)
  ) {
    return 'Chilled Water Pump';
  }

  // 10. Chem. Dosing Unit (CDU)
  if (
    text.includes('CHEM. DOSING') ||
    text.includes('CHEMICAL DOSING') ||
    text.includes('DOSING UNIT') ||
    text.includes('ECS-CDU') ||
    text.includes('-CDU-') ||
    text.endsWith('-CDU') ||
    text.includes('CDU-ALL') ||
    /\bCDU\b/.test(text)
  ) {
    return 'Chem. Dosing Unit';
  }

  // 11. Differential By-pass Valve & Control (DBV)
  if (
    text.includes('DIFFERENTIAL BY-PASS') ||
    text.includes('BYPASS VALVE') ||
    text.includes('BY-PASS VALVE') ||
    text.includes('ECS-DBV') ||
    text.includes('-DBV-') ||
    text.endsWith('-DBV') ||
    text.includes('DBV-ALL') ||
    /\bDBV\b/.test(text)
  ) {
    return 'Differential By-pass Valve & Control';
  }

  // 12. Chemical Feed Tank (CFT)
  if (
    text.includes('CHEMICAL FEED TANK') ||
    text.includes('FEED TANK') ||
    text.includes('ECS-CFT') ||
    text.includes('-CFT-') ||
    text.endsWith('-CFT') ||
    text.includes('CFT-ALL') ||
    /\bCFT\b/.test(text)
  ) {
    return 'Chemical Feed Tank';
  }

  // 13. F & E Tank (FET)
  if (
    text.includes('F & E TANK') ||
    text.includes('F&E TANK') ||
    text.includes('EXPANSION TANK') ||
    text.includes('ECS-FET') ||
    text.includes('-FET-') ||
    text.endsWith('-FET') ||
    text.includes('FET-ALL') ||
    /\bFET\b/.test(text)
  ) {
    return 'F & E Tank';
  }

  // 14. Make Up Water Tank (MWT)
  if (
    text.includes('MAKE UP WATER') ||
    text.includes('MAKEUP WATER') ||
    text.includes('ECS-MWT') ||
    text.includes('-MWT-') ||
    text.endsWith('-MWT') ||
    text.includes('MWT-ALL') ||
    /\bMWT\b/.test(text)
  ) {
    return 'Make Up Water Tank';
  }

  // Plate Heat Exchanger (PHE) / Heat Exchanger
  if (
    text.includes('HEAT EXCHANGER') ||
    text.includes('PLATE HEAT EXCHANGER') ||
    text.includes('ECS-PHE') ||
    text.includes('-PHE-') ||
    text.endsWith('-PHE') ||
    text.includes('PHE-ALL') ||
    /\bPHE\b/.test(text)
  ) {
    return 'Plate Heat Exchanger';
  }

  // 15. Metering Pump (MP)
  if (
    text.includes('METERING PUMP') ||
    text.includes('ECS-MP') ||
    text.includes('-MP-') ||
    text.endsWith('-MP') ||
    text.includes('MP-ALL') ||
    /\bMP\b/.test(text)
  ) {
    return 'Metering Pump';
  }

  // 16. Presurization Unit (PU)
  if (
    text.includes('PRESURIZATION') ||
    text.includes('PRESSURIZATION') ||
    text.includes('ECS-PU') ||
    text.includes('-PU-') ||
    text.endsWith('-PU') ||
    text.includes('PU-ALL') ||
    /\bPU\b/.test(text)
  ) {
    return 'Presurization Unit';
  }

  // 17. Pipework Insulation (INS)
  if (
    text.includes('PIPEWORK INSULATION') ||
    text.includes('INSULATION') ||
    text.includes('ECS-INS') ||
    text.includes('-INS-') ||
    text.endsWith('-INS') ||
    text.includes('INS-ALL') ||
    /\bINS\b/.test(text)
  ) {
    return 'Pipework Insulation';
  }

  // 18. Pipework (PIPE)
  if (
    text.includes('PIPEWORK') ||
    text.includes('ECS-PIPE') ||
    text.includes('-PIPE-') ||
    text.endsWith('-PIPE') ||
    text.includes('PIPE-ALL') ||
    /\bPIPE\b/.test(text)
  ) {
    return 'Pipework';
  }

  // 19. Valve (VALVE)
  if (
    (text.includes('VALVE') || text.includes('ECS-VALVE') || text.includes('-VALVE-') || text.includes('VALVE-ALL')) &&
    !text.includes('MOTORISED') &&
    !text.includes('MOTORIZED') &&
    !text.includes('BY-PASS') &&
    !text.includes('BYPASS')
  ) {
    return 'Valve';
  }

  // 20. Sensor (SENSOR)
  if (text.includes('SENSOR') || text.includes('ECS-SENSOR') || text.includes('-SENSOR-') || text.includes('SENSOR-ALL')) {
    return 'Sensor';
  }

  // 21. Flexible Connection (FLEX)
  if (
    text.includes('FLEXIBLE CONNECTION') ||
    text.includes('FLEXIBLE') ||
    text.includes('ECS-FLEX') ||
    text.includes('-FLEX-') ||
    text.endsWith('-FLEX') ||
    text.includes('FLEX-ALL')
  ) {
    return 'Flexible Connection';
  }

  // Exact or close match with standard list
  const exact = STANDARD_MTR_ITEMS.find((item) => text.includes(item.toUpperCase()));
  if (exact) return exact;

  // Cooling Tower (COT)
  if (text.includes('COOLING TOWER') || text.includes('ECS-COT') || text.includes('-COT-') || text.endsWith('-COT') || /\bCOT\b/.test(text)) {
    return 'Cooling Tower';
  }

  // Sea Water Pump (SWP / SCWP)
  if (
    text.includes('SEA WATER PUMP') ||
    text.includes('SEAWATER PUMP') ||
    text.includes('ECS-SWP') ||
    text.includes('-SWP-') ||
    text.endsWith('-SWP') ||
    text.includes('ECS-SCWP') ||
    text.includes('-SCWP-') ||
    text.endsWith('-SCWP') ||
    /\bSCWP\b/.test(text) ||
    /\bSWP\b/.test(text)
  ) {
    return 'Sea Water Pump';
  }

  // Air Compressor (SAC / AIRC / COMPRESSOR)
  if (
    text.includes('AIR COMPRESSOR') ||
    text.includes('COMPRESSOR') ||
    text.includes('ECS-SAC') ||
    text.includes('-SAC-') ||
    text.endsWith('-SAC') ||
    /\bAIRC\b/.test(text) ||
    /\bSAC\b/.test(text)
  ) {
    return 'Air Compressor';
  }

  // Chlorination Degas Cyclone (CYN)
  if (
    text.includes('CHLORINATION DEGAS CYCLONE') ||
    text.includes('DEGAS CYCLONE') ||
    text.includes('ECS-CYN') ||
    text.includes('-CYN-') ||
    text.endsWith('-CYN') ||
    /\bCYN\b/.test(text)
  ) {
    return 'Chlorination Degas Cyclone';
  }

  // Chlorination Plant (ECL)
  if (
    text.includes('CHLORINATION PLANT') ||
    text.includes('CHLORINATION') ||
    text.includes('ECS-ECL') ||
    text.includes('-ECL-') ||
    text.endsWith('-ECL') ||
    /\bECL\b/.test(text)
  ) {
    return 'Chlorination Plant';
  }

  // Oxidation-Reduction Potential System (ORP)
  if (
    text.includes('OXIDATION-REDUCTION') ||
    text.includes('OXIDATION REDUCTION') ||
    text.includes('POTENTIAL SYSTEM') ||
    text.includes('ECS-ORP') ||
    text.includes('-ORP-') ||
    text.endsWith('-ORP') ||
    /\bORP\b/.test(text)
  ) {
    return 'Oxidation-Reduction Potential System';
  }

  // Sea Water Intake Screen (SWS / INS)
  if (
    text.includes('SEA WATER INTAKE') ||
    text.includes('INTAKE SCREEN') ||
    text.includes('ECS-SWS') ||
    text.includes('-SWS-') ||
    text.endsWith('-SWS') ||
    /\bSWS\b/.test(text)
  ) {
    return 'Sea Water Intake Screen';
  }

  // Electro-thermal linked fire damper (ETD) -> User rule: thermal linked fire damper
  if (
    text.includes('ELECTRO-THERMAL') ||
    text.includes('ELECTRO THERMAL') ||
    text.includes('THERMAL LINKED FIRE DAMPER') ||
    text.includes('ECS-ETD') ||
    text.includes('-ETD-') ||
    text.endsWith('-ETD') ||
    text.includes('ETD-ALL') ||
    /\bETD\b/.test(text)
  ) {
    return 'thermal linked fire damper';
  }

  // Fusible linked fire damper (FLD)
  if (
    text.includes('FUSIBLE LINKED') ||
    text.includes('FUSIBLE') ||
    text.includes('ECS-FLD') ||
    text.includes('-FLD-') ||
    text.endsWith('-FLD') ||
    text.includes('FLD-ALL') ||
    /\bFLD\b/.test(text)
  ) {
    return 'Fusible linked fire damper';
  }

  // Motorised Operated Damper (MOD)
  if (
    text.includes('MOTORISED OPERATED DAMPER') ||
    text.includes('MOTORIZED OPERATED DAMPER') ||
    text.includes('ECS-MOD') ||
    text.includes('-MOD-') ||
    text.endsWith('-MOD') ||
    text.includes('MOD-ALL') ||
    /\bMOD\b/.test(text)
  ) {
    return 'Motorised Operated Damper';
  }

  // Smoke Extraction System & Smoke Extraction Fan (SES / SEF)
  if (
    text.includes('SMOKE EXTRACTION SYSTEM') ||
    text.includes('ECS-SES') ||
    text.includes('-SES-') ||
    text.endsWith('-SES') ||
    /\bSES\b/.test(text)
  ) {
    return 'Smoke Extraction System';
  }
  if (
    text.includes('SEF MAINTENANCE') ||
    text.includes('SMOKE EXTRACTION FAN') ||
    text.includes('ECS-SEF') ||
    text.includes('-SEF-') ||
    text.endsWith('-SEF') ||
    /\bSEF\b/.test(text)
  ) {
    return 'Smoke Extraction Fan';
  }

  // VAC System (VAC)
  if (
    text.includes('VAC SYSTEM') ||
    text.includes('ECS-VAC') ||
    text.includes('-VAC-') ||
    text.endsWith('-VAC') ||
    text.includes('VAC-ALL') ||
    /\bVAC\b/.test(text)
  ) {
    return 'VAC System';
  }

  // If no standard pattern matched, return empty string (let caller fallback to cleaned text)
  return '';
}

/**
 * Extracts the meaningful maintenance work description from ASSET.DESCRIPTION column
 * User rule: "read inside the meaning work, belong to MTR job maintenance,
 * such as MR HTD ECS-AIR HANDLING UNIT ALL, means AIR HANDLING UNIT,
 * MR HTD ECS-Electro-thermal linked fire damper - ALL, means Electro-thermal linked fire damper, 如此類推"
 */
export function extractMeaningfulAssetWork(rawText: string): string {
  if (!rawText) return '';
  const trimmed = rawText.trim();
  if (!trimmed) return '';

  // 1. If there's a semicolon, inspect the split parts:
  // e.g. "MR HTD ECS-CWM-COT-ALL; COOLING TOWER" -> "COOLING TOWER"
  // e.g. "MR-CWD-DBF; DISPOSAL BAG FILTER" -> "DISPOSAL BAG FILTER"
  // e.g. "MR-TWD WASHABLE PANEL FILTER ;TWD ;ALL" -> "WASHABLE PANEL FILTER"
  if (trimmed.includes(';')) {
    const parts = trimmed.split(';').map((p) => p.trim()).filter(Boolean);
    // Check if any part after the first one is a meaningful work phrase
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const upperPart = part.toUpperCase();
      // Ignore parts that are just station codes or 'ALL' or 'COP' or short numbers
      if (
        upperPart === 'ALL' ||
        upperPart === 'COP' ||
        upperPart === 'TH' ||
        upperPart === 'NTH' ||
        /^[A-Z0-9]{2,4}$/.test(upperPart)
      ) {
        continue;
      }
      const cleanedPart = cleanAssetWorkString(part);
      if (cleanedPart && cleanedPart.length > 2) {
        return cleanedPart;
      }
    }

    // If subsequent parts were only tags/station codes, inspect the first part
    const firstCleaned = cleanAssetWorkString(parts[0]);
    if (firstCleaned && firstCleaned.length > 2) {
      return firstCleaned;
    }
  }

  // 2. Direct string cleaning (without semicolon)
  const cleaned = cleanAssetWorkString(trimmed);
  if (cleaned) {
    return cleaned;
  }

  return trimmed;
}

/**
 * Helper to strip MR prefixes, depot codes, ECS subsystems, acronym tags, and '- ALL' suffixes
 */
function cleanAssetWorkString(str: string): string {
  if (!str) return '';

  let res = str.trim();

  // Strip leading prefixes:
  // e.g. "MR HTD ECS-", "MR PHD ECS-", "MR-PHD-ECS-", "MR-CWD-", "HTD ECS-", "ECS-", etc.
  res = res
    .replace(/^MR[\s\-]+[A-Z0-9]{3,4}[\s\-]+(?:ECS|BMS|FAS|PSD|MVAC|VAC|BEM|FPS)[\s\-/]+/i, '')
    .replace(/^MR[\s\-]+[A-Z0-9]{3,4}[\s\-/]+/i, '')
    .replace(/^MR[\s\-]+(?:ECS|BMS|FAS|PSD|MVAC|VAC|BEM|FPS)[\s\-/]+/i, '')
    .replace(/^MR[\s\-]+/i, '')
    .replace(/^[A-Z0-9]{3,4}[\s\-]+(?:ECS|BMS|FAS|PSD|MVAC|VAC|BEM|FPS)[\s\-/]+/i, '')
    .replace(/^(?:ECS|BMS|FAS|PSD|MVAC|VAC|BEM|FPS)[\s\-/]+/i, '');

  // Strip trailing station + ALL suffixes if separated by semicolons (e.g. ";TWD ;ALL" or "; TWD ; ALL")
  res = res.replace(/;\s*[A-Z0-9]{3,4}\s*;\s*ALL\s*$/i, '');
  res = res.replace(/;\s*[A-Z0-9]{3,4}\s+ALL\s*$/i, '');

  // Strip trailing suffixes:
  // e.g. " - ALL", " ;ALL", "-ALL", " ALL", " (ALL)", " - ALL."
  res = res
    .replace(/[\s\-–—;,]+ALL\s*[.]?$/i, '')
    .replace(/\s+ALL\s*[.]?$/i, '')
    .replace(/[\s\-–—;,]+\(ALL\)\s*$/i, '')
    .replace(/[\s\-–—;,]+$/i, '')
    .replace(/[.]+$/g, '')
    .trim();

  // User rule: ACC = AIR-COOLED CHILLER
  if (/^ACC$/i.test(res) || /^ACC[\s\-]+AIR[\s\-]*COOLED[\s\-]*CHILLER/i.test(res)) {
    return 'AIR-COOLED CHILLER';
  }

  // User rule: MR TPB ECS-Electro-thermal linked fire damper = thermal linked fire damper
  if (/^Electro[\s\-]+thermal\s+linked\s+fire\s+damper/i.test(res) || /^thermal\s+linked\s+fire\s+damper/i.test(res)) {
    return 'thermal linked fire damper';
  }

  // User rule: MR TPB ECS-Fusible linked fire damper = Fusible linked fire damper
  if (/^Fusible\s+linked\s+fire\s+damper/i.test(res)) {
    return 'Fusible linked fire damper';
  }

  // If what remains is purely an acronym code (e.g. "ACC-1", "ACC", "WPF"), match standard item
  if (/^[A-Z0-9]{2,6}(?:[-_]\d+)?$/i.test(res)) {
    const std = matchStandardWorkDescription(res);
    if (std) return std;
  }

  return res;
}

/**
 * Checks if a string or cell matches the target depot keyword (e.g. TWD, TMD)
 */
export function matchesDepotKeyword(text: string, targetDepotCode: string = 'TWD'): boolean {
  if (!targetDepotCode) return true;
  const upperText = text.toUpperCase();
  const upperDepot = targetDepotCode.toUpperCase().trim();

  if (upperText.includes(upperDepot)) return true;

  // Handle common typo variants like TWD <-> TMD
  if (upperDepot === 'TWD' && upperText.includes('TMD')) return true;
  if (upperDepot === 'TMD' && upperText.includes('TWD')) return true;

  return false;
}

export interface ParseExcelOptions {
  targetDepotCode?: string; // e.g. LAK, TWD, AIR
  filterByDepot?: boolean; // if true and targetDepotCode set, prefer targetDepotCode
  existingItems?: MaintenanceItem[]; // optional existing items to preserve QTYs
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Robust Location / Station Code detector
 * Detects codes like LAK, AIR, TWD from "LAK", "LAK-ECS-ACC-101", "ECS-ACC-T-LAK-1M-9", "Station - LAK", "荔景站"
 * Special attention: Priority check on the first 3 letters of ASSETNUM / identifier (e.g. LAK-ECS..., TIC-ECS...)
 */
export function detectLocationCode(rawText: string): string | null {
  if (!rawText) return null;
  const upper = rawText.toUpperCase().trim();

  // 0. User rule: Check the first 3 alphabetic characters of ASSETNUM (e.g., LAK from LAK-ECS-..., TIC from TIC-ECS-...)
  const prefixMatch = upper.match(/^([A-Z]{3})[-_\s]/);
  if (prefixMatch) {
    const candidate = prefixMatch[1];
    const matchedLoc = ALL_MTR_LOCATIONS.find((loc) => loc.code === candidate);
    if (matchedLoc) return matchedLoc.code;
    return candidate;
  }

  // 0a. Check "MR <DEPOT/STATION> " or "MR-<DEPOT/STATION>-" in ASSET.DESCRIPTION (e.g. MR HTD ECS-..., MR-CWD-..., MR-KBD-..., MR-TWD...)
  const mrMatch = upper.match(/^MR[-\s]+([A-Z0-9]{3})[-_\s]/);
  if (mrMatch) {
    const candidate = mrMatch[1];
    const matchedLoc = ALL_MTR_LOCATIONS.find((loc) => loc.code === candidate);
    if (matchedLoc) return matchedLoc.code;
    return candidate;
  }

  // 1. Exact match
  const exact = ALL_MTR_LOCATIONS.find((loc) => loc.code === upper);
  if (exact) return exact.code;

  // 2. Token or delimiter match (e.g., LAK-..., ...-LAK-..., [LAK], (LAK))
  for (const loc of ALL_MTR_LOCATIONS) {
    const code = loc.code;
    const regex = new RegExp(`(^|[-_\\s/.,;:()\\[\\]])${code}([-_\\s/.,;:()\\[\\]]|$)`, 'i');
    if (regex.test(upper)) {
      return code;
    }
  }

  // 3. Match Chinese name
  for (const loc of ALL_MTR_LOCATIONS) {
    if (loc.nameZh && upper.includes(loc.nameZh)) {
      return loc.code;
    }
  }

  return null;
}

/**
 * Intelligent Maintenance Frequency detector
 * User rule: "1) JOBPLAN.DESCRIPTION column - it belong to ECS read the 1M, 3M, 4M, 6, 1Y, 18M, 2Y, 3Y"
 * Detects 1M, 2M, 3M, 4M, 6M (or 6), 1Y (or Y), 18M, 2Y, 3Y
 */
export function detectMaintenanceFrequency(
  text: string,
  jobPlanDesc?: string,
  jpNum?: string
): {
  m?: string;
  m2?: string;
  m3?: string;
  m4?: string;
  m6?: string;
  y?: string;
  m18?: string;
  y2?: string;
  y3?: string;
} {
  const res: {
    m?: string;
    m2?: string;
    m3?: string;
    m4?: string;
    m6?: string;
    y?: string;
    m18?: string;
    y2?: string;
    y3?: string;
  } = {};

  const upperJpDesc = (jobPlanDesc || '').toUpperCase().trim();
  const upperJpNum = (jpNum || '').toUpperCase().trim();
  const upperCombined = `${upperJpDesc} ${upperJpNum} ${(text || '').toUpperCase()}`.trim();

  // 1. Primary priority: Check JOBPLAN.DESCRIPTION specifically
  // Examples:
  // "ECS CONTRACT OUT PM JOB; RYODEN; (1M CHK)" -> 1M
  // "ECS CONTRACT OUT PM JOB; RYODEN; (4M CHK)" -> 4M
  // "ECS CONTRACT OUT PM JOB; RYODEN; (6M CHK)" or "(6 CHK)" -> 6M
  // "ECS VENTILATION SYSTEM CONTRACT OUT PM JOB; REC; (1Y CHK)" -> 1Y
  // "ECS CONTRACT OUT PM JOB; RYODEN; (18M CHK)" -> 18M
  // "ECS CONTRACT OUT PM JOB; RYODEN; (2Y CHK)" -> 2Y
  // "ECS CONTRACT OUT PM JOB; RYODEN; (3Y CHK)" -> 3Y
  if (upperJpDesc) {
    // Parenthesized frequency extraction
    const parenMatch = upperJpDesc.match(/\(\s*(1M|2M|3M|4M|6M|6|1Y|Y|18M|2Y|3Y|1W)\s*(?:CHK)?/i);
    if (parenMatch) {
      const code = parenMatch[1].toUpperCase();
      if (code === '3Y') { res.y3 = '100%'; return res; }
      if (code === '2Y') { res.y2 = '100%'; return res; }
      if (code === '18M') { res.m18 = '100%'; return res; }
      if (code === '1Y' || code === 'Y') { res.y = '100%'; return res; }
      if (code === '6M' || code === '6') { res.m6 = '100%'; return res; }
      if (code === '4M') { res.m4 = '100%'; return res; }
      if (code === '3M') { res.m3 = '100%'; return res; }
      if (code === '2M') { res.m2 = '100%'; return res; }
      if (code === '1M' || code === '1W') { res.m = '100%'; return res; }
    }

    // Direct token search in JOBPLAN.DESCRIPTION
    if (/\b3Y\b|36M|-3Y-|-36M-|\b3-?YEAR\b/i.test(upperJpDesc)) {
      res.y3 = '100%'; return res;
    }
    if (/\b2Y\b|24M|-2Y-|-24M-|\b2-?YEAR\b/i.test(upperJpDesc)) {
      res.y2 = '100%'; return res;
    }
    if (/\b18M\b|-18M-|\b18-?MONTH\b/i.test(upperJpDesc)) {
      res.m18 = '100%'; return res;
    }
    if (/\b(1Y|Y)\b|12M|-1Y-|-12M-|\bANNUAL\b|\bYEARLY\b|\b1-?YEAR\b/i.test(upperJpDesc)) {
      res.y = '100%'; return res;
    }
    if (/\b6M\b|-6M-|\b6\s*CHK\b|\b6\s*MONTH\b|\bHALF YEAR\b|\bSEMI[- ]ANNUAL\b/i.test(upperJpDesc)) {
      res.m6 = '100%'; return res;
    }
    if (/\b4M\b|-4M-|\b4-?MONTH\b/i.test(upperJpDesc)) {
      res.m4 = '100%'; return res;
    }
    if (/\b3M\b|-3M-|\bQUARTERLY\b|\b3-?MONTH\b/i.test(upperJpDesc)) {
      res.m3 = '100%'; return res;
    }
    if (/\b2M\b|-2M-|\bBI[- ]MONTHLY\b|\b2-?MONTH\b|\b10W\b/i.test(upperJpDesc)) {
      res.m2 = '100%'; return res;
    }
    if (/\b(1M|1W)\b|-1M-|\bMONTHLY\b|\b1-?MONTH\b|\b1M\s*CHK\b/i.test(upperJpDesc)) {
      res.m = '100%'; return res;
    }
  }

  // 2. Secondary priority: Check JOBPLAN.JPNUM (e.g., ECSRYHTD-1M-1, ECSRYHTD-1Y-1, ECSRYHTD-4M-1, ECSRYHTD-6M-1)
  if (upperJpNum) {
    if (/-3Y-|\b3Y\b/.test(upperJpNum)) { res.y3 = '100%'; return res; }
    if (/-2Y-|\b2Y\b/.test(upperJpNum)) { res.y2 = '100%'; return res; }
    if (/-18M-|\b18M\b/.test(upperJpNum)) { res.m18 = '100%'; return res; }
    if (/-1Y-|\b1Y\b|-12M-/.test(upperJpNum)) { res.y = '100%'; return res; }
    if (/-6M-|\b6M\b/.test(upperJpNum)) { res.m6 = '100%'; return res; }
    if (/-4M-|\b4M\b/.test(upperJpNum)) { res.m4 = '100%'; return res; }
    if (/-3M-|\b3M\b/.test(upperJpNum)) { res.m3 = '100%'; return res; }
    if (/-2M-|\b2M\b/.test(upperJpNum)) { res.m2 = '100%'; return res; }
    if (/-1M-|\b1M\b|-1W-/.test(upperJpNum)) { res.m = '100%'; return res; }
  }

  // 3. Fallback: Check combined description text
  if (/\b3Y\b|36M|-3Y-|-36M-|\b3-?YEAR\b/i.test(upperCombined)) {
    res.y3 = '100%';
  } else if (/\b2Y\b|24M|-2Y-|-24M-|\b2-?YEAR\b/i.test(upperCombined)) {
    res.y2 = '100%';
  } else if (/\b18M\b|-18M-|\b18-?MONTH\b/i.test(upperCombined)) {
    res.m18 = '100%';
  } else if (/\b(1Y|Y)\b|12M|-1Y-|-12M-|\bANNUAL\b|\bYEARLY\b|\b1-?YEAR\b/i.test(upperCombined)) {
    res.y = '100%';
  } else if (/\b6M\b|-6M-|\b6\s*CHK\b|\bHALF YEAR\b|\bSEMI[- ]ANNUAL\b|\b6-?MONTH\b/i.test(upperCombined)) {
    res.m6 = '100%';
  } else if (/\b4M\b|-4M-|\b4-?MONTH\b/i.test(upperCombined)) {
    res.m4 = '100%';
  } else if (/\b3M\b|-3M-|\bQUARTERLY\b|\b3-?MONTH\b/i.test(upperCombined)) {
    res.m3 = '100%';
  } else if (/\b2M\b|-2M-|\bBI[- ]MONTHLY\b|\b2-?MONTH\b/i.test(upperCombined)) {
    res.m2 = '100%';
  } else if (/\b10W\b|-10W-|\b10-?WEEK\b/i.test(upperCombined)) {
    res.m2 = '100%';
  } else if (/\b(1M|1W)\b|-1M-|\bMONTHLY\b|\b1-?MONTH\b|\bM\b/i.test(upperCombined)) {
    res.m = '100%';
  }

  return res;
}

/**
 * Extracts Month and Year from dates (e.g. 2026-09-01, 2026/09/30, 46266, "September - 2026")
 */
export function extractMonthYear(cellVal: any): string | null {
  if (cellVal === null || cellVal === undefined || cellVal === '') return null;

  if (typeof cellVal === 'number') {
    if (cellVal > 25000 && cellVal < 70000) {
      const utcDays = Math.floor(cellVal - 25569);
      const date = new Date(utcDays * 86400 * 1000);
      if (!isNaN(date.getTime())) {
        return `${MONTH_NAMES[date.getUTCMonth()]} - ${date.getUTCFullYear()}`;
      }
    }
  }

  const str = String(cellVal).trim();

  // YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const isoMatch = str.match(/(\d{4})[-/.](\d{1,2})[-/.]\d{1,2}/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = parseInt(isoMatch[2], 10);
    if (m >= 1 && m <= 12) {
      return `${MONTH_NAMES[m - 1]} - ${y}`;
    }
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/\d{1,2}[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const y = dmyMatch[2];
    const m = parseInt(dmyMatch[1], 10);
    if (m >= 1 && m <= 12) {
      return `${MONTH_NAMES[m - 1]} - ${y}`;
    }
  }

  // e.g. "September - 2026" or "September 2026"
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    const mName = MONTH_NAMES[i];
    const shortMName = mName.slice(0, 3);
    const regex = new RegExp(`\\b(${mName}|${shortMName})\\s*[-/]?\\s*(\\d{4})\\b`, 'i');
    const match = str.match(regex);
    if (match) {
      return `${mName} - ${match[2]}`;
    }
  }

  return null;
}

export function cleanWorkDescription(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText
    // Remove "TH; " or "TH: " prefix
    .replace(/^\s*TH\s*[:;,\-]\s*/i, '')
    // Remove frequency prefix like "1M;", "10W;", "1W;", "2M;", "1Y;"
    .replace(/^\s*\d+\s*[MWYD]\s*[:;,\-]\s*/i, '')
    // Remove acronym tag like "ACC;", "AHU;", "COT;", "ECL;", "FCU;", "PHX;", "PHE;", "SCWP;", "INS;", "WCC;", "AIRC;", "ORP;", "CYN;"
    .replace(/^\s*[A-Z0-9]{2,6}\s*[:;,\-]\s*/i, '')
    // Remove secondary frequency prefix if present (e.g. "TH; 1M; ...")
    .replace(/^\s*\d+\s*[MWYD]\s*[:;,\-]\s*/i, '')
    // Remove trailing contractor tags
    .replace(/[;,\-]\s*by\s+contractor\s*$/i, '')
    .replace(/[;,\-]\s*contractor\s*$/i, '')
    // Remove trailing location or system tags like "; TML", "; TML [COP]", "[COP]"
    .replace(/[;,\-]\s*TML\b/gi, '')
    .replace(/\[\s*COP\s*\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If after cleaning it matches standard list, use standard
  const matched = matchStandardWorkDescription(cleaned);
  if (matched && matched !== cleaned) {
    return matched;
  }

  return cleaned || rawText.trim();
}

const DEFAULT_QTY_MAP: Record<string, string> = {
  'Air Handling Unit /Primary Air Handling Unit': '21',
  'Fan Coil Unit': '109',
  'Air Cooled Chiller': '6',
  'AIR-COOLED CHILLER': '6',
  'Chilled Water Pump': '8',
  'Washable Panel Filter': '189',
  'Chem. Dosing Unit': '3',
  'Motor Control Centre': '2',
  'Motor Control Panel': '9',
  'Differential By-pass Valve & Control': '3',
  'Disposal Bag Filter': '62',
  'Chemical Feed Tank': '3',
  'F & E Tank': '2',
  'Make Up Water Tank': '1',
  'Metering Pump': '4',
  'Presurization Unit': '3',
  'Pipework': '1 lot',
  'Motorised Operated Valve': '21',
  'Valve': '1 lot',
  'Sensor': '1 lot',
  'Flexible Connection': '1 lot',
  'Pipework Insulation': '1 lot',
  'thermal linked fire damper': '1',
  'Fusible linked fire damper': '1',
};

export interface MatchedItemSummary {
  workDescription: string;
  count: number;
  wos: string[];
  frequency: string;
}

export interface ParsedTableResult extends Partial<MaintenanceReportData> {
  detectedLocation?: string;
  detectedMonthYear?: string;
  totalWoReadCount: number;
  matchedItemsSummary: MatchedItemSummary[];
  reportsByStationMap?: Record<string, Partial<MaintenanceReportData>>;
}

/**
 * Universal Table Rows Parser
 * Supports both standard MTR maintenance report tables and raw Maximo work order exports:
 * Columns: Workgroup | WONUM | ASSETNUM | TARGSTARTDA | TARGCOMPDAT | DESCRIPTION | JPNUM | LOCATION | STATUS ...
 */
export function parseGenericTableRows(
  jsonRows: any[][],
  options: ParseExcelOptions = {}
): ParsedTableResult {
  if (!jsonRows || jsonRows.length === 0) {
    throw new Error('表格內沒有任何資料列');
  }

  let globalReportMonthYear = '';
  let globalDepotCode = '';
  let globalContractNo = 'M1202-19E';
  let globalPreparedByName = 'Lee Siu Keung (15224)';
  let globalPreparedByDate = '';

  // 1. Scan metadata in first 20 rows (in case standard header exists)
  for (let i = 0; i < Math.min(jsonRows.length, 20); i++) {
    const rowStr = jsonRows[i].map((c) => String(c || '')).join(' ');

    const detectedMonth = extractMonthYear(rowStr);
    if (detectedMonth && !globalReportMonthYear) {
      globalReportMonthYear = detectedMonth;
    }

    if (rowStr.includes('MTRC Depot') || rowStr.includes('MTRC Station') || rowStr.includes('MTRC OCC')) {
      const match = rowStr.match(/(MTRC\s+(?:Depot|Station|OCC)\s*-\s*[A-Z0-9]+)/i);
      if (match) {
        const codeMatch = match[1].match(/-\s*([A-Z0-9]+)/i);
        if (codeMatch) globalDepotCode = codeMatch[1].toUpperCase();
      }
    }

    if (rowStr.includes('Contract No.') || rowStr.includes('Contract')) {
      const match = rowStr.match(/Contract\s*(?:No\.?)?\s*:\s*([A-Z0-9\-]+)/i);
      if (match) globalContractNo = match[1];
    }

    if (rowStr.includes('Prepared by') || rowStr.includes('Lee Siu Keung')) {
      const matchName = rowStr.match(/(?:Name\s*&\s*Staff\s*No\.?\s*:?\s*)([^\r\n_]+)/i);
      if (matchName) globalPreparedByName = matchName[1].trim();
    }
  }

  // 2. Identify header row index
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(jsonRows.length, 30); i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0) continue;
    const rowCells = row.map((c) => String(c || '').trim().toUpperCase());
    const rowStr = rowCells.join(' ');

    if (
      rowCells.includes('WONUM') ||
      rowCells.includes('WO_WONUM') ||
      rowCells.includes('ASSETNUM') ||
      rowCells.includes('ASSET.ASSETNUM') ||
      rowCells.includes('DESCRIPTION') ||
      rowCells.includes('ASSET.DESCRIPTION') ||
      rowCells.includes('ASSET_DESCRIPTION') ||
      rowCells.includes('WORK DESCRIPTION') ||
      rowCells.includes('PM W/O') ||
      (rowStr.includes('WONUM') && rowStr.includes('DESCRIPTION')) ||
      (rowStr.includes('WO_WONUM') && (rowStr.includes('DESCRIPTION') || rowStr.includes('ASSET'))) ||
      (rowStr.includes('WORKGROUP') && rowStr.includes('ASSETNUM'))
    ) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) {
    headerRowIndex = 0;
  }

  const rawHeader = jsonRows[headerRowIndex] || [];
  const header = rawHeader.map((c) => String(c || '').trim().toUpperCase());

  // Rule: WO_WONUM = WONUM
  let woNumIdx = header.findIndex(
    (h) => h === 'WO_WONUM' || h === 'WO-WONUM' || h === 'WO.WONUM' || h.replace(/[^A-Z0-9]/g, '') === 'WOWONUM'
  );
  if (woNumIdx === -1) {
    woNumIdx = header.findIndex((h) => h === 'WONUM' || h.replace(/[^A-Z0-9]/g, '') === 'WONUM');
  }
  if (woNumIdx === -1) {
    woNumIdx = header.findIndex((h) =>
      h.includes('WO_WONUM') ||
      h.includes('WONUM') ||
      h.includes('WO NUMBER') ||
      h === 'W/O' ||
      h === 'PM W/O' ||
      h.includes('工單') ||
      h.includes('WORK ORDER')
    );
  }

  // ASSETNUM / ASSET.ASSETNUM
  let assetNumIdx = header.findIndex(
    (h) => h === 'ASSET.ASSETNUM' || h === 'ASSET_ASSETNUM' || h === 'ASSET ASSETNUM'
  );
  if (assetNumIdx === -1) {
    assetNumIdx = header.findIndex((h) => h === 'ASSETNUM' || h.replace(/[^A-Z0-9]/g, '') === 'ASSETNUM');
  }
  if (assetNumIdx === -1) {
    assetNumIdx = header.findIndex((h) =>
      h.includes('ASSET.ASSETNUM') ||
      h.includes('ASSETNUM') ||
      h.includes('ASSET NUMBER') ||
      h === 'ASSET'
    );
  }

  // Rule: ASSET.DESCRIPTION = DESCRIPTION
  // Specifically map ASSET.DESCRIPTION as the primary equipment description column
  const assetDescIdx = header.findIndex(
    (h) =>
      h === 'ASSET.DESCRIPTION' ||
      h === 'ASSET_DESCRIPTION' ||
      h === 'ASSET DESCRIPTION' ||
      h.includes('ASSET.DESCRIPTION') ||
      h.includes('ASSET_DESCRIPTION') ||
      (h.startsWith('ASSET') && h.includes('DESC'))
  );

  // Rule: JOBPLAN.DESCRIPTION for maintenance frequency detection (1M, 3M, 4M, 6, 1Y, 18M, 2Y, 3Y)
  const jobPlanDescIdx = header.findIndex(
    (h) =>
      h === 'JOBPLAN.DESCRIPTION' ||
      h === 'JOBPLAN_DESCRIPTION' ||
      h === 'JOBPLAN DESCRIPTION' ||
      h === 'JOB PLAN DESCRIPTION' ||
      (h.includes('JOBPLAN') && h.includes('DESC')) ||
      (h.includes('JOB PLAN') && h.includes('DESC'))
  );

  // WORKORDER.DESCRIPTION
  const workOrderDescIdx = header.findIndex(
    (h) =>
      h === 'WORKORDER.DESCRIPTION' ||
      h === 'WORKORDER_DESCRIPTION' ||
      h === 'WORKORDER DESCRIPTION' ||
      h === 'WORK ORDER DESCRIPTION' ||
      (h.includes('WORKORDER') && h.includes('DESC')) ||
      (h.includes('WORK ORDER') && h.includes('DESC'))
  );

  const generalDescIdx = header.findIndex(
    (h, idx) =>
      idx !== assetDescIdx &&
      idx !== jobPlanDescIdx &&
      idx !== workOrderDescIdx &&
      (h === 'DESCRIPTION' ||
        h === 'WORK DESCRIPTION' ||
        h === 'WORK DESC' ||
        h.includes('WORK DESCRIPTION') ||
        h.includes('DESCRIPTION') ||
        h === 'DESC' ||
        h.includes('項目'))
  );

  // If ASSET.DESCRIPTION is found, it is mapped directly to DESCRIPTION
  const descIdx = assetDescIdx !== -1 ? assetDescIdx : (generalDescIdx !== -1 ? generalDescIdx : workOrderDescIdx);

  const jpNumIdx = header.findIndex((h) =>
    h === 'JOBPLAN.JPNUM' ||
    h === 'JOBPLAN_JPNUM' ||
    h === 'JOBPLAN JPNUM' ||
    h === 'JOBPLAN' ||
    h === 'JPNUM' ||
    h.includes('JP_NUM') ||
    h.includes('JOB PLAN') ||
    h.includes('JPNUM')
  );

  const locIdx = header.findIndex((h) =>
    h === 'LOCATION' ||
    h === 'LOC' ||
    h === 'STATION' ||
    h.includes('STATION') ||
    h.includes('LOCATION') ||
    h.includes('車站') ||
    h.includes('站點') ||
    h.includes('車廠') ||
    h === 'DEPOT' ||
    h === 'SITE'
  );

  const targStartIdx = header.findIndex((h) =>
    h.includes('TARGSTART') ||
    h.includes('START DATE') ||
    h.includes('SCHEDSTAR') ||
    h.includes('STARTDA') ||
    h.includes('START')
  );

  const targCompIdx = header.findIndex((h) =>
    h.includes('TARGCOMP') ||
    h.includes('COMP DATE') ||
    h.includes('SCHEDFINISH') ||
    h.includes('COMPDAT') ||
    h.includes('COMPLETION')
  );

  const qtyIdx = header.findIndex((h) =>
    h.includes('QTY') ||
    h.includes('QUANTITY') ||
    h.includes('數量')
  );

  const mIdx = header.findIndex((h) => h === 'M' || h === '1M');
  const m2Idx = header.findIndex((h) => h === '2M');
  const m3Idx = header.findIndex((h) => h === '3M');
  const m4Idx = header.findIndex((h) => h === '4M');
  const m6Idx = header.findIndex((h) => h === '6M');
  const yIdx = header.findIndex((h) => h === 'Y' || h === '1Y');
  const y2Idx = header.findIndex((h) => h === '2Y');

  // Determine target station: from options, or scanned header, default 'LAK'
  let targetStation = (options.targetDepotCode || globalDepotCode || '').toUpperCase().trim();

  // If not yet determined, look ahead in data rows to find the first valid station code
  if (!targetStation) {
    for (let r = headerRowIndex + 1; r < jsonRows.length; r++) {
      const row = jsonRows[r];
      if (!row || row.length === 0) continue;
      const locVal = locIdx !== -1 ? String(row[locIdx] || '').trim() : '';
      const assetNumVal = assetNumIdx !== -1 ? String(row[assetNumIdx] || '').trim() : '';
      const jpNumVal = jpNumIdx !== -1 ? String(row[jpNumIdx] || '').trim() : '';
      const descVal = descIdx !== -1 ? String(row[descIdx] || '').trim() : '';

      // Lookahead priority: Check ASSETNUM first 3 letters, then locVal, etc.
      const detected =
        detectLocationCode(assetNumVal) ||
        detectLocationCode(locVal) ||
        detectLocationCode(jpNumVal) ||
        detectLocationCode(descVal);

      if (detected) {
        targetStation = detected.toUpperCase();
        break;
      }
    }
  }

  if (!targetStation) {
    targetStation = 'LAK';
  }

  let totalWoReadCount = 0;
  const parsedItems: MaintenanceItem[] = [];
  const summaryMap = new Map<string, { count: number; wos: string[]; frequency: string }>();
  const stationItemsMap: Record<string, MaintenanceItem[]> = {};

  // 3. Process data rows: STRICTLY filter by target station and enforce:
  // - QTY = 1 forever
  // - Station = targetStation (e.g. LAK)
  // - PM W/O = WONUM
  // - WORK DESCRIPTION = matched equipment description (e.g. Air Cooled Chiller)
  // - ONLY show items present in the user's Excel (other station / unmentioned items ignored)
  for (let r = headerRowIndex + 1; r < jsonRows.length; r++) {
    const row = jsonRows[r];
    if (!row || row.length === 0) continue;

    const rowText = row.map((c) => String(c || '').trim()).join(' ');
    const trimmedRowText = rowText.trim();
    if (
      /overall\s*total/i.test(trimmedRowText) ||
      /prepared\s*by/i.test(trimmedRowText) ||
      /verified\s*by/i.test(trimmedRowText) ||
      /endorsed\s*by/i.test(trimmedRowText) ||
      /^count\s*[:：]/i.test(trimmedRowText) ||
      /^total\s*[:：]/i.test(trimmedRowText) ||
      /^records?\s*[:：]/i.test(trimmedRowText) ||
      /^\d+\s*-\s*\d+\s*of\s*\d+/i.test(trimmedRowText)
    ) {
      break;
    }

    const woNumVal = woNumIdx !== -1 ? String(row[woNumIdx] || '').trim() : '';
    const assetNumVal = assetNumIdx !== -1 ? String(row[assetNumIdx] || '').trim() : '';

    // ASSET.DESCRIPTION = DESCRIPTION mapping:
    // If ASSET.DESCRIPTION exists, use it as the main description
    const assetDescVal = assetDescIdx !== -1 ? String(row[assetDescIdx] || '').trim() : '';
    const jobPlanDescVal = jobPlanDescIdx !== -1 ? String(row[jobPlanDescIdx] || '').trim() : '';
    const workOrderDescVal = workOrderDescIdx !== -1 ? String(row[workOrderDescIdx] || '').trim() : '';
    const generalDescVal = generalDescIdx !== -1 ? String(row[generalDescIdx] || '').trim() : '';
    const descVal = assetDescVal || generalDescVal || workOrderDescVal || (descIdx !== -1 ? String(row[descIdx] || '').trim() : '');

    const jpNumVal = jpNumIdx !== -1 ? String(row[jpNumIdx] || '').trim() : '';
    const locVal = locIdx !== -1 ? String(row[locIdx] || '').trim() : '';
    const startVal = targStartIdx !== -1 ? row[targStartIdx] : '';
    const compVal = targCompIdx !== -1 ? row[targCompIdx] : '';

    // Extract month and year from dates if not yet found
    if (!globalReportMonthYear) {
      const parsedMonth = extractMonthYear(startVal) || extractMonthYear(compVal);
      if (parsedMonth) {
        globalReportMonthYear = parsedMonth;
      }
    }

    // Detect station code for this row:
    // USER RULE: First check ASSETNUM first 3 letters (e.g. LAK from LAK-ECS-ACC-101, TIC from TIC-ECS-PHE-001)
    const rowStn = (
      detectLocationCode(assetNumVal) ||
      detectLocationCode(locVal) ||
      detectLocationCode(jpNumVal) ||
      detectLocationCode(assetDescVal) ||
      detectLocationCode(descVal) ||
      ''
    ).toUpperCase();

    // Determine which station this item belongs to
    const itemStation = rowStn || targetStation;

    // Identify WO identifier: WO_WONUM = WONUM
    const wonum = woNumVal || assetNumVal;
    // Strict requirement: A valid maintenance item MUST have a work order or asset number!
    if (!wonum || !wonum.trim()) {
      continue;
    }

    // Skip summary footer rows that might appear in the wonum column
    if (/^count\s*[:：]?\s*\d*$/i.test(wonum) || /^total/i.test(wonum)) {
      continue;
    }

    // User rule: ASSET.DESCRIPTION column - read inside the meaning work, belong to MTR job maintenance
    // such as "MR HTD ECS-AIR HANDLING UNIT ALL" -> "AIR HANDLING UNIT"
    // "MR HTD ECS-Electro-thermal linked fire damper - ALL" -> "Electro-thermal linked fire damper"
    let workDescription = '';
    if (assetDescVal) {
      workDescription = extractMeaningfulAssetWork(assetDescVal);
    }

    if (!workDescription && (descVal || generalDescVal || workOrderDescVal)) {
      const stdDesc =
        matchStandardWorkDescription(descVal) ||
        matchStandardWorkDescription(generalDescVal) ||
        matchStandardWorkDescription(workOrderDescVal);
      workDescription = stdDesc || cleanWorkDescription(descVal || generalDescVal || workOrderDescVal);
    }

    if (!workDescription && assetNumVal) {
      const std = matchStandardWorkDescription(assetNumVal);
      if (std) workDescription = std;
    }

    // Never set 'Air Cooled Chiller' as fallback default answer!
    if (!workDescription) {
      const fallback = cleanWorkDescription(descVal || generalDescVal || workOrderDescVal || assetDescVal || wonum);
      workDescription = fallback || 'Maintenance Item';
    }

    // User rule: JOBPLAN.DESCRIPTION column - it belong to ECS read the 1M, 3M, 4M, 6, 1Y, 18M, 2Y, 3Y
    const detectedFreq = detectMaintenanceFrequency(
      `${generalDescVal} ${workOrderDescVal} ${descVal} ${assetDescVal}`,
      jobPlanDescVal,
      jpNumVal
    );

    // If explicit columns exist in row (e.g. M, 2M, 3M, etc.), override
    if (mIdx !== -1 && row[mIdx]) detectedFreq.m = String(row[mIdx]).trim();
    if (m2Idx !== -1 && row[m2Idx]) detectedFreq.m2 = String(row[m2Idx]).trim();
    if (m3Idx !== -1 && row[m3Idx]) detectedFreq.m3 = String(row[m3Idx]).trim();
    if (m4Idx !== -1 && row[m4Idx]) detectedFreq.m4 = String(row[m4Idx]).trim();
    if (m6Idx !== -1 && row[m6Idx]) detectedFreq.m6 = String(row[m6Idx]).trim();
    if (yIdx !== -1 && row[yIdx]) detectedFreq.y = String(row[yIdx]).trim();
    if (y2Idx !== -1 && row[y2Idx]) detectedFreq.y2 = String(row[y2Idx]).trim();

    const hasSpecificFreq = Boolean(
      detectedFreq.m ||
      detectedFreq.m2 ||
      detectedFreq.m3 ||
      detectedFreq.m4 ||
      detectedFreq.m6 ||
      detectedFreq.y ||
      detectedFreq.m18 ||
      detectedFreq.y2 ||
      detectedFreq.y3
    );

    // Default to '100%' under M if no other frequency was found
    const finalM = detectedFreq.m || (!hasSpecificFreq ? '100%' : '');

    // Collect into station-specific map
    if (!stationItemsMap[itemStation]) {
      stationItemsMap[itemStation] = [];
    }

    const itemIndex = stationItemsMap[itemStation].length + 1;
    const item: MaintenanceItem = {
      id: `item-${itemStation}-${itemIndex}`,
      station: itemStation,
      workDescription, // cleaned meaningful description
      pmWo: wonum, // PM W/O = WONUM
      qty: '1', // QTY=1 forever
      m: finalM,
      m2: detectedFreq.m2 || '',
      m3: detectedFreq.m3 || '',
      m4: detectedFreq.m4 || '',
      m6: detectedFreq.m6 || '',
      y: detectedFreq.y || '',
      m18: detectedFreq.m18 || '',
      y2: detectedFreq.y2 || '',
      y3: detectedFreq.y3 || '',
      subEntries: [
        {
          id: `sub-${itemStation}-${itemIndex}-1`,
          pmWo: wonum,
          m: finalM,
          m2: detectedFreq.m2 || '',
          m3: detectedFreq.m3 || '',
          m4: detectedFreq.m4 || '',
          m6: detectedFreq.m6 || '',
          y: detectedFreq.y || '',
          m18: detectedFreq.m18 || '',
          y2: detectedFreq.y2 || '',
          y3: detectedFreq.y3 || '',
        },
      ],
    };

    stationItemsMap[itemStation].push(item);

    // If targetStation matches or not specified, add to primary parsedItems
    if (!targetStation || itemStation === targetStation) {
      parsedItems.push(item);
      totalWoReadCount++;

      // Summary tracking
      if (!summaryMap.has(workDescription)) {
        const freqLabel = finalM
          ? '1M'
          : detectedFreq.m3
          ? '3M'
          : detectedFreq.m4
          ? '4M'
          : detectedFreq.m6
          ? '6M'
          : detectedFreq.y
          ? '1Y'
          : detectedFreq.m18
          ? '18M'
          : detectedFreq.y2
          ? '2Y'
          : detectedFreq.y3
          ? '3Y'
          : detectedFreq.m2
          ? '2M'
          : '1M';
        summaryMap.set(workDescription, {
          count: 0,
          wos: [],
          frequency: freqLabel,
        });
      }
      const sumEntry = summaryMap.get(workDescription)!;
      sumEntry.count++;
      if (wonum) sumEntry.wos.push(wonum);
    }
  }

  const allSummaries: MatchedItemSummary[] = Array.from(summaryMap.entries()).map(([desc, data]) => ({
    workDescription: desc,
    count: data.count,
    wos: data.wos,
    frequency: data.frequency,
  }));

  // Overall totals calculated dynamically from parsed items
  const overallTotals = {
    pmWoTotal: '',
    qtyTotal: String(parsedItems.length),
    mTotal: String(parsedItems.filter((i) => i.m && i.m.trim() !== '').length || (parsedItems.length ? '100%' : '')),
    m2Total: String(parsedItems.filter((i) => i.m2 && i.m2.trim() !== '').length || ''),
    m3Total: String(parsedItems.filter((i) => i.m3 && i.m3.trim() !== '').length || ''),
    m4Total: String(parsedItems.filter((i) => i.m4 && i.m4.trim() !== '').length || ''),
    m6Total: String(parsedItems.filter((i) => i.m6 && i.m6.trim() !== '').length || ''),
    yTotal: String(parsedItems.filter((i) => i.y && i.y.trim() !== '').length || ''),
    m18Total: String(parsedItems.filter((i) => i.m18 && i.m18.trim() !== '').length || ''),
    y2Total: String(parsedItems.filter((i) => i.y2 && i.y2.trim() !== '').length || ''),
    y3Total: String(parsedItems.filter((i) => i.y3 && i.y3.trim() !== '').length || ''),
  };

  const primaryReport: Partial<MaintenanceReportData> = {
    depotCode: targetStation,
    depotTitle: getLocationTitle(targetStation),
    reportMonthYear: globalReportMonthYear || 'September - 2026',
    contractNo: globalContractNo,
    items: parsedItems,
    overallTotals,
    signatories: {
      preparedByName: globalPreparedByName,
      preparedByDate: globalPreparedByDate,
      verifiedByName: '',
      verifiedByDate: '',
      endorsedByName: '',
      endorsedByDate: '',
    },
  };

  // Build reportsByStationMap for ALL stations discovered in the file!
  const reportsByStationMap: Record<string, Partial<MaintenanceReportData>> = {};
  Object.entries(stationItemsMap).forEach(([stn, stnItems]) => {
    reportsByStationMap[stn] = {
      depotCode: stn,
      depotTitle: getLocationTitle(stn),
      reportMonthYear: globalReportMonthYear || 'September - 2026',
      contractNo: globalContractNo,
      items: stnItems,
      overallTotals: {
        pmWoTotal: '',
        qtyTotal: String(stnItems.length),
        mTotal: String(stnItems.filter((i) => i.m && i.m.trim() !== '').length || (stnItems.length ? '100%' : '')),
        m2Total: String(stnItems.filter((i) => i.m2 && i.m2.trim() !== '').length || ''),
        m3Total: String(stnItems.filter((i) => i.m3 && i.m3.trim() !== '').length || ''),
        m4Total: String(stnItems.filter((i) => i.m4 && i.m4.trim() !== '').length || ''),
        m6Total: String(stnItems.filter((i) => i.m6 && i.m6.trim() !== '').length || ''),
        yTotal: String(stnItems.filter((i) => i.y && i.y.trim() !== '').length || ''),
        m18Total: String(stnItems.filter((i) => i.m18 && i.m18.trim() !== '').length || ''),
        y2Total: String(stnItems.filter((i) => i.y2 && i.y2.trim() !== '').length || ''),
        y3Total: String(stnItems.filter((i) => i.y3 && i.y3.trim() !== '').length || ''),
      },
      signatories: {
        preparedByName: globalPreparedByName,
        preparedByDate: globalPreparedByDate,
        verifiedByName: '',
        verifiedByDate: '',
        endorsedByName: '',
        endorsedByDate: '',
      },
    };
  });
  if (!reportsByStationMap[targetStation]) {
    reportsByStationMap[targetStation] = primaryReport;
  }

  return {
    ...primaryReport,
    detectedLocation: targetStation,
    detectedMonthYear: globalReportMonthYear || 'September - 2026',
    totalWoReadCount,
    matchedItemsSummary: allSummaries,
    reportsByStationMap,
  };
}

/**
 * Intelligent Text/TSV/Clipboard table parser
 * Reads data copied directly from Excel, CSV, or Maximo tables
 */
export function parsePastedText(
  text: string,
  options: ParseExcelOptions = {}
): ParsedTableResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) {
    throw new Error('貼上的內容為空，請複製 Excel 或 Maximo 表格資料後再試');
  }

  const hasTabs = lines.some((l) => l.includes('\t'));
  const hasCommas = !hasTabs && lines.some((l) => l.includes(','));

  const jsonRows: any[][] = lines.map((line) => {
    if (hasTabs) {
      return line.split('\t').map((c) => c.trim());
    } else if (hasCommas) {
      return line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    } else if (line.includes('|')) {
      return line.split('|').map((c) => c.trim()).filter((c) => c !== '');
    } else {
      return line.split(/\s{2,}/).map((c) => c.trim());
    }
  });

  return parseGenericTableRows(jsonRows, options);
}

/**
 * Fast & Safe Excel reader using ExcelJS
 * Unlike SheetJS, ExcelJS parses OpenXML via streaming/iterative parsing
 * and completely avoids "Maximum call stack size exceeded" errors on .xlsx files.
 */
async function parseWithExcelJS(
  arrayBuffer: ArrayBuffer,
  targetDepotCode?: string
): Promise<{ jsonRows: any[][]; sheetName: string; allSheetsData: Record<string, any[][]> }> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  if (!workbook.worksheets || workbook.worksheets.length === 0) {
    throw new Error('Excel 檔案內沒有發現工作表 (Worksheet)');
  }

  const allSheetsData: Record<string, any[][]> = {};
  const cleanTarget = (targetDepotCode || '').toUpperCase().trim();
  let matchedSheet = workbook.worksheets[0];

  for (const ws of workbook.worksheets) {
    const sheetRows: any[][] = [];
    ws.eachRow({ includeEmpty: false }, (row) => {
      const rawVals = Array.isArray(row.values) ? row.values.slice(1) : [];
      const cells = rawVals.map((val: any) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
          if ('result' in val && val.result !== undefined && val.result !== null) return String(val.result).trim();
          if ('text' in val && val.text !== undefined && val.text !== null) return String(val.text).trim();
          if ('richText' in val && Array.isArray(val.richText)) {
            return val.richText.map((t: any) => t.text || '').join('').trim();
          }
        }
        if (val instanceof Date) {
          const y = val.getFullYear();
          const m = String(val.getMonth() + 1).padStart(2, '0');
          const d = String(val.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
        }
        return String(val).trim();
      });

      if (cells.some((c) => c !== '')) {
        sheetRows.push(cells);
      }
    });

    allSheetsData[ws.name] = sheetRows;

    const upperSheet = ws.name.toUpperCase();
    if (cleanTarget && (upperSheet === cleanTarget || upperSheet.includes(cleanTarget))) {
      matchedSheet = ws;
    }
  }

  // If the matchedSheet has no rows, fallback to first non-empty sheet
  if ((allSheetsData[matchedSheet.name] || []).length === 0) {
    for (const ws of workbook.worksheets) {
      if ((allSheetsData[ws.name] || []).length > 0) {
        matchedSheet = ws;
        break;
      }
    }
  }

  return {
    jsonRows: allSheetsData[matchedSheet.name] || [],
    sheetName: matchedSheet.name,
    allSheetsData,
  };
}

/**
 * Fallback parser using SheetJS with defensive options to avoid call stack overflow
 */
function parseWithSheetJS(
  data: Uint8Array | ArrayBuffer | string,
  type: 'array' | 'binary' | 'buffer',
  targetDepotCode?: string
): { jsonRows: any[][]; sheetName: string; allSheetsData: Record<string, any[][]> } {
  const workbook = XLSX.read(data, {
    type: type as any,
    dense: true, // Use 2D array representation internally - saves memory and avoids object property recursion
    cellDates: true,
    cellFormula: false,
    cellHTML: false,
    cellText: false,
  });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Excel 檔案內沒有發現工作表');
  }

  const cleanTarget = (targetDepotCode || '').toUpperCase().trim();
  let matchedSheetName = workbook.SheetNames[0];

  const allSheetsData: Record<string, any[][]> = {};
  for (const sName of workbook.SheetNames) {
    const ws = workbook.Sheets[sName];
    if (ws) {
      const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      allSheetsData[sName] = rows;
      const upper = sName.toUpperCase();
      if (cleanTarget && (upper === cleanTarget || upper.includes(cleanTarget))) {
        matchedSheetName = sName;
      }
    }
  }

  return {
    jsonRows: allSheetsData[matchedSheetName] || [],
    sheetName: matchedSheetName,
    allSheetsData,
  };
}

/**
 * Intelligent Multi-Engine Excel file parser for MTR Maintenance List
 * Primary engine: ExcelJS (robust, avoids browser stack overflow)
 * Fallback engine: SheetJS (with dense array and binary string safety modes)
 */
export async function parseExcelFile(
  file: File,
  options: ParseExcelOptions = {}
): Promise<ParsedTableResult> {
  const arrayBuffer = await file.arrayBuffer();

  let extractedData: {
    jsonRows: any[][];
    sheetName: string;
    allSheetsData: Record<string, any[][]>;
  } | null = null;

  // Strategy 1: ExcelJS (Primary, immune to call stack overflow on OpenXML .xlsx)
  try {
    extractedData = await parseWithExcelJS(arrayBuffer, options.targetDepotCode);
  } catch (excelJsError: any) {
    console.warn('ExcelJS parsing failed or non-xlsx format, attempting SheetJS fallback:', excelJsError);
  }

  // Strategy 2: SheetJS with binary string or dense array (For .xls / .xlml / older formats)
  if (!extractedData || !extractedData.jsonRows || extractedData.jsonRows.length === 0) {
    try {
      const uint8 = new Uint8Array(arrayBuffer);
      extractedData = parseWithSheetJS(uint8, 'array', options.targetDepotCode);
    } catch (sheetJsError: any) {
      console.warn('SheetJS array read failed, attempting chunked binary string fallback:', sheetJsError);
      try {
        const uint8 = new Uint8Array(arrayBuffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < uint8.length; i += chunkSize) {
          const chunk = uint8.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        extractedData = parseWithSheetJS(binary, 'binary', options.targetDepotCode);
      } catch (finalErr: any) {
        throw new Error(
          finalErr.message?.includes('call stack')
            ? 'Excel 檔案結構過於複雜導致呼叫堆疊溢位 (Stack Overflow)。已啟動保護機制，建議確認檔案為標準 .xlsx 格式。'
            : `無法讀取 Excel 內容：${finalErr.message || '未知格式錯誤'}`
        );
      }
    }
  }

  if (!extractedData || !extractedData.jsonRows || extractedData.jsonRows.length === 0) {
    throw new Error('Excel 檔案內未能讀取到任何資料行');
  }

  // Parse the primary sheet
  const primaryResult = parseGenericTableRows(extractedData.jsonRows, options);

  // If there are multiple sheets across different stations, parse each sheet and merge into reportsByStationMap
  if (extractedData.allSheetsData) {
    const multiStationMap: Record<string, Partial<MaintenanceReportData>> = {
      ...(primaryResult.reportsByStationMap || {}),
    };

    for (const [sheetName, sheetRows] of Object.entries(extractedData.allSheetsData)) {
      if (sheetRows.length > 1 && sheetName !== extractedData.sheetName) {
        try {
          const detectedCode = detectLocationCode(sheetName);
          const sheetResult = parseGenericTableRows(sheetRows, {
            ...options,
            targetDepotCode: detectedCode || options.targetDepotCode,
          });
          const code = sheetResult.detectedLocation || detectedCode;
          if (code && sheetResult.items && sheetResult.items.length > 0) {
            multiStationMap[code] = sheetResult;
          }
        } catch {
          // ignore non-table sheets (cover page, instructions, etc.)
        }
      }
    }

    primaryResult.reportsByStationMap = multiStationMap;
  }

  return primaryResult;
}

/**
 * Downloads a clean pre-formatted Excel template for MTR Maintenance Engineer
 */
export function downloadSampleExcelTemplate() {
  const wsData = [
    ['MTR PM PERFORMANCE BREAKDOWN'],
    ['PM PERFORMANCE BREAKDOWN'],
    ['Contract No.: M1202-19E'],
    [''],
    ['STATION', 'WORK DESCRIPTION', 'PM W/O', 'QTY', 'M', '2M', '3M', '4M', '6M', 'Y', '18M', '2Y', '3Y'],
    ['', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', ''],
    [''],
    ['Prepared by:', '', '', '', 'Verified by:', '', '', '', 'Endorsed by:'],
    ['Name & Staff No. :', '', '', '', 'Name & Staff No. :', '', '', '', 'Name & Staff No. :'],
    ['Date :', new Date().toISOString().slice(0, 10), '', '', 'Date :', '', '', '', 'Date :'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [
    { wch: 10 }, // STATION
    { wch: 42 }, // WORK DESCRIPTION
    { wch: 38 }, // PM W/O
    { wch: 10 }, // QTY
    { wch: 6 }, // M
    { wch: 6 }, // 2M
    { wch: 6 }, // 3M
    { wch: 6 }, // 4M
    { wch: 6 }, // 6M
    { wch: 6 }, // Y
    { wch: 6 }, // 18M
    { wch: 6 }, // 2Y
    { wch: 6 }, // 3Y
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PM Report');

  XLSX.writeFile(wb, 'MTR_Maintenance_PM_Performance_Template.xlsx');
}

