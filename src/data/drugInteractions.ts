// Drug interaction database for medication interaction checker
export interface DrugInteraction {
  drugs: [string, string];
  severity: "mild" | "moderate" | "severe";
  description: string;
  recommendation: string;
}

export const drugInteractions: DrugInteraction[] = [
  { drugs: ["aspirin", "ibuprofen"], severity: "moderate", description: "Increased risk of gastrointestinal bleeding when used together.", recommendation: "Avoid combining. Use one at a time or consult your doctor." },
  { drugs: ["aspirin", "warfarin"], severity: "severe", description: "Significantly increased risk of bleeding.", recommendation: "Do not combine without medical supervision." },
  { drugs: ["ibuprofen", "naproxen"], severity: "moderate", description: "Both are NSAIDs – combined use increases GI bleeding risk.", recommendation: "Use only one NSAID at a time." },
  { drugs: ["metformin", "alcohol"], severity: "moderate", description: "Alcohol increases lactic acidosis risk with metformin.", recommendation: "Limit alcohol intake while on metformin." },
  { drugs: ["lisinopril", "potassium"], severity: "moderate", description: "ACE inhibitors can raise potassium levels; adding supplements is risky.", recommendation: "Monitor potassium levels regularly." },
  { drugs: ["amoxicillin", "methotrexate"], severity: "severe", description: "Amoxicillin may increase methotrexate toxicity.", recommendation: "Requires close monitoring or alternative antibiotic." },
  { drugs: ["simvastatin", "erythromycin"], severity: "severe", description: "Increased risk of muscle breakdown (rhabdomyolysis).", recommendation: "Avoid combination. Use alternative statin or antibiotic." },
  { drugs: ["ciprofloxacin", "antacid"], severity: "moderate", description: "Antacids reduce absorption of ciprofloxacin.", recommendation: "Take ciprofloxacin 2 hours before or 6 hours after antacids." },
  { drugs: ["omeprazole", "clopidogrel"], severity: "severe", description: "Omeprazole reduces effectiveness of clopidogrel.", recommendation: "Use pantoprazole instead of omeprazole." },
  { drugs: ["fluoxetine", "tramadol"], severity: "severe", description: "Risk of serotonin syndrome – a life-threatening condition.", recommendation: "Avoid combining. Seek alternative pain management." },
  { drugs: ["diazepam", "opioid"], severity: "severe", description: "Combined CNS depression can cause respiratory failure.", recommendation: "Never combine without strict medical oversight." },
  { drugs: ["acetaminophen", "alcohol"], severity: "moderate", description: "Increased risk of liver damage.", recommendation: "Avoid alcohol when taking acetaminophen regularly." },
  { drugs: ["paracetamol", "alcohol"], severity: "moderate", description: "Increased risk of liver damage.", recommendation: "Avoid alcohol when taking paracetamol regularly." },
  { drugs: ["metformin", "contrast dye"], severity: "severe", description: "Risk of kidney damage and lactic acidosis.", recommendation: "Stop metformin before and after contrast procedures." },
  { drugs: ["warfarin", "vitamin k"], severity: "moderate", description: "Vitamin K counteracts warfarin's blood-thinning effect.", recommendation: "Maintain consistent vitamin K intake." },
  { drugs: ["atorvastatin", "grapefruit"], severity: "mild", description: "Grapefruit increases statin levels in blood.", recommendation: "Avoid large amounts of grapefruit." },
  { drugs: ["amlodipine", "simvastatin"], severity: "moderate", description: "Amlodipine increases simvastatin levels, raising muscle damage risk.", recommendation: "Limit simvastatin to 20mg daily with amlodipine." },
  { drugs: ["losartan", "potassium"], severity: "moderate", description: "ARBs can raise potassium; supplements increase hyperkalemia risk.", recommendation: "Monitor potassium levels." },
  { drugs: ["prednisone", "ibuprofen"], severity: "moderate", description: "Increased GI bleeding and ulcer risk.", recommendation: "Use stomach-protective medication if both needed." },
  { drugs: ["insulin", "metformin"], severity: "mild", description: "Increased risk of hypoglycemia when combined.", recommendation: "Monitor blood sugar closely and adjust doses." },
  { drugs: ["levothyroxine", "calcium"], severity: "moderate", description: "Calcium reduces levothyroxine absorption.", recommendation: "Take levothyroxine 4 hours apart from calcium." },
  { drugs: ["levothyroxine", "iron"], severity: "moderate", description: "Iron reduces levothyroxine absorption.", recommendation: "Space doses at least 4 hours apart." },
  { drugs: ["digoxin", "amiodarone"], severity: "severe", description: "Amiodarone increases digoxin levels significantly.", recommendation: "Reduce digoxin dose by 50% when starting amiodarone." },
  { drugs: ["sildenafil", "nitroglycerin"], severity: "severe", description: "Dangerous drop in blood pressure.", recommendation: "Never combine. Can be life-threatening." },
  { drugs: ["lithium", "ibuprofen"], severity: "severe", description: "NSAIDs increase lithium levels, risking toxicity.", recommendation: "Use acetaminophen for pain instead." },
];

export function checkInteractions(medicineNames: string[]): DrugInteraction[] {
  const names = medicineNames.map(n => n.toLowerCase().trim()).filter(Boolean);
  const found: DrugInteraction[] = [];
  
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      for (const interaction of drugInteractions) {
        const [a, b] = interaction.drugs.map(d => d.toLowerCase());
        if (
          (names[i].includes(a) || a.includes(names[i])) &&
          (names[j].includes(b) || b.includes(names[j]))
        ) {
          found.push(interaction);
        } else if (
          (names[i].includes(b) || b.includes(names[i])) &&
          (names[j].includes(a) || a.includes(names[j]))
        ) {
          found.push(interaction);
        }
      }
    }
  }
  
  return found;
}
