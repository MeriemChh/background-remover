import { useEffect, useRef, useState } from "react";
import { removeImageBackground } from "../services/removeBackground";
import "../styles/background-remover.css";
import {
  FiRotateCcw,
  FiRotateCw,
  FiScissors,
  FiEdit3,
  FiMove,
  FiUpload,
  FiDownload
} from "react-icons/fi";


export default function BackgroundRemover() {
  const canvasRef = useRef(null);
  const originalCanvasRef = useRef(null);
  
  // Image & Loading
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  // Tools & Navigation
  const [mode, setMode] = useState("erase");
  const [brushSize, setBrushSize] = useState(25);
  const [zoom, setZoom] = useState(1);
  const [smoothing, setSmoothing] = useState(0.2); 
  
  // Navigation States
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const smoothedPos = useRef({ x: 0, y: 0 });

  // Pinch State
  const lastPinchDistance = useRef(null);
  const lastPinchMidpoint = useRef(null);

  // History
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isProcessingHistory, setIsProcessingHistory] = useState(false);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyStep, history, isProcessingHistory]);

  // --- AI Logic ---
  const handleProcessImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setProgress(0);
    try {
      const blob = await removeImageBackground(file, setProgress);
      setOriginalImage(URL.createObjectURL(file));
      setProcessedImage(URL.createObjectURL(blob));
    } catch (err) { alert("AI Failed"); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!processedImage) return;
    const resImg = new Image();
    const origImg = new Image();
    resImg.src = processedImage;
    origImg.src = originalImage;

    resImg.onload = () => {
      const c = canvasRef.current;
      c.width = resImg.width;
      c.height = resImg.height;
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(resImg, 0, 0);
      setHistory([c.toDataURL()]);
      setHistoryStep(0);
    };
    origImg.onload = () => {
      const c = originalCanvasRef.current;
      c.width = origImg.width;
      c.height = origImg.height;
      c.getContext("2d").drawImage(origImg, 0, 0);
    };
  }, [processedImage, originalImage]);

  // --- Robust History ---
  const saveState = () => {
    if (!canvasRef.current) return;
    const data = canvasRef.current.toDataURL();
    setHistory(prev => {
      const next = prev.slice(0, historyStep + 1);
      if (next.length > 40) next.shift();
      return [...next, data];
    });
    setHistoryStep(prev => (prev >= 39 ? 39 : prev + 1));
  };

  const undo = () => (historyStep > 0 && !isProcessingHistory) && applyHistory(historyStep - 1);
  const redo = () => (historyStep < history.length - 1 && !isProcessingHistory) && applyHistory(historyStep + 1);

  const applyHistory = (step) => {
    setIsProcessingHistory(true);
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(step);
      setIsProcessingHistory(false);
    };
  };

  // --- Helper Math ---
  const getPointerPos = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (clientY - rect.top) * (canvasRef.current.height / rect.height)
    };
  };

  const getMidpoint = (t1, t2) => ({
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2
  });

  const getDistance = (t1, t2) => Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  // --- Unified Interaction ---
  const handleStart = (e) => {
    if (e.touches && e.touches.length === 2) {
      // PINCH START
      isDrawing.current = false;
      const dist = getDistance(e.touches[0], e.touches[1]);
      const mid = getMidpoint(e.touches[0], e.touches[1]);
      lastPinchDistance.current = dist;
      lastPinchMidpoint.current = mid;
    } else {
      // DRAW or MOUSE PAN START
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (mode === 'pan' || (e.button === 1)) { // Middle mouse also pans
        isDragging.current = true;
        lastPos.current = { x: clientX, y: clientY };
      } else {
        isDrawing.current = true;
        const pos = getPointerPos(clientX, clientY);
        smoothedPos.current = pos;
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    }
  };

  const handleMove = (e) => {
    if (e.touches && e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const mid = getMidpoint(e.touches[0], e.touches[1]);
      
      const deltaZoom = dist / lastPinchDistance.current;
      setZoom(prev => Math.min(Math.max(prev * deltaZoom, 0.1), 5));
      
      const dx = mid.x - lastPinchMidpoint.current.x;
      const dy = mid.y - lastPinchMidpoint.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));

      lastPinchDistance.current = dist;
      lastPinchMidpoint.current = mid;
    } else {
      // DRAW or SINGLE FINGER PAN
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDragging.current) {
        const dx = clientX - lastPos.current.x;
        const dy = clientY - lastPos.current.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: clientX, y: clientY };
      } else if (isDrawing.current) {
        const target = getPointerPos(clientX, clientY);
        smoothedPos.current.x += (target.x - smoothedPos.current.x) * smoothing;
        smoothedPos.current.y += (target.y - smoothedPos.current.y) * smoothing;

        const ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";
        if (mode === "restore") ctx.strokeStyle = ctx.createPattern(originalCanvasRef.current, "no-repeat");
        else ctx.strokeStyle = "black";
        
        ctx.lineTo(smoothedPos.current.x, smoothedPos.current.y);
        ctx.stroke();
      }
    }
  };

  const handleEnd = () => {
    if (isDrawing.current) saveState();
    isDrawing.current = false;
    isDragging.current = false;
    lastPinchDistance.current = null;
  };

  return (
    <div className="app-container">
        <nav className="toolbar-top">
          <div className="nav-left">
            <div className="brand">SketchClean</div>
          </div>

          <div className="history-btns center">
            <button onClick={undo} disabled={historyStep <= 0 || isProcessingHistory}>
              <FiRotateCcw />
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1 || isProcessingHistory}>
              <FiRotateCw />
            </button>
          </div>

          <div className="nav-right">
            <label className="btn-upload">
              <FiUpload /> New
              <input type="file" onChange={handleProcessImage} hidden />
            </label>

            <button className="btn-export">
              <FiDownload /> Export
            </button>
          </div>
        </nav>


      {loading && (
        <div className="ai-loader"><div className="spinner"></div><p>AI working... {progress}%</p></div>
      )}

      {processedImage && (
        <main className="work-area">
          <aside className="tool-sidebar">
            <div className="tool-section">
              <p className="section-label">Tools</p>
                  <button className={mode === 'erase' ? 'active' : ''} onClick={() => setMode('erase')}>
                    <FiScissors /> Erase
                  </button>

                  <button className={mode === 'restore' ? 'active' : ''} onClick={() => setMode('restore')}>
                    <FiEdit3 /> Restore
                  </button>

                  <button className={mode === 'pan' ? 'active' : ''} onClick={() => setMode('pan')}>
                    <FiMove /> Pan
                  </button>
            </div>
            <div className="tool-section">
                    <p className="section-label">
                  Stabilizer {Math.round(smoothing * 100)}%
                </p>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(smoothing * 100)}
                  onChange={e => setSmoothing(parseInt(e.target.value) / 100)}
                />
           </div>
            <div className="tool-section">
              <p className="section-label">Zoom {Math.round(zoom * 100)}%</p>
              <input type="range" min="0.1" max="5" step="0.1" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} />
              <button className="sub-btn" onClick={() => {setZoom(1); setOffset({x:0,y:0})}}>Reset View</button>
            </div>
            <div className="tool-section">
              <p className="section-label">Brush {brushSize}px</p>
              <input type="range" min="1" max="150" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
            </div>
          </aside>

          <div className="canvas-viewport" 
               onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
               onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>
            <div className="canvas-move-layer" 
                 style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
              <div className="checkerboard-bg">
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>
        </main>
      )}
      <canvas ref={originalCanvasRef} style={{ display: "none" }} />
    </div>
  );
}
