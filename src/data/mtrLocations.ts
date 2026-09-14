export type LocationCategory = 'all' | 'station' | 'facility' | 'depot';

export interface MTRLocation {
  code: string;
  nameZh: string;
  nameEn: string;
  title: string;
  type: 'station' | 'facility' | 'depot';
  line: string;
  description: string;
}

// 選擇站點：名字排列由 A-Z (Sorted alphabetically by Code / English name)
export const MTR_STATIONS_LIST: MTRLocation[] = [
  {
    code: 'AIR',
    nameZh: '機場站',
    nameEn: 'Airport Station',
    title: 'MTRC Station - AIR',
    type: 'station',
    line: '機場快綫 (AEL)',
    description: 'Airport Station 月度保養報告',
  },
  {
    code: 'AWE',
    nameZh: '博覽館站',
    nameEn: 'AsiaWorld-Expo Station',
    title: 'MTRC Station - AWE',
    type: 'station',
    line: '機場快綫 (AEL)',
    description: 'AsiaWorld-Expo Station 月度保養報告',
  },
  {
    code: 'CHT',
    nameZh: '中環站',
    nameEn: 'Central Station',
    title: 'MTRC Station - CHT',
    type: 'station',
    line: '港島綫 / 荃灣綫 / 香港站通道',
    description: 'Central Station 月度保養報告',
  },
  {
    code: 'CRP',
    nameZh: '紅磡貨運場 / 車站',
    nameEn: 'Freight Yard / Station - CRP',
    title: 'MTRC Station - CRP',
    type: 'station',
    line: '東鐵綫 / 屯馬綫',
    description: 'CRP Station 月度保養報告',
  },
  {
    code: 'DIH',
    nameZh: '鑽石山站',
    nameEn: 'Diamond Hill Station',
    title: 'MTRC Station - DIH',
    type: 'station',
    line: '屯馬綫 / 觀塘綫',
    description: 'Diamond Hill Station 月度保養報告',
  },
  {
    code: 'ETS',
    nameZh: '尖東站',
    nameEn: 'East Tsim Sha Tsui Station',
    title: 'MTRC Station - ETS',
    type: 'station',
    line: '屯馬綫 (TML)',
    description: 'East Tsim Sha Tsui Station 月度保養報告',
  },
  {
    code: 'HIC',
    nameZh: '香港站市區預辦登機',
    nameEn: 'Hong Kong In-Town Check-in',
    title: 'MTRC Station - HIC',
    type: 'facility',
    line: '機場快綫 (AEL)',
    description: 'Hong Kong In-Town Check-in 設施保養報告',
  },
  {
    code: 'HOK',
    nameZh: '香港站',
    nameEn: 'Hong Kong Station',
    title: 'MTRC Station - HOK',
    type: 'station',
    line: '東涌綫 / 機場快綫',
    description: 'Hong Kong Station 月度保養報告',
  },
  {
    code: 'KIC',
    nameZh: '九龍站市區預辦登機',
    nameEn: 'Kowloon In-Town Check-in',
    title: 'MTRC Station - KIC',
    type: 'facility',
    line: '機場快綫 (AEL)',
    description: 'Kowloon In-Town Check-in 設施保養報告',
  },
  {
    code: 'KOW',
    nameZh: '九龍站',
    nameEn: 'Kowloon Station',
    title: 'MTRC Station - KOW',
    type: 'station',
    line: '東涌綫 / 機場快綫',
    description: 'Kowloon Station 月度保養報告',
  },
  {
    code: 'LAK',
    nameZh: '荔景站',
    nameEn: 'Lai King Station',
    title: 'MTRC AEL / TCL - LAK',
    type: 'station',
    line: '東涌綫 / 荃灣綫',
    description: 'Lai King Station 月度保養報告',
  },
  {
    code: 'MEF',
    nameZh: '美孚站',
    nameEn: 'Mei Foo Station',
    title: 'MTRC Station - MEF',
    type: 'station',
    line: '荃灣綫 / 屯馬綫',
    description: 'Mei Foo Station 月度保養報告',
  },
  {
    code: 'NIC',
    nameZh: '南昌站',
    nameEn: 'Nam Cheong Station',
    title: 'MTRC Station - NIC',
    type: 'station',
    line: '東涌綫 / 屯馬綫',
    description: 'Nam Cheong Station 月度保養報告',
  },
  {
    code: 'OCC',
    nameZh: '青衣車務控制中心',
    nameEn: 'Operations Control Centre',
    title: 'MTRC OCC - Tsing Yi',
    type: 'facility',
    line: '車務控制中心',
    description: 'Operations Control Centre 設施保養報告',
  },
  {
    code: 'OLY',
    nameZh: '奧運站',
    nameEn: 'Olympic Station',
    title: 'MTRC Station - OLY',
    type: 'station',
    line: '東涌綫 (TCL)',
    description: 'Olympic Station 月度保養報告',
  },
  {
    code: 'SST',
    nameZh: '欣澳站',
    nameEn: 'Sunny Bay Station',
    title: 'MTRC Station - SST',
    type: 'station',
    line: '東涌綫 / 迪士尼綫',
    description: 'Sunny Bay Station 月度保養報告',
  },
  {
    code: 'TIC',
    nameZh: '青衣站市區預辦登機 / 聯鎖',
    nameEn: 'Tsing Yi Check-in / Station',
    title: 'MTRC Station - TIC',
    type: 'facility',
    line: '機場快綫 (AEL)',
    description: 'Tsing Yi Check-in 設施保養報告',
  },
  {
    code: 'TSY',
    nameZh: '青衣站',
    nameEn: 'Tsing Yi Station',
    title: 'MTRC Station - TSY',
    type: 'station',
    line: '東涌綫 / 機場快綫',
    description: 'Tsing Yi Station 月度保養報告',
  },
  {
    code: 'TTS',
    nameZh: '荃灣西站',
    nameEn: 'Tsuen Wan West Station',
    title: 'MTRC Station - TTS',
    type: 'station',
    line: '屯馬綫 (TML)',
    description: 'Tsuen Wan West Station 月度保養報告',
  },
  {
    code: 'TUC',
    nameZh: '東涌站',
    nameEn: 'Tung Chung Station',
    title: 'MTRC Station - TUC',
    type: 'station',
    line: '東涌綫 (TCL)',
    description: 'Tung Chung Station 月度保養報告',
  },
  {
    code: 'YOT',
    nameZh: '油塘站',
    nameEn: 'Yau Tong Station',
    title: 'MTRC Station - YOT',
    type: 'station',
    line: '觀塘綫 / 將軍澳綫',
    description: 'Yau Tong Station 月度保養報告',
  },
];

