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
      title: '1. 智慧 Excel 保養清單解析',
      desc: '支援上傳包含 WO_WONUM、ASSET.ASSETNUM 與 ASSET.DESCRIPTION 的保養工作 Excel，自動解析無須重組欄位。',
      color: COLOR_EMERALD,
    },
    {
      title: '2. 多工單智慧自動匹配',
      desc: '內建設備匹配規則引擎，當單一設備對應多筆工單（如 5001618422 ~ 5001618426）時，自動依換行格式完整填入 PM W/O。',
      color: '0284C7', // Sky blue
    },
    {
      title: '3. 預覽畫面雙向即時微調',
      desc: '可直接在 PDF 預覽畫面上點擊修改文字、調整工單號、變更數量與責任人，兼具微調彈性與直覺操作。',
      color: COLOR_AMBER,
    },
    {
      title: '4. 高清 A4 PDF 導出與歸檔',
      desc: '符合 A4 橫向標準尺寸，支援直接列印或導出為高品質 PDF，並自動寫入 LocalStorage 與歷史存檔紀錄。',
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
      fontSize: 16, fontFace: 'Microsoft JhengHei', bold: true, color: feat.color,
    });

    slide3.addText(feat.desc, {
      x: x + 0.3, y: y + 0.8, w: 4.8, h: 1.1,
      fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_DARK, lineSpacing: 18,
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
    { num: '1', title: '選擇車廠與月份', desc: '點擊切換 SHD、TWD、KBD 或 LOW 等車廠分頁。', color: COLOR_RED },
    { num: '2', title: '上傳保養 Excel', desc: '拖曳或選擇由 Maximo 導出的月保養清單 Excel。', color: COLOR_EMERALD },
    { num: '3', title: '確認匹配與微調', desc: '檢查自動對應之 WO_WONUM 填入數量，必要時直接編輯。', color: '0284C7' },
    { num: '4', title: '匯出 PDF / 歸檔', desc: '點擊「匯出 PDF 檔」或「自動歸檔」保留歷史紀錄。', color: '9333EA' },
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
  slide4.addText('💡 自動填入狀態追蹤：每個車廠分頁均即時顯示「WO_WONUM 已填」統計數字，比對狀況一目了然', {
    x: 1.0, y: 6.3, w: 11.2, h: 0.4,
    fontSize: 12, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_EMERALD,
  });


  // -------------------------------------------------------------
  // SLIDE 5: MATCHING RULES
  // -------------------------------------------------------------
  const slide5 = pptx.addSlide();
  slide5.background = { color: '0F172A' }; // Dark terminal theme

  slide5.addText('四、智慧設備匹配規則引擎', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_WHITE,
  });
  slide5.addText('Smart Equipment Matching Engine (excelHelper.ts)', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: '38BDF8',
  });

  const rules = [
    { title: '// 冷凍水泵 (Chilled Water Pump)', kw: 'CWP, CHP, MUP, MWP, MR-SHD-CP, SHD-ECS-CHP' },
    { title: '// 風櫃機組 (AHU / PAHU)', kw: 'AIR HANDLING, AIR HANDING, PRIMARY AIR, ECS-AHU' },
    { title: '// 馬達控制盤/櫃 (MCP / MCC)', kw: 'MOTOR CONTROL PANEL, ECS-MCP, MCC-MCP' },
    { title: '// 化學加藥 & 穩壓單元 (CDU / PU)', kw: 'CHEM. DOSING, CDU, PRESSURIZATION, PU' },
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
      fontSize: 14, fontFace: 'Consolas', bold: true, color: 'FBBF24',
    });

    slide5.addText(`匹配關鍵字：\n${rl.kw}`, {
      x: x + 0.3, y: y + 0.7, w: 4.8, h: 1.0,
      fontSize: 12, fontFace: 'Consolas', color: '6EE7B7', lineSpacing: 18,
    });
  });

  slide5.addText('✨ 支援同一設備項目自動填入多筆 WO_WONUM （以獨立換行呈現，100% 容錯相容）', {
    x: 0.8, y: 6.3, w: 11.6, h: 0.4,
    fontSize: 12, fontFace: 'Microsoft JhengHei', bold: true, color: '38BDF8',
  });


  // -------------------------------------------------------------
  // SLIDE 6: BENEFITS
  // -------------------------------------------------------------
  const slide6 = pptx.addSlide();
  slide6.background = { color: COLOR_BG };

  slide6.addText('五、效益與管理價值', {
    x: 0.8, y: 0.6, w: 11.0, h: 0.5,
    fontSize: 22, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK,
  });
  slide6.addText('Quantifiable Benefits & Management Value', {
    x: 0.8, y: 1.1, w: 11.0, h: 0.3,
    fontSize: 12, color: COLOR_SLATE,
  });

  const bfits = [
    { t: '時間成本降低 95%', d: '從原本每份報告手動整理 120 分鐘縮短至 1 分鐘內完成。', c: COLOR_EMERALD },
    { t: '人工錯填率歸零', d: '程式精準邏輯比對，防止遺漏工單編號或放錯設備類別。', c: '0284C7' },
    { t: '標準化格式統一管理', d: '確保 SHD、TWD 等所有車廠產出的 PDF 報告樣式一致，便於審核。', c: '9333EA' },
    { t: '完整雲端與歷史紀錄', d: '支援月保養紀錄自動歸檔與歷史版本隨時調閱下載。', c: COLOR_AMBER },
  ];

  bfits.forEach((bf, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 5.8;
    const y = 1.8 + row * 2.3;

    slide6.addShape(SHAPES.RECTANGLE, {
      x, y, w: 5.4, h: 2.0,
      fill: { color: COLOR_WHITE },
      line: { color: 'E2E8F0', width: 1 },
    });

    slide6.addText(bf.t, {
      x: x + 0.3, y: y + 0.3, w: 4.8, h: 0.4,
      fontSize: 16, fontFace: 'Microsoft JhengHei', bold: true, color: bf.c,
    });

    slide6.addText(bf.d, {
      x: x + 0.3, y: y + 0.8, w: 4.8, h: 1.0,
      fontSize: 13, fontFace: 'Microsoft JhengHei', color: COLOR_SLATE, lineSpacing: 18,
    });
  });


  // -------------------------------------------------------------
  // SLIDE 7: CONCLUSION
  // -------------------------------------------------------------
  const slide7 = pptx.addSlide();
  slide7.background = { color: COLOR_BG };

  slide7.addShape(SHAPES.RECTANGLE, {
    x: 1.5, y: 1.2, w: 10.3, h: 4.8,
    fill: { color: COLOR_WHITE },
    line: { color: 'E2E8F0', width: 1 },
  });

  slide7.addText('六、結語與 Q&A', {
    x: 2.0, y: 1.8, w: 9.3, h: 0.4,
    fontSize: 14, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_RED, align: 'center',
  });

  slide7.addText('推進港鐵工程保養數位化升級', {
    x: 2.0, y: 2.4, w: 9.3, h: 0.8,
    fontSize: 28, fontFace: 'Microsoft JhengHei', bold: true, color: COLOR_DARK, align: 'center',
  });

  slide7.addText(
    '本自動化系統旨在提昇工程保養團隊工作效率與資料精準度，\n歡迎同仁於日常保養作業中積極使用與提出優化建議！\n\nThank You!',
    {
      x: 2.0, y: 3.4, w: 9.3, h: 2.0,
      fontSize: 15, fontFace: 'Microsoft JhengHei', color: COLOR_SLATE, align: 'center', lineSpacing: 22,
    }
  );

  // Save the presentation
  pptx.writeFile({ fileName: '港鐵保養工程報告自動化系統_簡報.pptx' });
}
