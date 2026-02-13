import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Watch, Smartphone, Activity, Heart, Footprints, Flame,
  Moon, Droplets, RefreshCw, CheckCircle, ArrowLeft, Zap,
  TrendingUp, Clock, Wifi, WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface WearableDevice {
  id: string;
  name: string;
  type: "smartwatch" | "fitness_band" | "smart_ring" | "phone";
  icon: typeof Watch;
  brand: string;
  connected: boolean;
  lastSync: string | null;
  battery: number;
}

interface SyncedData {
  steps: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  activeMinutes: number;
  distance: number;
  floors: number;
  spo2: number;
  stressLevel: number;
  hydration: number;
}

const availableDevices: WearableDevice[] = [
  { id: "apple-watch", name: "Apple Watch Series 9", type: "smartwatch", icon: Watch, brand: "Apple", connected: false, lastSync: null, battery: 85 },
  { id: "fitbit", name: "Fitbit Charge 6", type: "fitness_band", icon: Activity, brand: "Fitbit", connected: false, lastSync: null, battery: 72 },
  { id: "galaxy-watch", name: "Samsung Galaxy Watch 6", type: "smartwatch", icon: Watch, brand: "Samsung", connected: false, lastSync: null, battery: 60 },
  { id: "oura-ring", name: "Oura Ring Gen 3", type: "smart_ring", icon: Zap, brand: "Oura", connected: false, lastSync: null, battery: 90 },
  { id: "google-fit", name: "Google Fit (Phone)", type: "phone", icon: Smartphone, brand: "Google", connected: false, lastSync: null, battery: 100 },
];

const generateRealisticData = (): SyncedData => ({
  steps: Math.floor(Math.random() * 6000) + 4000,
  calories: Math.floor(Math.random() * 800) + 1200,
  heartRate: Math.floor(Math.random() * 25) + 65,
  sleepHours: +(Math.random() * 3 + 5.5).toFixed(1),
  activeMinutes: Math.floor(Math.random() * 60) + 20,
  distance: +(Math.random() * 4 + 2).toFixed(1),
  floors: Math.floor(Math.random() * 15) + 3,
  spo2: Math.floor(Math.random() * 3) + 96,
  stressLevel: Math.floor(Math.random() * 40) + 20,
  hydration: Math.floor(Math.random() * 4) + 4,
});