// 車廠：名字排列由 A-Z (Sorted alphabetically: CWD -> HTD -> KBD -> PHD -> SHD -> TAD -> TMD -> TPB -> TWD)
export const MTR_DEPOTS_LIST: MTRLocation[] = [
  {
    code: 'CWD',
    nameZh: '柴灣車廠',
    nameEn: 'Chai Wan Depot',
    title: 'MTRC Depot - CWD',
    type: 'depot',
    line: '港島綫 (ISL)',
    description: 'Chai Wan Depot 保養報告',
  },
  {
    code: 'HTD',
    nameZh: '何東樓車廠',
    nameEn: 'Ho Tung Lau Depot',
    title: 'MTRC Depot - HTD',
    type: 'depot',
    line: '東鐵綫 (EAL)',
    description: 'Ho Tung Lau Depot 保養報告',
  },
  {
    code: 'KBD',
    nameZh: '九龍灣車廠',
    nameEn: 'Kowloon Bay Depot',
    title: 'MTRC Depot - KBD',
    type: 'depot',
    line: '觀塘綫 (KTL)',
    description: 'Kowloon Bay Depot 保養報告',
  },
  {
    code: 'PHD',
    nameZh: '八鄉車廠',
    nameEn: 'Pat Heung Depot',
    title: 'MTRC Depot - PHD',
    type: 'depot',
    line: '屯馬綫 (TML)',
    description: 'Pat Heung Depot 保養報告',
  },
  {
    code: 'SHD',
    nameZh: '小濠灣車廠',
    nameEn: 'Siu Ho Wan Depot',
    title: 'MTRC Depot - SHD',
    type: 'depot',
    line: '東涌綫 / 機場快綫',
    description: 'Siu Ho Wan Depot 保養報告',
  },
  {
    code: 'TAD',
    nameZh: '大圍車廠',
    nameEn: 'Tai Wai Depot',
    title: 'MTRC Depot - TAD',
    type: 'depot',
    line: '屯馬綫 (TML)',
    description: 'Tai Wai Depot 保養報告',
  },
  {
    code: 'TMD',
    nameZh: '屯門車廠',
    nameEn: 'Tuen Mun Depot',
    title: 'MTRC Depot - TMD',
    type: 'depot',
    line: '輕鐵 / 屯馬綫',
    description: 'Tuen Mun Depot 保養報告',
  },
  {
    code: 'TPB',
    nameZh: '大埔維修廠',
    nameEn: 'Tai Po Depot',
    title: 'MTRC Depot - TPB',
    type: 'depot',
    line: '東鐵綫 / 港鐵巴士',
    description: 'Tai Po Depot 保養報告',
  },
  {
    code: 'TWD',
    nameZh: '荃灣車廠',
    nameEn: 'Tsuen Wan Depot',
    title: 'MTRC Depot - TWD',
    type: 'depot',
    line: '荃灣綫 (TWL)',
    description: 'Tsuen Wan Depot 保養報告',
  },
];

export const ALL_MTR_LOCATIONS: MTRLocation[] = [
  ...MTR_STATIONS_LIST,
  ...MTR_DEPOTS_LIST,
];

export const getLocationByCode = (code: string): MTRLocation | undefined => {
  const upper = (code || '').toUpperCase().trim();
  return ALL_MTR_LOCATIONS.find((loc) => loc.code === upper);
};

export const getLocationTitle = (code: string): string => {
  const loc = getLocationByCode(code);
  if (loc) return loc.title;
  return `MTRC Station - ${code.toUpperCase()}`;
};
