import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Hand, AlertTriangle, Pill, ShieldCheck, X, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bodyPainAreas, detectPainArea, type PainArea } from "@/data/bodyPainMap";

interface PainDetectorProps {
  onSymptomDetected?: (symptom: string) => void;
}

const PainDetector = ({ onSymptomDetected }: PainDetectorProps) => {
  const [mode, setMode] = useState<"idle" | "camera" | "manual">("idle");
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState<PainArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fingerPosition, setFingerPosition] = useState<{ x: number; y: number } | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setMode("camera");
      }
    } catch {
      setMode("manual");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Simulate finger detection on camera feed - when user touches the canvas over the video
  const handleCameraTouch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setFingerPosition({ x, y });

    // Draw finger indicator
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw circle at finger position
      ctx.beginPath();
      ctx.arc(x * (canvas.width / rect.width), y * (canvas.height / rect.height), 20, 0, Math.PI * 2);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x * (canvas.width / rect.width), y * (canvas.height / rect.height), 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    }

    // Map to body area - use center region of camera for body mapping
    const area = detectPainArea(x, y, rect.width, rect.height);
    if (area) setSelectedArea(area);
  };

  const handleBodyClick = (area: PainArea) => {
    setSelectedArea(area);
  };

  const handleUseSymptom = (symptom: string) => {
    onSymptomDetected?.(symptom);
    setSelectedArea(null);
    setMode("idle");
    stopCamera();
  };

  if (mode === "idle") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Hand className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">AI Pain Area Detector</h3>
          <Badge variant="secondary" className="text-xs">New</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Point at where it hurts using your camera, or tap on the body map to identify your pain area. Get instant precautions and medicine suggestions.
        </p>
        <div className="flex gap-3">
          <Button variant="hero" onClick={startCamera}>
            <Camera className="w-4 h-4 mr-2" /> Use Camera
          </Button>
          <Button variant="outline" onClick={() => setMode("manual")}>
            <MousePointer className="w-4 h-4 mr-2" /> Body Map
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">
            {mode === "camera" ? "Point at Pain Area" : "Tap on Pain Area"}
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => { setMode("idle"); stopCamera(); setSelectedArea(null); }}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera / Body Map */}
        <div>
          {mode === "camera" ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4]">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} width={300} height={400}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onClick={handleCameraTouch}
                onTouchStart={handleCameraTouch}
              />
              {fingerPosition && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-destructive text-destructive-foreground">
                    📍 Tap on your pain area
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <p className="text-xs text-white bg-black/60 rounded-lg px-2 py-1">
                  Position yourself and tap where you feel pain
                </p>
              </div>
              <Button variant="destructive" size="sm"
                className="absolute top-2 right-2" onClick={() => { stopCamera(); setMode("manual"); }}>
                <CameraOff className="w-3 h-3 mr-1" /> Switch to Map
              </Button>
            </div>
          ) : (
            <div className="relative bg-muted/30 rounded-xl p-4 aspect-[3/4] border border-border">
              <p className="text-xs text-center text-muted-foreground mb-2">Tap on a body area</p>
              {/* SVG Body Outline */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simple body silhouette */}
                <ellipse cx="50" cy="8" rx="8" ry="8" fill="currentColor" opacity="0.15" />
                <rect x="42" y="16" width="16" height="4" rx="2" fill="currentColor" opacity="0.1" />
                <rect x="36" y="20" width="28" height="20" rx="4" fill="currentColor" opacity="0.1" />
                <rect x="20" y="20" width="14" height="6" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="66" y="20" width="14" height="6" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="14" y="26" width="10" height="20" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="76" y="26" width="10" height="20" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="36" y="40" width="28" height="16" rx="2" fill="currentColor" opacity="0.1" />
                <rect x="34" y="56" width="14" height="26" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="52" y="56" width="14" height="26" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="32" y="82" width="14" height="14" rx="3" fill="currentColor" opacity="0.1" />
                <rect x="54" y="82" width="14" height="14" rx="3" fill="currentColor" opacity="0.1" />

                {/* Interactive pain areas */}
                {bodyPainAreas.map(area => (
                  <rect key={area.id} x={area.x} y={area.y} width={area.width} height={area.height}
                    rx="2" fill={selectedArea?.id === area.id ? "hsl(var(--destructive))" : hoveredArea === area.id ? "hsl(var(--primary))" : "transparent"}
                    opacity={selectedArea?.id === area.id ? 0.4 : hoveredArea === area.id ? 0.3 : 0}
                    stroke={hoveredArea === area.id || selectedArea?.id === area.id ? "hsl(var(--primary))" : "transparent"}
                    strokeWidth="0.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredArea(area.id)}
                    onMouseLeave={() => setHoveredArea(null)}
                    onClick={() => handleBodyClick(area)}
                  />
                ))}
                {/* Labels for hovered */}
                {hoveredArea && (() => {
                  const area = bodyPainAreas.find(a => a.id === hoveredArea);
                  if (!area) return null;
                  return (
                    <text x={area.x + area.width / 2} y={area.y - 1} textAnchor="middle"
                      fontSize="2.5" fill="hsl(var(--primary))" fontWeight="bold">
                      {area.name}
                    </text>
                  );
                })()}
              </svg>
            </div>
          )}
          {mode === "manual" && (
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={startCamera}>
              <Camera className="w-3 h-3 mr-1" /> Switch to Camera
            </Button>
          )}
        </div>

        {/* Analysis Results */}
        <div>
          <AnimatePresence mode="wait">
            {selectedArea ? (
              <motion.div key={selectedArea.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    📍 {selectedArea.name}
                    <Badge variant="destructive" className="text-xs">Detected</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Region: {selectedArea.region}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Possible Conditions
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedArea.possibleConditions.map(c => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <Pill className="w-4 h-4 text-primary" /> Suggested Medicines
                  </h5>
                  <ul className="space-y-1">
                    {selectedArea.recommendedMedicines.map(m => (
                      <li key={m} className="text-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> Precautions
                  </h5>
                  <ul className="space-y-1">
                    {selectedArea.precautions.map(p => (
                      <li key={p} className="text-sm text-green-700 dark:text-green-400">• {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedArea.symptoms.map(s => (
                    <Button key={s} variant="outline" size="sm"
                      onClick={() => handleUseSymptom(`I'm experiencing ${s.toLowerCase()} in my ${selectedArea.name.toLowerCase()}`)}>
                      Analyze "{s}"
                    </Button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center text-center text-muted-foreground p-8">
                <div>
                  <Hand className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">
                    {mode === "camera" ? "Tap on the camera feed where you feel pain" : "Tap on the body map"}
                  </p>
                  <p className="text-sm">AI will analyze the area and suggest medicines & precautions</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PainDetector;
