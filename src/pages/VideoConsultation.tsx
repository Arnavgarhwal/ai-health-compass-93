import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, MessageSquare, Send, Users, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: "you" | "doctor";
  text: string;
  time: string;
}

const doctorResponses = [
  "I understand your concern. Can you describe the symptoms in more detail?",
  "How long have you been experiencing this?",
  "Are you currently taking any medications?",
  "I'd recommend we run some basic tests. I'll send you a prescription.",
  "That's good to hear. Let's continue monitoring your condition.",
  "Please make sure to stay hydrated and get plenty of rest.",
  "I'll schedule a follow-up appointment for next week.",
];

const VideoConsultation = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  const startCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsInCall(true);
      setCallDuration(0);
      timerRef.current = window.setInterval(() => setCallDuration(d => d + 1), 1000);
      toast({ title: "Call Connected 📞", description: "You are now connected with the doctor." });
    } catch {
      toast({ title: "Camera Access Denied", description: "Please allow camera and microphone access.", variant: "destructive" });
    }
  }, []);

  const endCall = useCallback(() => {
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      localVideoRef.current.srcObject = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsInCall(false);
    setCallDuration(0);
    setIsScreenSharing(false);
    toast({ title: "Call Ended", description: `Duration: ${formatTime(callDuration)}` });
  }, [callDuration]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
      setIsVideoOn(p => !p);
    }
  };

  const toggleMic = () => {
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
      setIsMicOn(p => !p);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: "you", text: chatInput, time: now }]);
    setChatInput("");
    setTimeout(() => {
      const response = doctorResponses[Math.floor(Math.random() * doctorResponses.length)];
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), sender: "doctor", text: response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1500 + Math.random() * 2000);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">📹 Telemedicine</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Video <span className="text-gradient">Consultation</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect face-to-face with your doctor from anywhere using secure video calls.
            </p>
          </motion.div>

          {!isInCall ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-6xl mb-6">👩‍⚕️</div>
              <h2 className="text-2xl font-bold mb-2">Ready to Connect?</h2>
              <p className="text-muted-foreground mb-6">Your doctor is available. Start a video consultation now.</p>
              <div className="bg-accent/50 rounded-xl p-4 mb-6 text-left space-y-2">
                <p className="text-sm"><strong>Doctor:</strong> Dr. Sarah Johnson — Cardiology</p>
                <p className="text-sm"><strong>Session:</strong> 30 min consultation</p>
                <p className="text-sm text-muted-foreground">Ensure your camera and microphone are working properly.</p>
              </div>
              <Button variant="hero" size="lg" onClick={startCall}>
                <Video className="w-5 h-5 mr-2" /> Start Video Call
              </Button>
            </motion.div>
          ) : (
            <div className={`flex gap-4 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}`}>
              <div className="flex-1 flex flex-col">
                {/* Video Area */}
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-4">
                  {/* Simulated Doctor Video */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="text-center">
                      <div className="text-8xl mb-4">👩‍⚕️</div>
                      <p className="text-white text-lg font-semibold">Dr. Sarah Johnson</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm">Connected</span>
                      </div>
                    </div>
                  </div>
                  {/* Local Video PiP */}
                  <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl overflow-hidden border-2 border-white/20 bg-muted">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    {!isVideoOn && (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <VideoOff className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {/* Call Timer */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                      🔴 {formatTime(callDuration)}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setIsFullscreen(f => !f)}>
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </Button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 py-4">
                  <Button variant={isMicOn ? "outline" : "destructive"} size="icon" className="rounded-full w-12 h-12" onClick={toggleMic}>
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  <Button variant={isVideoOn ? "outline" : "destructive"} size="icon" className="rounded-full w-12 h-12" onClick={toggleVideo}>
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  <Button variant={isScreenSharing ? "default" : "outline"} size="icon" className="rounded-full w-12 h-12"
                    onClick={() => { setIsScreenSharing(s => !s); toast({ title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started" }); }}>
                    <Monitor className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full w-12 h-12" onClick={() => setShowChat(c => !c)}>
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  <Button variant="destructive" size="icon" className="rounded-full w-14 h-14" onClick={endCall}>
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Chat Sidebar */}
              {showChat && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="w-80 bg-card border border-border rounded-2xl flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">Chat</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.sender === "you" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "you" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border flex gap-2">
                    <Input placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage()} className="text-sm" />
                    <Button size="icon" onClick={sendMessage}><Send className="w-4 h-4" /></Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoConsultation;
