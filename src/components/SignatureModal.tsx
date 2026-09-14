import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  PenTool,
  Upload,
  RotateCcw,
  Check,
  Trash2,
  Image as ImageIcon,
  CheckSquare,
  Square,
} from 'lucide-react';

export type SignatoryRole = 'preparedBy' | 'verifiedBy' | 'endorsedBy';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: SignatoryRole;
  currentSignature?: string;
  onSaveSignature: (role: SignatoryRole, signatureDataUrl: string, applyToAllStations: boolean) => void;
  onRemoveSignature: (role: SignatoryRole, applyToAllStations: boolean) => void;
}

const ROLE_LABELS: Record<SignatoryRole, { en: string; zh: string }> = {
  preparedBy: { en: 'Prepared By', zh: '填報人 / 檢查人員' },
  verifiedBy: { en: 'Verified By', zh: '核實人 / 工程主管' },
  endorsedBy: { en: 'Endorsed By', zh: '簽署核准人 / 總工程師' },
};

export const SignatureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  role,
  currentSignature,
  onSaveSignature,
  onRemoveSignature,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [applyToAll, setApplyToAll] = useState<boolean>(true);
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setHasDrawn(false);
    setUploadedImage(null);

    // Give modal DOM a tick to layout before sizing canvas
    const timer = setTimeout(() => {
      initCanvas();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = strokeWidth;

    // Transparent canvas background
    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.cancelable && 'touches' in e) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const coords = getCanvasCoordinates(e.nativeEvent);
    isDrawingRef.current = true;
    lastPointRef.current = coords;

    // Draw single dot on click
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, strokeWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = penColor;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    if (e.cancelable && 'touches' in e) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCoords = getCanvasCoordinates(e.nativeEvent);

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentCoords.x, currentCoords.y);
    ctx.stroke();

    lastPointRef.current = currentCoords;
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案 (.png, .jpg, .svg, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    let finalSignatureUrl = '';

    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        alert('請先在手寫板上繪製簽名');
        return;
      }
      finalSignatureUrl = canvas.toDataURL('image/png');
    } else {
      if (!uploadedImage) {
        alert('請先上傳簽名或印鑑圖片');
        return;
      }
      finalSignatureUrl = uploadedImage;
    }

    onSaveSignature(role, finalSignatureUrl, applyToAll);
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm(`確定要清除 ${ROLE_LABELS[role].en} 的簽名嗎？`)) {
      onRemoveSignature(role, applyToAll);
      onClose();
    }
  };

  if (!isOpen) return null;

  const roleInfo = ROLE_LABELS[role] || { en: role, zh: '' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{roleInfo.en} 電子簽名設定</span>
                <span className="text-xs px-2 py-0.5 font-normal rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {roleInfo.zh}
                </span>
              </h3>
              <p className="text-xs text-slate-500">支援即時手寫觸控簽署或上傳清晰印章圖檔</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'draw'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>✍️ 線上手寫簽名 (Draw Signature)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>📤 上傳簽名圖檔 (Upload Image / Chop)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'draw' ? (
            <div className="space-y-3">
              {/* Controls bar */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">墨水顏色：</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPenColor('#0f172a')}
                      className={`w-5 h-5 rounded-full bg-slate-900 border-2 transition-transform ${
                        penColor === '#0f172a' ? 'scale-125 border-indigo-500 ring-2 ring-indigo-200' : 'border-white'
                      }`}
                      title="極致黑 (Classic Black)"
                    />
                    <button
                      type="button"
                      onClick={() => setPenColor('#1e3a8a')}
                      className={`w-5 h-5 rounded-full bg-blue-900 border-2 transition-transform ${
                        penColor === '#1e3a8a' ? 'scale-125 border-indigo-500 ring-2 ring-indigo-200' : 'border-white'
                      }`}
                      title="鋼筆藍 (Navy Blue)"
                    />
                    <button
                      type="button"
                      onClick={() => setPenColor('#b91c1c')}
                      className={`w-5 h-5 rounded-full bg-red-700 border-2 transition-transform ${
                        penColor === '#b91c1c' ? 'scale-125 border-indigo-500 ring-2 ring-indigo-200' : 'border-white'
                      }`}
                      title="印章紅 (Chop Red)"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">筆觸粗細：</span>
                  <div className="flex items-center gap-1">
                    {[1.8, 2.8, 4.0].map((w, idx) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setStrokeWidth(w)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                          strokeWidth === w
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {idx === 0 ? '細' : idx === 1 ? '適中' : '粗'}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                    title="重新簽署"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>清除</span>
                  </button>
                </div>
              </div>

              {/* Drawing Canvas Area */}
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 overflow-hidden shadow-inner h-48 touch-none">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair"
                />

                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400">
                    <PenTool className="w-8 h-8 stroke-1 mb-2 opacity-50" />
                    <p className="text-xs font-medium">請使用滑鼠、觸控筆或手指在此虛線框內簽署</p>
                    <div className="w-48 border-b border-slate-300 mt-6 opacity-60" />
                    <span className="text-[10px] text-slate-400 mt-1">簽名基準線</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('signature-file-input')?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/60'
                    : uploadedImage
                    ? 'border-emerald-500 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
              >
                <input
                  id="signature-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {uploadedImage ? (
                  <div className="space-y-3">
                    <div className="max-h-32 flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <img
                        src={uploadedImage}
                        alt="Signature Preview"
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>已成功選取簽名圖檔 ‧ 點擊可更換</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      拖曳簽名圖檔至此，或 <span className="text-indigo-600 underline">點擊瀏覽檔案</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      支援透明背景 PNG、JPG 或工程印章圖樣 (建議 300x120 像素以上)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current Signature Status & Preview */}
          {currentSignature && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">目前已有簽名：</span>
                <div className="h-9 px-2 bg-white border border-slate-200 rounded flex items-center justify-center">
                  <img src={currentSignature} alt="Current" className="h-7 object-contain" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清除現有簽名</span>
              </button>
            </div>
          )}

          {/* Apply to all stations option */}
          <div
            onClick={() => setApplyToAll(!applyToAll)}
            className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition-colors select-none"
          >
            <div className="flex items-center gap-2.5">
              {applyToAll ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  同時將此簽名套用至所有車站 ({roleInfo.en})
                </span>
                <span className="text-[11px] text-slate-500">
                  勾選後，匯出全部 20 站 PDF 時均會自動帶入此簽名，無需逐站手簽
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>儲存並套用簽名</span>
          </button>
        </div>
      </div>
    </div>
  );
};
