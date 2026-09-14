import pptxgen from 'pptxgenjs';

export function exportPresentationPptx(): void {
  const pptx = new pptxgen();
  const SHAPES = (pptx as any).shapes || (pptx as any).ShapeType || { RECTANGLE: 'rect', OVAL: 'oval' };
  
  // Set layout to Widescreen 16:9
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'MTR Engineering Team';
  pptx.company = 'MTR Corporation';
  pptx.title = '港鐵保養工程報告自動化系統簡報';

  // Theme Colors
  const COLOR_RED = 'DC2626';     // MTR Red
  const COLOR_DARK = '0F172A';    // Slate 900
  const COLOR_SLATE = '475569';   // Slate 600
  const COLOR_BG = 'F8FAFC';      // Light BG
  const COLOR_WHITE = 'FFFFFF';
  const COLOR_EMERALD = '059669'; // Green accents
  const COLOR_AMBER = 'D97706';

  // -------------------------------------------------------------
  // SLIDE 1: COVER
  // -------------------------------------------------------------
  const slide1 = pptx.addSlide();
  slide1.background = { color: COLOR_BG };

  // Decorative top bar
  slide1.addShape(SHAPES.RECTANGLE, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.2,
    fill: { color: COLOR_RED },
  });

  // Category Tag
  slide1.addText('MTR ENGINEERING DIGITALIZATION', {
    x: 1.0,
    y: 1.5,
    w: 5.0,
    h: 0.4,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_RED,
  });

  // Main Title
  slide1.addText('港鐵保養工程報告自動化系統', {
    x: 1.0,
    y: 2.0,
    w: 11.0,
    h: 1.0,
    fontSize: 32,
    fontFace: 'Microsoft JhengHei',
    bold: true,
    color: COLOR_DARK,
  });

  // Subtitle
  slide1.addText('MTR Depot PM Performance Report Automation System', {
    x: 1.0,
    y: 3.0,
    w: 11.0,
    h: 0.5,
    fontSize: 16,
    fontFace: 'Arial',
    color: COLOR_SLATE,
  });

  // Summary box
  slide1.addShape(SHAPES.RECTANGLE, {
    x: 1.0,
    y: 3.8,
    w: 11.3,
    h: 1.2,
    fill: { color: COLOR_WHITE },
    line: { color: 'E2E8F0', width: 1 },
  });

  slide1.addText('智慧解析 Excel 保養清單  │  工單自動對應  │  預覽雙向微調  │  A4 高清 PDF 一鍵導出', {
    x: 1.2,
    y: 4.1,
    w: 10.9,
    h: 0.6,
    fontSize: 16,
    fontFace: 'Microsoft JhengHei',
    bold: true,
    color: COLOR_EMERALD,
    align: 'center',
  });

  // Footer info
  slide1.addText('簡報對象：港鐵工程保養團隊  •  發布日期：2026 年 8 月', {
    x: 1.0,
    y: 6.2,
    w: 11.0,
    h: 0.4,
    fontSize: 11,
    fontFace: 'Microsoft JhengHei',
    color: '94A3B8',
  });


  // -------------------------------------------------------------
  // SLIDE 2: PAIN POINTS & BACKGROUND
  // -------------------------------------------------------------
  const slide2 = pptx.addSlide();
  slide2.background = { color: COLOR_BG };

  // Header
  slide2.addText('一、背景與作業痛點', {
    x: 0.8,
    y: 0.6,
    w: 11.0,
    h: 0.5,
    fontSize: 22,
    fontFace: 'Microsoft JhengHei',
    bold: true,
    color: COLOR_DARK,
  });
  slide2.addText('Why We Need Automation', {
    x: 0.8,
    y: 1.1,
    w: 11.0,
    h: 0.3,
    fontSize: 12,
    color: COLOR_SLATE,
  });

  // Card 1
  slide2.addShape(SHAPES.RECTANGLE, {
    x: 0.8, y: 1.8, w: 3.6, h: 4.5,
    fill: { color: 'FEF2F2' },
    line: { color: 'FCA5A5', width: 1 },
  });
  slide2.addText('01. 手動對照繁瑣耗時', {
    x: 1.0, y: 2.1, w: 3.2, h: 0.4,
    fontSize: 15, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_RED,
  });
  slide2.addText(
    'Maximo 導出的 Excel 保養工單數量龐大（包含多個車廠如 SHD、TWD、KBD 等），手動尋找並複製工單編號 (WO_WONUM) 耗費大量時間。\n\n⚠️ 痛點：平均耗時 2 小時/月',
    { x: 1.0, y: 2.7, w: 3.2, h: 3.2, fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 20 }
  );

  // Card 2
  slide2.addShape(SHAPES.RECTANGLE, {
    x: 4.8, y: 1.8, w: 3.6, h: 4.5,
    fill: { color: 'FFFBEB' },
    line: { color: 'FCD34D', width: 1 },
  });
  slide2.addText('02. 設備簡稱多變易出錯', {
    x: 5.0, y: 2.1, w: 3.2, h: 0.4,
    fontSize: 15, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_AMBER,
  });
  slide2.addText(
    '不同車廠與設備名稱縮寫不一（如 CWP, METCHW, MCP, AHU, CDU, PU），人工比對容易遺漏或放錯欄位。\n\n⚠️ 痛點：人工比對遺漏率高',
    { x: 5.0, y: 2.7, w: 3.2, h: 3.2, fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 20 }
  );

  // Card 3
  slide2.addShape(SHAPES.RECTANGLE, {
    x: 8.8, y: 1.8, w: 3.6, h: 4.5,
    fill: { color: COLOR_WHITE },
    line: { color: 'CBD5E1', width: 1 },
  });
  slide2.addText('03. PDF 排版與微調不便', {
    x: 9.0, y: 2.1, w: 3.2, h: 0.4,
    fontSize: 15, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
  });
  slide2.addText(
    '報告須符合標準 A4 橫向格式，傳統 Word/Excel 轉檔常遇到換行折疊、頁面超出或無法呈現多工單問題。\n\n⚠️ 痛點：格式不符審核規範',
    { x: 9.0, y: 2.7, w: 3.2, h: 3.2, fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 20 }
  );


  // -------------------------------------------------------------
  // SLIDE 3: KEY FEATURES
  // -------------------------------------------------------------
  const slide3 = pptx.addSlide();
  slide3.background = { color: COLOR_BG };

  slide3.addText('二、系統核心功能亮點', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
  });
  slide3.addText('Key Features & Capabilities', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: COLOR_SLATE,
  });

  const features = [
    {
      title: '1. Excel 智慧分站與「全部站點」一頁一站',
      desc: '上傳 Excel 自動識別所有站點資料並切換「全部站點」模式，直接在畫面上垂直滾動預覽所有站點（一頁一站），支援直接列印畫面。',
      color: COLOR_EMERALD,
    },
    {
      title: '2. WORK DESCRIPTION 自動整齊與全大寫規範',
      desc: '工作描述文字自動整齊排版，英文字母全面自動轉為標準大寫 (ALL CAPS)，並自動套用港鐵專用字典（如 ACC 轉為 AIR-COOLED CHILLER）。',
      color: '0284C7', // Sky blue
    },
    {
      title: '3. 嚴格一頁 A4 比例動態縮放算法',
      desc: '每個 REPORT 嚴格鎖定 198mm A4 橫向限高，根據子列數量動態計算行距與文字尺寸，自動最適化縮成一頁 A4，杜絕跨頁與截斷。',
      color: COLOR_AMBER,
    },
    {
      title: '4. 多重線上電子簽署與全線 20 站同步',
      desc: 'Prepared By、Verified By、Endorsed By 完整支援觸控手寫板簽名與透明印章圖檔上傳，並支援一鍵同步套用至全線 20 個車站。',
      color: '9333EA', // Purple
    },
  ];

  features.forEach((feat, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.8;
    const y = 1.8 + row * 2.5;

    slide3.addShape(SHAPES.RECTANGLE, {
      x, y, w: 5.4, h: 2.2,
      fill: { color: COLOR_WHITE },
      line: { color: 'E2E8F0', width: 1 },
    });

    slide3.addText(feat.title, {
      x: x + 0.3, y: y + 0.3, w: 4.8, h: 0.4,
      fontSize: 15, fontFace: 'Microsoft JhengHei', bold: true, color: feat.color,
    });

    slide3.addText(feat.desc, {
      x: x + 0.3, y: y + 0.8, w: 4.8, h: 1.1,
      fontSize: 12, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 18,
    });
  });


  // -------------------------------------------------------------
  // SLIDE 4: WORKFLOW
  // -------------------------------------------------------------
  const slide4 = pptx.addSlide();
  slide4.background = { color: COLOR_BG };

  slide4.addText('三、標準操作流程 (Workflow)', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
  });
  slide4.addText('Simple 4-Step Process', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: COLOR_SLATE,
  });

  const steps = [
    { num: '1', title: '選擇站點或全部站點', desc: '可選單站（如 LAK、SHD）或首個「全部站點 (一頁一站)」總覽模式。', color: COLOR_RED },
    { num: '2', title: '上傳 Excel 自動轉各站', desc: '上傳 Excel，系統自動解析並轉成所有站點內容（一頁一站）。', color: COLOR_EMERALD },
    { num: '3', title: '頁面預覽、全大寫與簽署', desc: '畫面上滾動預覽每站，文字自動整齊全大寫，下方支援手寫或圖章簽核。', color: '0284C7' },
    { num: '4', title: '直接列印或匯出全部', desc: '一鍵「列印畫面」或「匯出全部」，每份 REPORT 嚴格縮成一頁 A4 橫向。', color: '9333EA' },
  ];

  steps.forEach((st, idx) => {
    const x = 0.8 + idx * 2.95;
    const y = 1.8;

    slide4.addShape(SHAPES.RECTANGLE, {
      x, y, w: 2.7, h: 4.2,
      fill: { color: COLOR_WHITE },
      line: { color: 'CBD5E1', width: 1 },
    });

    // Step Badge
    slide4.addShape(SHAPES.OVAL, {
      x: x + 0.2, y: y + 0.3, w: 0.5, h: 0.5,
      fill: { color: st.color },
    });
    slide4.addText(st.num, {
      x: x + 0.2, y: y + 0.3, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center',
    });

    slide4.addText(st.title, {
      x: x + 0.2, y: y + 1.0, w: 2.3, h: 0.6,
      fontSize: 15, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
    });

    slide4.addText(st.desc, {
      x: x + 0.2, y: y + 1.7, w: 2.3, h: 2.1,
      fontSize: 12, fontFace: 'Microsoft JhengHei', color: COLOR_SLATE, lineSpacing: 18,
    });
  });

  // Bottom Banner
  slide4.addShape(SHAPES.RECTANGLE, {
    x: 0.8, y: 6.2, w: 11.6, h: 0.6,
    fill: { color: 'ECFDF5' },
    line: { color: 'A7F3D0', width: 1 },
  });
  slide4.addText('💡 介面精簡升級：整合單一「清空資料 (Clear Data)」按鈕，微調面板俐落收納，操作流暢無冗餘', {
    x: 1.0, y: 6.3, w: 11.2, h: 0.4,
    fontSize: 12, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_EMERALD,
  });


  // -------------------------------------------------------------
  // SLIDE 5: MATCHING RULES & NORMALIZATION
  // -------------------------------------------------------------
  const slide5 = pptx.addSlide();
  slide5.background = { color: '0F172A' }; // Dark terminal theme

  slide5.addText('四、規則引擎與工作描述標準化規範', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_WHITE,
  });
  slide5.addText('Smart Equipment Matching & Description Normalization (excelHelper.ts)', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: '38BDF8',
  });

  const rules = [
    {
      title: '// 1. WORK DESCRIPTION 整齊排版與全大寫',
      kw: '英文全面自動轉為標準大寫 (ALL CAPS)\n自動清除前後標點空格，統一詞彙間距，工單報表美觀一致',
    },
    {
      title: '// 2. 嚴格一頁 A4 比例動態縮放算法',
      kw: '限高鎖定 198mm：針對每站設備多子列數量動態計算列高與間距\n列印與匯出嚴格保證一頁一站，杜絕換行溢出與截斷',
    },
    {
      title: '// 3. 專用詞彙標準化 (Chiller & Fire Damper)',
      kw: 'ACC ➔ AIR-COOLED CHILLER\nMR TPB ECS-Electro-thermal linked fire damper ➔ thermal linked fire damper',
    },
    {
      title: '// 4. 設備精確比對關鍵字',
      kw: '水泵風櫃：CWP, CHP, MUP, MWP, ECS-AHU\n控制電櫃：MOTOR CONTROL PANEL, MCC-MCP, CDU',
    },
  ];

  rules.forEach((rl, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.8;
    const y = 1.8 + row * 2.2;

    slide5.addShape(SHAPES.RECTANGLE, {
      x, y, w: 5.4, h: 1.9,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 },
    });

    slide5.addText(rl.title, {
      x: x + 0.3, y: y + 0.2, w: 4.8, h: 0.4,
      fontSize: 13, fontFace: 'Consolas', bold: true, color: 'FBBF24',
    });

    slide5.addText(rl.kw, {
      x: x + 0.3, y: y + 0.7, w: 4.8, h: 1.0,
      fontSize: 11, fontFace: 'Consolas', color: '6EE7B7', lineSpacing: 18,
    });
  });

  slide5.addText('✨ 支援同一設備項目自動填入多筆 PM W/O（獨立換行呈現，100% 格式規範保障）', {
    x: 0.8, y: 6.3, w: 11.6, h: 0.4,
    fontSize: 12, fontFace: 'Microsoft JhengHei', bold: true, color: '38BDF8',
  });


  // -------------------------------------------------------------
  // SLIDE 6: DIGITAL SIGNATURE & MULTI-STATION EXPORT
  // -------------------------------------------------------------
  const slide6 = pptx.addSlide();
  slide6.background = { color: COLOR_BG };

  slide6.addText('五、多重電子簽章與全站點預覽列印', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
  });
  slide6.addText('Digital Signature & All Stations Online Preview & Print', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: COLOR_SLATE,
  });

  // Left card: Signature
  slide6.addShape(SHAPES.RECTANGLE, {
    x: 0.8, y: 1.8, w: 5.6, h: 4.5,
    fill: { color: COLOR_WHITE },
    line: { color: 'C7D2FE', width: 1 },
  });
  slide6.addText('Prepared / Verified / Endorsed 電子簽名', {
    x: 1.1, y: 2.1, w: 5.0, h: 0.4,
    fontSize: 16, fontFace: 'Microsoft JhengHei', bold: true, color: '4F46E5',
  });
  slide6.addText(
    '• 觸控手寫簽署：內建平滑 Canvas 手寫板，支援自選線條粗細與筆觸色彩 (藍/黑/紅)。\n\n• 圖檔印章上傳：支援透明背景之 PNG/JPG 簽名檔或工程職章。\n\n• 一鍵全線同步：可勾選「同步套用至全線 20 個站點」，一次簽署全面生效。\n\n• 未簽署自動空白：無縫兼顧列印紙本手簽或純電子歸檔流程。',
    { x: 1.1, y: 2.7, w: 5.0, h: 3.3, fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 20 }
  );

  // Right card: Multi-station export & Online preview
  slide6.addShape(SHAPES.RECTANGLE, {
    x: 6.8, y: 1.8, w: 5.6, h: 4.5,
    fill: { color: COLOR_WHITE },
    line: { color: 'E9D5FF', width: 1 },
  });
  slide6.addText('「全部站點」線上即時預覽與直接列印 (一頁一站)', {
    x: 7.1, y: 2.1, w: 5.0, h: 0.4,
    fontSize: 16, fontFace: 'Microsoft JhengHei', bold: true, color: '9333EA',
  });
  slide6.addText(
    '• 線上捲動全站預覽：上傳 Excel 後自動轉成所有站點，在主畫面一次向下預覽所有站點報表。\n\n• 直接列印畫面：支援點擊「列印畫面」直接呼叫系統列印，嚴格分頁每站自動縮成一頁 A4 橫向。\n\n• 一鍵批次匯出 PDF：全線 20 個站點 30 秒內自動編譯為單一高品質多頁合輯 PDF。\n\n• 自動標準檔名：MTR_PM_Reports_All_Stations_2026.pdf',
    { x: 7.1, y: 2.7, w: 5.0, h: 3.3, fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 20 }
  );


  // -------------------------------------------------------------
  // SLIDE 7: BENEFITS
  // -------------------------------------------------------------
  const slide7 = pptx.addSlide();
  slide7.background = { color: COLOR_BG };

  slide7.addText('六、效益與管理價值', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
  });
  slide7.addText('Quantifiable Benefits & Management Value', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: COLOR_SLATE,
  });

  const bfits = [
    { t: '時間成本降低 95%', d: '從原本每份報告手動整理 120 分鐘縮短至 1 分鐘內完成。', c: COLOR_EMERALD },
    { t: '人工錯填率歸零', d: '程式精準邏輯比對，防止遺漏工單編號或放錯設備類別。', c: '0284C7' },
    { t: '標準化格式統一管理', d: '確保 SHD、TWD 等所有車廠產出的 PDF 報告樣式一致，便於審核。', c: '9333EA' },
    { t: '全線數位簽署與一鍵導出', d: '支援 20 站點一站一頁 PDF 批次導出及電子職章同步簽署。', c: COLOR_AMBER },
  ];

  bfits.forEach((bf, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.8;
    const y = 1.8 + row * 2.3;

    slide7.addShape(SHAPES.RECTANGLE, {
      x, y, w: 5.4, h: 2.0,
      fill: { color: COLOR_WHITE },
      line: { color: 'E2E8F0', width: 1 },
    });

    slide7.addText(bf.t, {
      x: x + 0.3, y: y + 0.3, w: 4.8, h: 0.4,
      fontSize: 16, fontFace: 'Microsoft JhengHei', bold: true, color: bf.c,
    });

    slide7.addText(bf.d, {
      x: x + 0.3, y: y + 0.8, w: 4.8, h: 1.0,
      fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_SLATE, lineSpacing: 18,
    });
  });


  // -------------------------------------------------------------
  // SLIDE 8: CONCLUSION
  // -------------------------------------------------------------
  const slide8 = pptx.addSlide();
  slide8.background = { color: COLOR_BG };

  slide8.addShape(SHAPES.RECTANGLE, {
    x: 1.5, y: 1.2, w: 10.3, h: 4.8,
    fill: { color: COLOR_WHITE },
    line: { color: 'E2E8F0', width: 1 },
  });

  slide8.addText('七、結語與 Q&A', {
    x: 2.0, y: 1.8, w: 9.3, h: 0.4,
    fontSize: 14, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_RED, align: 'center',
  });

  slide8.addText('推進港鐵工程保養數位化升級', {
    x: 2.0, y: 2.4, w: 9.3, h: 0.8,
    fontSize: 28, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK, align: 'center',
  });

  slide8.addText(
    '本自動化系統旨在提昇工程保養團隊工作效率與資料精準度，\n支援工作表自選、工作描述自動規範、電子手簽/印章與一站一頁 PDF 匯出。\n歡迎同仁於日常保養作業中積極使用與提出優化建議！\n\nThank You!',
    {
      x: 2.0, y: 3.4, w: 9.3, h: 2.0,
      fontSize: 15, fontFace: 'Microsoft JhengHei', color: COLOR_SLATE, align: 'center', lineSpacing: 22,
    }
  );

  // Save the presentation
  pptx.writeFile({ fileName: '港鐵保養工程報告自動化系統_簡報.pptx' });
}
