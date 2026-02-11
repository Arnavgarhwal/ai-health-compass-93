import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2, Printer, Download, User, Calendar, Pill, ClipboardList, Building2, Send, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { checkInteractions, type DrugInteraction } from "@/data/drugInteractions";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
  date: string;
  followUpDate: string;
}

const frequencyOptions = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 6 hours", "Every 8 hours", "As needed", "Before meals", "After meals", "At bedtime"];
const durationOptions = ["3 days", "5 days", "7 days", "10 days", "14 days", "21 days", "30 days", "60 days", "90 days", "Until follow-up"];

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem("wellsync-prescriptions");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);

  const [form, setForm] = useState<Omit<Prescription, "id" | "date">>({
    patientName: "", patientAge: "", patientGender: "",
    doctorName: "", doctorSpecialty: "", hospitalName: "WellSync Health Center",
    diagnosis: "", medicines: [{ name: "", dosage: "", frequency: "Twice daily", duration: "7 days", instructions: "" }],
    notes: "", followUpDate: "",
  });

  useEffect(() => {
    localStorage.setItem("wellsync-prescriptions", JSON.stringify(prescriptions));
  }, [prescriptions]);

  const addMedicine = () => {
    setForm(p => ({ ...p, medicines: [...p.medicines, { name: "", dosage: "", frequency: "Twice daily", duration: "7 days", instructions: "" }] }));
  };

  // Drug interaction checker
  const interactions = useMemo(() => {
    const names = form.medicines.map(m => m.name).filter(Boolean);
    return names.length >= 2 ? checkInteractions(names) : [];
  }, [form.medicines]);

  const removeMedicine = (index: number) => {
    setForm(p => ({ ...p, medicines: p.medicines.filter((_, i) => i !== index) }));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    setForm(p => ({
      ...p,
      medicines: p.medicines.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const savePrescription = () => {
    if (!form.patientName || !form.doctorName || !form.diagnosis || form.medicines.some(m => !m.name)) {
      toast({ title: "Missing fields", description: "Please fill patient name, doctor name, diagnosis, and all medicine names.", variant: "destructive" });
      return;
    }
    const prescription: Prescription = {
      ...form, id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    setPrescriptions(prev => [prescription, ...prev]);
    setIsCreating(false);
    setForm({
      patientName: "", patientAge: "", patientGender: "",
      doctorName: "", doctorSpecialty: "", hospitalName: "WellSync Health Center",
      diagnosis: "", medicines: [{ name: "", dosage: "", frequency: "Twice daily", duration: "7 days", instructions: "" }],
      notes: "", followUpDate: "",
    });
    toast({ title: "Prescription Created! 📋", description: `Prescription for ${prescription.patientName} has been saved.` });
  };

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    toast({ title: "Prescription deleted" });
  };

  const printPrescription = (rx: Prescription) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Prescription - ${rx.patientName}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #1a1a1a; }
        .header { text-align: center; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #0ea5e9; margin: 0; font-size: 24px; }
        .header p { margin: 4px 0; color: #666; }
        .rx-symbol { font-size: 28px; color: #0ea5e9; font-weight: bold; margin: 20px 0 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .info-item { font-size: 14px; } .info-item strong { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
        th { background: #f0f9ff; color: #0369a1; }
        .notes { background: #fffbeb; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
        .footer { text-align: right; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; }
        .signature { margin-top: 50px; border-top: 1px solid #333; width: 200px; margin-left: auto; padding-top: 5px; text-align: center; }
        @media print { body { padding: 20px; } }
      </style></head><body>
        <div class="header">
          <h1>🏥 ${rx.hospitalName}</h1>
          <p>Digital Prescription</p>
          <p style="font-size:12px">Date: ${rx.date}</p>
        </div>
        <div class="info-grid">
          <div class="info-item"><strong>Patient:</strong> ${rx.patientName}</div>
          <div class="info-item"><strong>Age/Gender:</strong> ${rx.patientAge} / ${rx.patientGender}</div>
          <div class="info-item"><strong>Doctor:</strong> ${rx.doctorName}</div>
          <div class="info-item"><strong>Specialty:</strong> ${rx.doctorSpecialty}</div>
        </div>
        <div class="info-item"><strong>Diagnosis:</strong> ${rx.diagnosis}</div>
        <div class="rx-symbol">℞</div>
        <table>
          <tr><th>#</th><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr>
          ${rx.medicines.map((m, i) => `<tr><td>${i + 1}</td><td>${m.name}</td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.duration}</td><td>${m.instructions || "-"}</td></tr>`).join("")}
        </table>
        ${rx.notes ? `<div class="notes"><strong>Notes:</strong> ${rx.notes}</div>` : ""}
        ${rx.followUpDate ? `<p><strong>Follow-up:</strong> ${rx.followUpDate}</p>` : ""}
        <div class="footer">
          <div class="signature">${rx.doctorName}<br/><small>${rx.doctorSpecialty}</small></div>
        </div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const sharePrescription = (rx: Prescription) => {
    const text = `Prescription from ${rx.doctorName}\nPatient: ${rx.patientName}\nDiagnosis: ${rx.diagnosis}\nMedicines:\n${rx.medicines.map((m, i) => `${i + 1}. ${m.name} - ${m.dosage} - ${m.frequency} for ${m.duration}`).join("\n")}`;
    if (navigator.share) {
      navigator.share({ title: "Medical Prescription", text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!", description: "Prescription details copied." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">📋 Prescriptions</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Digital <span className="text-gradient">Prescription</span> Generator
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create, manage, and share digital prescriptions. Print-ready format for patients.
            </p>
          </motion.div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">{prescriptions.length} prescription(s) saved</p>
            <Button variant="hero" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" /> New Prescription
            </Button>
          </div>

          {/* Create Form */}
          {isCreating && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" /> New Prescription
              </h2>

              {/* Patient Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Patient Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input placeholder="Patient Name *" value={form.patientName} onChange={e => setForm(p => ({ ...p, patientName: e.target.value }))} />
                  <Input placeholder="Age" value={form.patientAge} onChange={e => setForm(p => ({ ...p, patientAge: e.target.value }))} />
                  <Select onValueChange={v => setForm(p => ({ ...p, patientGender: v }))}>
                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Doctor Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" /> Doctor / Clinic</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input placeholder="Doctor Name *" value={form.doctorName} onChange={e => setForm(p => ({ ...p, doctorName: e.target.value }))} />
                  <Input placeholder="Specialty" value={form.doctorSpecialty} onChange={e => setForm(p => ({ ...p, doctorSpecialty: e.target.value }))} />
                  <Input placeholder="Hospital/Clinic" value={form.hospitalName} onChange={e => setForm(p => ({ ...p, hospitalName: e.target.value }))} />
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="font-semibold mb-3">Diagnosis *</h3>
                <Input placeholder="e.g. Acute upper respiratory infection" value={form.diagnosis} onChange={e => setForm(p => ({ ...p, diagnosis: e.target.value }))} />
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><Pill className="w-4 h-4" /> Medicines</h3>
                  <Button variant="outline" size="sm" onClick={addMedicine}><Plus className="w-3 h-3 mr-1" /> Add Medicine</Button>
                </div>
                <div className="space-y-4">
                  {form.medicines.map((med, index) => (
                    <div key={index} className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">Medicine #{index + 1}</Badge>
                        {form.medicines.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeMedicine(index)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <Input placeholder="Medicine name *" value={med.name} onChange={e => updateMedicine(index, "name", e.target.value)} />
                        <Input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => updateMedicine(index, "dosage", e.target.value)} />
                        <Select value={med.frequency} onValueChange={v => updateMedicine(index, "frequency", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{frequencyOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={med.duration} onValueChange={v => updateMedicine(index, "duration", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{durationOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                        <Input placeholder="Special instructions" value={med.instructions} onChange={e => updateMedicine(index, "instructions", e.target.value)} className="md:col-span-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drug Interaction Warnings */}
              <AnimatePresence>
                {interactions.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-destructive" />
                      <h3 className="font-semibold text-destructive">⚠️ Drug Interaction Warnings ({interactions.length})</h3>
                    </div>
                    {interactions.map((inter, idx) => (
                      <div key={idx} className={`rounded-xl p-4 border ${
                        inter.severity === "severe" ? "bg-destructive/10 border-destructive/30" :
                        inter.severity === "moderate" ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700" :
                        "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={`w-4 h-4 ${
                            inter.severity === "severe" ? "text-destructive" : "text-amber-600 dark:text-amber-400"
                          }`} />
                          <Badge variant={inter.severity === "severe" ? "destructive" : "secondary"} className="capitalize text-xs">
                            {inter.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{inter.drugs.join(" + ")}</span>
                        </div>
                        <p className="text-sm font-medium">{inter.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">💡 {inter.recommendation}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notes & Follow-up */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-3">Additional Notes</h3>
                  <Textarea placeholder="Any additional instructions for the patient..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Follow-up Date</h3>
                  <Input type="date" value={form.followUpDate} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))} />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="hero" onClick={savePrescription}><FileText className="w-4 h-4 mr-2" /> Save Prescription</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}

          {/* Prescription List */}
          {prescriptions.length === 0 && !isCreating ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No prescriptions yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescriptions.map((rx, i) => (
                <motion.div key={rx.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{rx.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{rx.date}</p>
                    </div>
                    <Badge variant="secondary">{rx.medicines.length} med(s)</Badge>
                  </div>
                  <p className="text-sm mb-1"><strong>Doctor:</strong> {rx.doctorName}</p>
                  <p className="text-sm text-muted-foreground mb-3"><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {rx.medicines.slice(0, 3).map((m, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{m.name}</Badge>
                    ))}
                    {rx.medicines.length > 3 && <Badge variant="outline" className="text-xs">+{rx.medicines.length - 3} more</Badge>}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewingPrescription(rx)}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => printPrescription(rx)}><Printer className="w-3 h-3" /></Button>
                    <Button variant="outline" size="sm" onClick={() => sharePrescription(rx)}><Send className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deletePrescription(rx.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* View Prescription Modal */}
      {viewingPrescription && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingPrescription(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}>
            <div className="text-center border-b border-border pb-4 mb-4">
              <h2 className="text-xl font-bold text-primary">🏥 {viewingPrescription.hospitalName}</h2>
              <p className="text-sm text-muted-foreground">{viewingPrescription.date}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <p><strong>Patient:</strong> {viewingPrescription.patientName}</p>
              <p><strong>Age/Gender:</strong> {viewingPrescription.patientAge} / {viewingPrescription.patientGender}</p>
              <p><strong>Doctor:</strong> {viewingPrescription.doctorName}</p>
              <p><strong>Specialty:</strong> {viewingPrescription.doctorSpecialty}</p>
            </div>
            <p className="text-sm mb-4"><strong>Diagnosis:</strong> {viewingPrescription.diagnosis}</p>
            <h3 className="font-bold text-lg text-primary mb-2">℞ Medicines</h3>
            <div className="space-y-3 mb-4">
              {viewingPrescription.medicines.map((m, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-3 border border-border">
                  <p className="font-semibold">{i + 1}. {m.name} — {m.dosage}</p>
                  <p className="text-sm text-muted-foreground">{m.frequency} for {m.duration}</p>
                  {m.instructions && <p className="text-sm text-muted-foreground italic">→ {m.instructions}</p>}
                </div>
              ))}
            </div>
            {viewingPrescription.notes && (
              <div className="bg-accent/50 rounded-xl p-3 mb-4 border border-border">
                <p className="text-sm"><strong>Notes:</strong> {viewingPrescription.notes}</p>
              </div>
            )}
            {viewingPrescription.followUpDate && (
              <p className="text-sm mb-4"><strong>Follow-up:</strong> {viewingPrescription.followUpDate}</p>
            )}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="hero" onClick={() => printPrescription(viewingPrescription)}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="outline" onClick={() => sharePrescription(viewingPrescription)}>
                <Send className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button variant="outline" onClick={() => setViewingPrescription(null)} className="ml-auto">Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Prescriptions;
