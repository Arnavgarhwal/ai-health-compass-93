import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Pill, FileText, Activity, Stethoscope, ClipboardList, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TimelineEvent {
  id: string;
  type: "consultation" | "prescription" | "test" | "vitals" | "goal";
  title: string;
  description: string;
  date: string;
  timestamp: number;
  details?: Record<string, string>;
}

const typeConfig = {
  consultation: { icon: Stethoscope, color: "bg-blue-500", label: "Consultation" },
  prescription: { icon: ClipboardList, color: "bg-purple-500", label: "Prescription" },
  test: { icon: FileText, color: "bg-amber-500", label: "Test Result" },
  vitals: { icon: Activity, color: "bg-rose-500", label: "Vitals" },
  goal: { icon: Pill, color: "bg-green-500", label: "Health Goal" },
};

const PatientTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const timeline: TimelineEvent[] = [];

    // Load consultations/appointments
    try {
      const appts = JSON.parse(localStorage.getItem("wellsync-appointments") || "[]");
      appts.forEach((a: any) => {
        timeline.push({
          id: `appt-${a.id}`, type: "consultation",
          title: `${a.type} with ${a.doctorName}`,
          description: `${a.specialty} - Status: ${a.status}`,
          date: new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          timestamp: new Date(a.date).getTime(),
          details: { Doctor: a.doctorName, Specialty: a.specialty, Time: a.time, Status: a.status },
        });
      });
    } catch {}

    // Load prescriptions
    try {
      const rxs = JSON.parse(localStorage.getItem("wellsync-prescriptions") || "[]");
      rxs.forEach((rx: any) => {
        timeline.push({
          id: `rx-${rx.id}`, type: "prescription",
          title: `Prescription by ${rx.doctorName}`,
          description: `${rx.diagnosis} — ${rx.medicines.length} medicine(s)`,
          date: rx.date,
          timestamp: parseInt(rx.id) || Date.now(),
          details: { Patient: rx.patientName, Diagnosis: rx.diagnosis, Medicines: rx.medicines.map((m: any) => m.name).join(", ") },
        });
      });
    } catch {}

    // Load test results
    try {
      const tests = JSON.parse(localStorage.getItem("wellsync-test-results") || "[]");
      tests.forEach((t: any) => {
        timeline.push({
          id: `test-${t.id}`, type: "test",
          title: t.testName,
          description: t.resultSummary || `Status: ${t.status}`,
          date: new Date(t.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          timestamp: new Date(t.date).getTime(),
          details: { Test: t.testName, Status: t.status, ...(t.resultSummary ? { Result: t.resultSummary } : {}) },
        });
      });
    } catch {}

    // Load vitals
    try {
      const vitals = JSON.parse(localStorage.getItem("wellsync-vitals") || "[]");
      vitals.slice(-20).forEach((v: any, i: number) => {
        timeline.push({
          id: `vital-${i}`, type: "vitals",
          title: `${v.type} Reading`,
          description: `Value: ${v.value} ${v.unit || ""}`,
          date: new Date(v.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          timestamp: new Date(v.date).getTime(),
          details: { Type: v.type, Value: `${v.value} ${v.unit || ""}` },
        });
      });
    } catch {}

    // Load health goals
    try {
      const goals = JSON.parse(localStorage.getItem("wellsync-health-goals") || "[]");
      goals.forEach((g: any) => {
        const pct = Math.round((g.current / g.target) * 100);
        timeline.push({
          id: `goal-${g.id}`, type: "goal",
          title: `${g.name} Goal`,
          description: `Progress: ${pct}% (${g.current}/${g.target} ${g.unit})`,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          timestamp: Date.now(),
          details: { Goal: g.name, Progress: `${pct}%`, Current: `${g.current} ${g.unit}`, Target: `${g.target} ${g.unit}` },
        });
      });
    } catch {}

    // Add mock data if empty
    if (timeline.length === 0) {
      const now = Date.now();
      timeline.push(
        { id: "m1", type: "consultation", title: "Checkup with Dr. Sarah Johnson", description: "Cardiology — Status: completed", date: "January 20, 2024", timestamp: now - 86400000 * 15, details: { Doctor: "Dr. Sarah Johnson", Specialty: "Cardiology" } },
        { id: "m2", type: "test", title: "Complete Blood Count", description: "All values within normal range", date: "January 18, 2024", timestamp: now - 86400000 * 17, details: { Status: "Ready" } },
        { id: "m3", type: "prescription", title: "Prescription by Dr. Michael Chen", description: "Acute Bronchitis — 2 medicines", date: "January 15, 2024", timestamp: now - 86400000 * 20, details: { Diagnosis: "Acute Bronchitis" } },
        { id: "m4", type: "vitals", title: "Blood Pressure Reading", description: "Value: 120/80 mmHg", date: "January 22, 2024", timestamp: now - 86400000 * 13, details: { Value: "120/80 mmHg" } },
        { id: "m5", type: "goal", title: "Steps Goal", description: "Progress: 75% (7500/10000 steps)", date: "January 25, 2024", timestamp: now - 86400000 * 10, details: { Progress: "75%" } },
      );
    }

    timeline.sort((a, b) => b.timestamp - a.timestamp);
    setEvents(timeline);
  }, []);

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);
  const filters = ["all", "consultation", "prescription", "test", "vitals", "goal"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Calendar className="w-3 h-3 mr-1" /> Patient History</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Health <span className="text-gradient">Timeline</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete chronological view of your health journey — consultations, prescriptions, tests, and vitals.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {filters.map(f => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
                onClick={() => setFilter(f)} className="capitalize">
                {f === "all" ? <><Filter className="w-3 h-3 mr-1" /> All</> : <>{typeConfig[f as keyof typeof typeConfig]?.label || f}</>}
              </Button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6 text-center">{filtered.length} event(s)</p>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
            {filtered.map((event, i) => {
              const cfg = typeConfig[event.type];
              const Icon = cfg.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`relative flex items-start mb-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-10 h-10 rounded-full ${cfg.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Card */}
                  <div className={`ml-16 md:ml-0 md:w-[45%] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className={`flex items-center gap-2 mb-2 ${isLeft ? "md:justify-end" : ""}`}>
                        <Badge variant="secondary" className="text-xs">{cfg.label}</Badge>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </div>
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      {event.details && (
                        <div className={`mt-3 pt-3 border-t border-border space-y-1 ${isLeft ? "md:text-right" : ""}`}>
                          {Object.entries(event.details).map(([k, v]) => (
                            <p key={k} className="text-xs"><span className="text-muted-foreground">{k}:</span> <span className="font-medium">{v}</span></p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No events found for this filter.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientTimeline;
