// Body pain area mapping for AI gesture-based pain detection
export interface PainArea {
  id: string;
  name: string;
  region: string;
  // Approximate percentage coordinates on a front-facing body outline
  x: number; // 0-100
  y: number; // 0-100
  width: number;
  height: number;
  symptoms: string[];
  possibleConditions: string[];
  recommendedMedicines: string[];
  precautions: string[];
}

export const bodyPainAreas: PainArea[] = [
  {
    id: "head", name: "Head", region: "upper",
    x: 40, y: 2, width: 20, height: 12,
    symptoms: ["Headache", "Migraine", "Dizziness", "Pressure"],
    possibleConditions: ["Tension Headache", "Migraine", "Sinusitis", "Cluster Headache"],
    recommendedMedicines: ["Paracetamol 500mg", "Ibuprofen 400mg", "Sumatriptan (for migraine)"],
    precautions: ["Rest in a dark, quiet room", "Stay hydrated", "Avoid screen time", "Apply cold compress to forehead"],
  },
  {
    id: "forehead", name: "Forehead/Sinus", region: "upper",
    x: 42, y: 5, width: 16, height: 5,
    symptoms: ["Sinus pressure", "Frontal headache", "Nasal congestion"],
    possibleConditions: ["Sinusitis", "Tension Headache", "Allergic Rhinitis"],
    recommendedMedicines: ["Nasal decongestant spray", "Cetirizine 10mg", "Steam inhalation"],
    precautions: ["Steam inhalation 3x daily", "Saline nasal rinse", "Avoid cold drinks"],
  },
  {
    id: "neck", name: "Neck", region: "upper",
    x: 42, y: 14, width: 16, height: 6,
    symptoms: ["Stiffness", "Pain on movement", "Muscle spasm"],
    possibleConditions: ["Cervical Spondylosis", "Muscle Strain", "Torticollis", "Whiplash"],
    recommendedMedicines: ["Diclofenac gel (topical)", "Muscle relaxant", "Ibuprofen 400mg"],
    precautions: ["Neck stretches every hour", "Use ergonomic pillow", "Apply warm compress", "Avoid sudden neck movements"],
  },
  {
    id: "left-shoulder", name: "Left Shoulder", region: "upper",
    x: 22, y: 18, width: 15, height: 8,
    symptoms: ["Shoulder pain", "Limited movement", "Clicking sound"],
    possibleConditions: ["Frozen Shoulder", "Rotator Cuff Injury", "Bursitis", "Referred cardiac pain"],
    recommendedMedicines: ["Ibuprofen 400mg", "Diclofenac gel", "Ice pack application"],
    precautions: ["Gentle shoulder exercises", "Avoid heavy lifting", "If pain radiates to arm/chest, seek emergency care"],
  },
  {
    id: "right-shoulder", name: "Right Shoulder", region: "upper",
    x: 63, y: 18, width: 15, height: 8,
    symptoms: ["Shoulder pain", "Stiffness", "Weakness"],
    possibleConditions: ["Frozen Shoulder", "Rotator Cuff Tear", "Tendinitis"],
    recommendedMedicines: ["Ibuprofen 400mg", "Diclofenac gel", "Paracetamol 500mg"],
    precautions: ["Pendulum exercises", "Avoid overhead activities", "Apply ice for 15 mins"],
  },
  {
    id: "chest", name: "Chest", region: "middle",
    x: 35, y: 22, width: 30, height: 12,
    symptoms: ["Chest tightness", "Breathing difficulty", "Sharp pain"],
    possibleConditions: ["Costochondritis", "GERD", "Anxiety", "⚠️ Possible Cardiac Event"],
    recommendedMedicines: ["Antacid (if GERD)", "Paracetamol (for chest wall pain)"],
    precautions: ["⚠️ If severe/crushing pain, call emergency immediately", "Sit upright", "Loosen tight clothing", "Take deep slow breaths"],
  },
  {
    id: "upper-abdomen", name: "Upper Abdomen", region: "middle",
    x: 35, y: 34, width: 30, height: 8,
    symptoms: ["Burning sensation", "Bloating", "Nausea"],
    possibleConditions: ["Gastritis", "GERD", "Peptic Ulcer", "Gallstones"],
    recommendedMedicines: ["Omeprazole 20mg", "Antacid syrup", "Domperidone 10mg"],
    precautions: ["Eat smaller meals", "Avoid spicy/oily food", "No lying down after meals", "Avoid alcohol"],
  },
  {
    id: "lower-abdomen", name: "Lower Abdomen", region: "middle",
    x: 35, y: 42, width: 30, height: 8,
    symptoms: ["Cramping", "Bloating", "Discomfort"],
    possibleConditions: ["IBS", "Menstrual Cramps", "UTI", "Appendicitis (right side)"],
    recommendedMedicines: ["Mefenamic acid 500mg", "Buscopan (antispasmodic)", "Probiotics"],
    precautions: ["Apply warm compress", "Stay hydrated", "If right-side pain with fever, seek emergency care", "High-fiber diet"],
  },
  {
    id: "left-arm", name: "Left Arm", region: "upper",
    x: 12, y: 26, width: 12, height: 22,
    symptoms: ["Arm pain", "Numbness", "Tingling"],
    possibleConditions: ["Muscle Strain", "Nerve Compression", "⚠️ Possible Heart Attack (if with chest pain)"],
    recommendedMedicines: ["Ibuprofen 400mg", "Muscle relaxant cream"],
    precautions: ["⚠️ If with chest pain/sweating, call emergency", "Rest the arm", "Gentle stretching"],
  },
  {
    id: "right-arm", name: "Right Arm", region: "upper",
    x: 76, y: 26, width: 12, height: 22,
    symptoms: ["Arm pain", "Weakness", "Swelling"],
    possibleConditions: ["Tennis Elbow", "Muscle Strain", "Carpal Tunnel"],
    recommendedMedicines: ["Diclofenac gel", "Ibuprofen 400mg", "Wrist brace (for carpal tunnel)"],
    precautions: ["Rest from repetitive activities", "Ice application", "Ergonomic workspace setup"],
  },
  {
    id: "lower-back", name: "Lower Back", region: "lower",
    x: 35, y: 50, width: 30, height: 10,
    symptoms: ["Dull ache", "Sharp pain", "Stiffness on bending"],
    possibleConditions: ["Lumbar Strain", "Herniated Disc", "Sciatica", "Kidney Stones"],
    recommendedMedicines: ["Ibuprofen 400mg", "Muscle relaxant", "Diclofenac gel"],
    precautions: ["Maintain good posture", "Avoid heavy lifting", "Core strengthening exercises", "If pain radiates to legs, see doctor"],
  },
  {
    id: "left-knee", name: "Left Knee", region: "lower",
    x: 32, y: 68, width: 14, height: 10,
    symptoms: ["Knee pain", "Swelling", "Clicking", "Stiffness"],
    possibleConditions: ["Osteoarthritis", "Meniscus Tear", "Ligament Injury", "Bursitis"],
    recommendedMedicines: ["Ibuprofen 400mg", "Diclofenac gel", "Glucosamine supplements"],
    precautions: ["RICE method (Rest, Ice, Compression, Elevation)", "Low-impact exercises", "Use knee support"],
  },
  {
    id: "right-knee", name: "Right Knee", region: "lower",
    x: 54, y: 68, width: 14, height: 10,
    symptoms: ["Knee pain", "Instability", "Locking"],
    possibleConditions: ["Osteoarthritis", "Patellar Tendinitis", "ACL Injury"],
    recommendedMedicines: ["Ibuprofen 400mg", "Topical pain relief", "Calcium + Vitamin D"],
    precautions: ["Avoid prolonged standing", "Quadriceps strengthening", "Proper footwear"],
  },
  {
    id: "left-foot", name: "Left Foot/Ankle", region: "lower",
    x: 30, y: 85, width: 14, height: 12,
    symptoms: ["Foot pain", "Swelling", "Difficulty walking"],
    possibleConditions: ["Plantar Fasciitis", "Ankle Sprain", "Gout", "Flat Feet"],
    recommendedMedicines: ["Ibuprofen 400mg", "Diclofenac gel", "Colchicine (for gout)"],
    precautions: ["Rest and elevate", "Ice for 15 minutes", "Supportive footwear", "Calf stretches"],
  },
  {
    id: "right-foot", name: "Right Foot/Ankle", region: "lower",
    x: 56, y: 85, width: 14, height: 12,
    symptoms: ["Heel pain", "Arch pain", "Numbness"],
    possibleConditions: ["Plantar Fasciitis", "Stress Fracture", "Neuropathy"],
    recommendedMedicines: ["Paracetamol 500mg", "Arch support insoles", "Vitamin B12 (for neuropathy)"],
    precautions: ["Avoid barefoot walking on hard surfaces", "Foot exercises", "Proper shoe support"],
  },
];

export function detectPainArea(x: number, y: number, canvasWidth: number, canvasHeight: number): PainArea | null {
  const pctX = (x / canvasWidth) * 100;
  const pctY = (y / canvasHeight) * 100;
  
  for (const area of bodyPainAreas) {
    if (
      pctX >= area.x && pctX <= area.x + area.width &&
      pctY >= area.y && pctY <= area.y + area.height
    ) {
      return area;
    }
  }
  return null;
}
