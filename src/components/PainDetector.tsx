import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Hand, AlertTriangle, Pill, ShieldCheck, X, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bodyPainAreas, detectPainArea, type PainArea } from "@/data/bodyPainMap";
import BodyModel3D from "./BodyModel3D";

interface PainDetectorProps {
  onSymptomDetected?: (symptom: string) => void;
}

const PainDetector = ({ onSymptomDetected }: PainDetectorProps) => {
  const [mode, setMode] = useState<"idle" | "camera" | "manual">("idle");
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState<PainArea | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fingerPosition, setFingerPosition] = useState<{ x: number; y: number } | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setCameraActive(true);
            setMode("camera");
          });
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      toast({ title: "Camera Unavailable", description: "Could not access camera. Using 3D Body Map instead.", variant: "destructive" });
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

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      ctx.beginPath();
      ctx.arc(x * scaleX, y * scaleY, 20, 0, Math.PI * 2);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x * scaleX, y * scaleY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      // Label
      ctx.fillStyle = "#fff";
      ctx.font = "12px sans-serif";
      ctx.fillText("📍 Pain point", x * scaleX + 25, y * scaleY + 5);
    }

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
          Point at where it hurts using your camera, or use the interactive 3D body map to identify your pain area.
        </p>
        <div className="flex gap-3">
          <Button variant="hero" onClick={startCamera}>
            <Camera className="w-4 h-4 mr-2" /> Use Camera
          </Button>
          <Button variant="outline" onClick={() => setMode("manual")}>
            <MousePointer className="w-4 h-4 mr-2" /> 3D Body Map
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
        <div>
          {mode === "camera" ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4]">
              <video ref={videoRef} autoPlay playsInline muted
                className="w-full h-full object-cover" />
              <canvas ref={canvasRef} width={640} height={480}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onClick={handleCameraTouch}
                onTouchStart={handleCameraTouch}
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <p className="text-white text-sm">Starting camera...</p>
                </div>
              )}
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
                <CameraOff className="w-3 h-3 mr-1" /> Switch to 3D Map
              </Button>
            </div>
          ) : (
            <BodyModel3D onAreaClick={handleBodyClick} selectedArea={selectedArea} />
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
                    {mode === "camera" ? "Tap on the camera feed where you feel pain" : "Click on the 3D body model"}
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