const WearableSync = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [syncedData, setSyncedData] = useState<SyncedData | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem("healthai-wearables");
    setDevices(stored ? JSON.parse(stored) : availableDevices);
    const storedData = localStorage.getItem("healthai-wearable-data");
    if (storedData) setSyncedData(JSON.parse(storedData));
  }, []);

  const connectDevice = (deviceId: string) => {
    setSyncing(deviceId);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setSyncProgress(100);
      const data = generateRealisticData();
      const updated = devices.map(d =>
        d.id === deviceId ? { ...d, connected: true, lastSync: new Date().toISOString() } : d
      );
      setDevices(updated);
      setSyncedData(data);
      localStorage.setItem("healthai-wearables", JSON.stringify(updated));
      localStorage.setItem("healthai-wearable-data", JSON.stringify(data));

      // Also push vitals to localStorage for integration with VitalsTracker & HealthScore
      const existingVitals = JSON.parse(localStorage.getItem("healthai-vitals") || "[]");
      const today = new Date().toISOString().split("T")[0];
      const time = new Date().toTimeString().slice(0, 5);
      const newVitals = [
        { id: `w-hr-${Date.now()}`, type: "heart_rate", value: data.heartRate, date: today, time, notes: "Wearable sync" },
        { id: `w-spo2-${Date.now()}`, type: "oxygen", value: data.spo2, date: today, time, notes: "Wearable sync" },
      ];
      localStorage.setItem("healthai-vitals", JSON.stringify([...existingVitals, ...newVitals]));

      setSyncing(null);
      toast({ title: "Device Synced!", description: `${updated.find(d => d.id === deviceId)?.name} data imported successfully.` });
    }, 3000);
  };

  const disconnectDevice = (deviceId: string) => {
    const updated = devices.map(d =>
      d.id === deviceId ? { ...d, connected: false, lastSync: d.lastSync } : d
    );
    setDevices(updated);
    localStorage.setItem("healthai-wearables", JSON.stringify(updated));
    toast({ title: "Device Disconnected", description: "You can reconnect anytime." });
  };

  const resyncAll = () => {
    const connected = devices.find(d => d.connected);
    if (connected) connectDevice(connected.id);
    else toast({ title: "No Devices", description: "Connect a device first.", variant: "destructive" });
  };

  const connectedCount = devices.filter(d => d.connected).length;

  const statCards = syncedData ? [
    { label: "Steps", value: syncedData.steps.toLocaleString(), icon: Footprints, goal: 10000, current: syncedData.steps, color: "text-blue-500" },
    { label: "Calories", value: `${syncedData.calories} kcal`, icon: Flame, goal: 2000, current: syncedData.calories, color: "text-orange-500" },
    { label: "Heart Rate", value: `${syncedData.heartRate} bpm`, icon: Heart, goal: 100, current: syncedData.heartRate, color: "text-red-500" },
    { label: "Sleep", value: `${syncedData.sleepHours} hrs`, icon: Moon, goal: 8, current: syncedData.sleepHours, color: "text-indigo-500" },
    { label: "Active Min", value: `${syncedData.activeMinutes} min`, icon: Activity, goal: 60, current: syncedData.activeMinutes, color: "text-green-500" },
    { label: "Distance", value: `${syncedData.distance} km`, icon: TrendingUp, goal: 8, current: syncedData.distance, color: "text-cyan-500" },
    { label: "SpO2", value: `${syncedData.spo2}%`, icon: Droplets, goal: 100, current: syncedData.spo2, color: "text-purple-500" },
    { label: "Hydration", value: `${syncedData.hydration} glasses`, icon: Droplets, goal: 8, current: syncedData.hydration, color: "text-sky-500" },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Wearable <span className="text-gradient">Device Sync</span></h1>
              <p className="text-muted-foreground">Connect fitness trackers & smartwatches to import health data</p>
            </div>
            <Badge variant="outline" className="gap-1">
              {connectedCount > 0 ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3" />}
              {connectedCount} connected
            </Badge>
            <Button variant="outline" onClick={resyncAll}><RefreshCw className="w-4 h-4 mr-2" />Re-sync</Button>
          </div>

          {/* Devices */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {devices.map((device, i) => (
              <motion.div key={device.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`relative overflow-hidden ${device.connected ? "border-primary/40" : ""}`}>
                  {device.connected && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />}
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl ${device.connected ? "bg-primary/10" : "bg-muted"}`}>
                        <device.icon className={`w-6 h-6 ${device.connected ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{device.name}</h3>
                        <p className="text-xs text-muted-foreground">{device.brand}</p>
                        {device.connected && device.lastSync && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last sync: {new Date(device.lastSync).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={device.connected ? "default" : "secondary"} className="text-xs">
                        {device.connected ? "Connected" : "Available"}
                      </Badge>
                    </div>
                    {syncing === device.id && (
                      <div className="mt-4">
                        <Progress value={Math.min(syncProgress, 100)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1 text-center">Syncing data... {Math.min(Math.round(syncProgress), 100)}%</p>
                      </div>
                    )}
                    <div className="mt-4">
                      {device.connected ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => connectDevice(device.id)}>
                            <RefreshCw className="w-3 h-3 mr-1" />Sync
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => disconnectDevice(device.id)}>
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="hero" className="w-full" onClick={() => connectDevice(device.id)} disabled={syncing !== null}>
                          <Wifi className="w-3 h-3 mr-1" />Connect & Sync
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Synced Health Data */}
          <AnimatePresence>
            {syncedData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Synced Health Data
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {statCards.map(stat => (
                    <Card key={stat.label}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className="text-xl font-bold">{stat.value}</p>
                        <Progress value={Math.min((stat.current / stat.goal) * 100, 100)} className="h-1.5 mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">{Math.round(Math.min((stat.current / stat.goal) * 100, 100))}% of goal</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link to="/vitals"><Button variant="outline">View in Vitals Tracker</Button></Link>
                  <Link to="/health-score"><Button variant="outline">View Health Score</Button></Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WearableSync;
