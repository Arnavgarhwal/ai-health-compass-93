// Disease Information Data
export const diseases = [
  {
    id: 1,
    name: "Type 2 Diabetes",
    category: "Metabolic",
    description: "A chronic condition affecting how the body processes blood sugar (glucose).",
    symptoms: ["Increased thirst", "Frequent urination", "Blurred vision", "Fatigue", "Slow-healing sores"],
    treatments: ["Lifestyle changes", "Oral medications", "Insulin therapy", "Blood sugar monitoring"],
    prevention: ["Maintain healthy weight", "Regular exercise", "Balanced diet", "Regular checkups"],
    severity: "Chronic",
    image: "🩺"
  },
  {
    id: 2,
    name: "Hypertension",
    category: "Cardiovascular",
    description: "High blood pressure that can lead to serious health problems if untreated.",
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness", "Chest pain"],
    treatments: ["ACE inhibitors", "Beta-blockers", "Diuretics", "Lifestyle modifications"],
    prevention: ["Reduce sodium intake", "Regular exercise", "Limit alcohol", "Manage stress"],
    severity: "Chronic",
    image: "❤️"
  },
  {
    id: 3,
    name: "Asthma",
    category: "Respiratory",
    description: "A condition in which airways narrow and swell, producing extra mucus.",
    symptoms: ["Wheezing", "Coughing", "Chest tightness", "Shortness of breath", "Trouble sleeping"],
    treatments: ["Inhaled corticosteroids", "Bronchodilators", "Allergy medications", "Immunotherapy"],
    prevention: ["Identify triggers", "Air quality monitoring", "Regular medication", "Flu vaccination"],
    severity: "Chronic",
    image: "🫁"
  },
  {
    id: 4,
    name: "Migraine",
    category: "Neurological",
    description: "A headache of varying intensity, often with nausea and sensitivity to light.",
    symptoms: ["Throbbing pain", "Nausea", "Light sensitivity", "Aura", "Vomiting"],
    treatments: ["Pain relievers", "Triptans", "Anti-nausea drugs", "Preventive medications"],
    prevention: ["Regular sleep", "Stay hydrated", "Stress management", "Avoid triggers"],
    severity: "Episodic",
    image: "🧠"
  },
  {
    id: 5,
    name: "Arthritis",
    category: "Musculoskeletal",
    description: "Inflammation of one or more joints, causing pain and stiffness.",
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced motion", "Redness"],
    treatments: ["Anti-inflammatory drugs", "Physical therapy", "Surgery", "Joint injections"],
    prevention: ["Maintain weight", "Regular exercise", "Protect joints", "Balanced diet"],
    severity: "Chronic",
    image: "🦴"
  },
  {
    id: 6,
    name: "Anxiety Disorder",
    category: "Mental Health",
    description: "A mental health disorder characterized by excessive worry and fear.",
    symptoms: ["Nervousness", "Rapid heartbeat", "Sweating", "Trembling", "Fatigue"],
    treatments: ["Psychotherapy", "Medications", "Relaxation techniques", "Support groups"],
    prevention: ["Regular exercise", "Adequate sleep", "Limit caffeine", "Social support"],
    severity: "Chronic",
    image: "🧘"
  },
  {
    id: 7,
    name: "Common Cold",
    category: "Infectious",
    description: "A viral infection of the upper respiratory tract.",
    symptoms: ["Runny nose", "Sore throat", "Cough", "Congestion", "Sneezing"],
    treatments: ["Rest", "Fluids", "Over-the-counter meds", "Throat lozenges"],
    prevention: ["Hand washing", "Avoid close contact", "Boost immunity", "Stay warm"],
    severity: "Acute",
    image: "🤧"
  },
  {
    id: 8,
    name: "Gastritis",
    category: "Digestive",
    description: "Inflammation of the stomach lining causing digestive issues.",
    symptoms: ["Stomach pain", "Nausea", "Bloating", "Indigestion", "Loss of appetite"],
    treatments: ["Antacids", "H2 blockers", "Proton pump inhibitors", "Antibiotics"],
    prevention: ["Limit alcohol", "Avoid spicy foods", "Manage stress", "Eat regularly"],
    severity: "Acute/Chronic",
    image: "🫃"
  }
];

export const categories = ["All", "Metabolic", "Cardiovascular", "Respiratory", "Neurological", "Musculoskeletal", "Mental Health", "Infectious", "Digestive"];

// Medicine Data
export const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: 5.99,
    description: "For relief of mild to moderate pain and fever",
    dosage: "1-2 tablets every 4-6 hours",
    inStock: true,
    prescription: false,
    image: "💊"
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    price: 12.99,
    description: "Antibiotic for bacterial infections",
    dosage: "As directed by physician",
    inStock: true,
    prescription: true,
    image: "💉"
  },
  {
    id: 3,
    name: "Omeprazole 20mg",
    category: "Digestive",
    price: 8.49,
    description: "For acid reflux and heartburn",
    dosage: "1 capsule daily before breakfast",
    inStock: true,
    prescription: false,
    image: "🔵"
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    category: "Allergy",
    price: 6.99,
    description: "Antihistamine for allergies",
    dosage: "1 tablet daily",
    inStock: true,
    prescription: false,
    image: "🟡"
  },
  {
    id: 5,
    name: "Metformin 500mg",
    category: "Diabetes",
    price: 15.99,
    description: "For type 2 diabetes management",
    dosage: "As directed by physician",
    inStock: true,
    prescription: true,
    image: "🟢"
  },
  {
    id: 6,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    price: 7.49,
    description: "Anti-inflammatory pain reliever",
    dosage: "1 tablet every 6-8 hours",
    inStock: false,
    prescription: false,
    image: "🔴"
  },
  {
    id: 7,
    name: "Vitamin D3 1000IU",
    category: "Vitamins",
    price: 9.99,
    description: "Daily vitamin D supplement",
    dosage: "1 capsule daily with food",
    inStock: true,
    prescription: false,
    image: "☀️"
  },
  {
    id: 8,
    name: "Atorvastatin 10mg",
    category: "Cardiovascular",
    price: 18.99,
    description: "For cholesterol management",
    dosage: "1 tablet daily",
    inStock: true,
    prescription: true,
    image: "❤️"
  }
];

export const medicineCategories = ["All", "Pain Relief", "Antibiotics", "Digestive", "Allergy", "Diabetes", "Vitamins", "Cardiovascular"];

// Diagnostic Tests Data
export const diagnosticTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Blood Tests",
    price: 25.00,
    description: "Measures different components of blood including RBC, WBC, and platelets",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: false,
    image: "🩸"
  },
  {
    id: 2,
    name: "Lipid Profile",
    category: "Blood Tests",
    price: 35.00,
    description: "Measures cholesterol and triglyceride levels",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: true,
    image: "💧"
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    category: "Hormone Tests",
    price: 45.00,
    description: "Evaluates thyroid gland function",
    turnaround: "48 hours",
    homeCollection: true,
    fasting: false,
    image: "🦋"
  },
  {
    id: 4,
    name: "Chest X-Ray",
    category: "Imaging",
    price: 60.00,
    description: "Imaging of chest, lungs, and heart",
    turnaround: "Same day",
    homeCollection: false,
    fasting: false,
    image: "📷"
  },
  {
    id: 5,
    name: "MRI Brain",
    category: "Imaging",
    price: 350.00,
    description: "Detailed imaging of brain structures",
    turnaround: "2-3 days",
    homeCollection: false,
    fasting: false,
    image: "🧲"
  },
  {
    id: 6,
    name: "Blood Glucose Fasting",
    category: "Blood Tests",
    price: 15.00,
    description: "Measures blood sugar after fasting",
    turnaround: "Same day",
    homeCollection: true,
    fasting: true,
    image: "🍬"
  },
  {
    id: 7,
    name: "Kidney Function Test",
    category: "Blood Tests",
    price: 40.00,
    description: "Evaluates kidney health and function",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: false,
    image: "🫘"
  },
  {
    id: 8,
    name: "CT Scan Abdomen",
    category: "Imaging",
    price: 250.00,
    description: "Cross-sectional imaging of abdominal organs",
    turnaround: "1-2 days",
    homeCollection: false,
    fasting: true,
    image: "🔬"
  },
  {
    id: 9,
    name: "Vitamin D Test",
    category: "Vitamin Tests",
    price: 30.00,
    description: "Measures vitamin D levels in blood",
    turnaround: "24 hours",
    homeCollection: true,
    fasting: false,
    image: "☀️"
  },
  {
    id: 10,
    name: "ECG/EKG",
    category: "Cardiac Tests",
    price: 50.00,
    description: "Records electrical activity of the heart",
    turnaround: "Same day",
    homeCollection: false,
    fasting: false,
    image: "💓"
  }
];

export const testCategories = ["All", "Blood Tests", "Hormone Tests", "Imaging", "Vitamin Tests", "Cardiac Tests"];

// Doctor Data
export const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: 15,
    rating: 4.9,
    reviews: 234,
    education: "MD, Harvard Medical School",
    languages: ["English", "Spanish"],
    consultationFee: 150,
    nextAvailable: "Today",
    image: "👩‍⚕️",
    about: "Specializing in preventive cardiology and heart disease management with 15 years of experience."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Medicine",
    experience: 12,
    rating: 4.8,
    reviews: 189,
    education: "MD, Johns Hopkins University",
    languages: ["English", "Mandarin"],
    consultationFee: 100,
    nextAvailable: "Today",
    image: "👨‍⚕️",
    about: "Comprehensive primary care with focus on preventive medicine and chronic disease management."
  },
  {
    id: 3,
    name: "Dr. Emily Williams",
    specialty: "Dermatology",
    experience: 10,
    rating: 4.7,
    reviews: 156,
    education: "MD, Stanford University",
    languages: ["English"],
    consultationFee: 120,
    nextAvailable: "Tomorrow",
    image: "👩‍⚕️",
    about: "Expert in medical and cosmetic dermatology, treating various skin conditions."
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: 18,
    rating: 4.9,
    reviews: 312,
    education: "MD, Yale School of Medicine",
    languages: ["English", "French"],
    consultationFee: 175,
    nextAvailable: "Today",
    image: "👨‍⚕️",
    about: "Specialized in sports medicine and joint replacement surgery."
  },
  {
    id: 5,
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    experience: 8,
    rating: 4.8,
    reviews: 145,
    education: "MD, Columbia University",
    languages: ["English", "Hindi"],
    consultationFee: 90,
    nextAvailable: "Today",
    image: "👩‍⚕️",
    about: "Dedicated to providing comprehensive healthcare for children and adolescents."
  },
  {
    id: 6,
    name: "Dr. Robert Davis",
    specialty: "Neurology",
    experience: 20,
    rating: 4.9,
    reviews: 278,
    education: "MD, Mayo Clinic",
    languages: ["English"],
    consultationFee: 200,
    nextAvailable: "In 2 days",
    image: "👨‍⚕️",
    about: "Expert in treating neurological disorders including migraines, epilepsy, and movement disorders."
  },
  {
    id: 7,
    name: "Dr. Lisa Anderson",
    specialty: "Psychiatry",
    experience: 14,
    rating: 4.7,
    reviews: 198,
    education: "MD, UCLA",
    languages: ["English", "Spanish"],
    consultationFee: 180,
    nextAvailable: "Tomorrow",
    image: "👩‍⚕️",
    about: "Specializing in anxiety, depression, and mood disorders with a holistic approach."
  },
  {
    id: 8,
    name: "Dr. Ahmed Hassan",
    specialty: "Gastroenterology",
    experience: 11,
    rating: 4.8,
    reviews: 167,
    education: "MD, Duke University",
    languages: ["English", "Arabic"],
    consultationFee: 140,
    nextAvailable: "Today",
    image: "👨‍⚕️",
    about: "Expert in digestive system disorders and liver diseases."
  }
];

export const specialties = ["All", "Cardiology", "General Medicine", "Dermatology", "Orthopedics", "Pediatrics", "Neurology", "Psychiatry", "Gastroenterology"];

// Time Slots
export const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM"
];

// AI Symptom Analyzer Responses
export const symptomResponses: Record<string, { condition: string; severity: string; advice: string; shouldSeeDoctor: boolean }> = {
  headache: {
    condition: "Possible tension headache or migraine",
    severity: "Low to Moderate",
    advice: "Rest in a quiet, dark room. Stay hydrated and consider over-the-counter pain relief. If headaches persist for more than 3 days or are severe, consult a doctor.",
    shouldSeeDoctor: false
  },
  fever: {
    condition: "Possible viral or bacterial infection",
    severity: "Moderate",
    advice: "Monitor temperature regularly. Rest and stay hydrated. Take fever-reducing medication if needed. Seek medical attention if fever exceeds 103°F (39.4°C) or lasts more than 3 days.",
    shouldSeeDoctor: true
  },
  cough: {
    condition: "Possible respiratory infection or allergies",
    severity: "Low to Moderate",
    advice: "Stay hydrated, use honey for soothing, and consider over-the-counter cough medication. If cough persists for more than 2 weeks or produces blood, see a doctor immediately.",
    shouldSeeDoctor: false
  },
  "chest pain": {
    condition: "Requires immediate medical attention",
    severity: "High",
    advice: "Chest pain can indicate serious conditions. If accompanied by shortness of breath, arm pain, or sweating, seek emergency medical care immediately.",
    shouldSeeDoctor: true
  },
  fatigue: {
    condition: "Possible causes include stress, poor sleep, or underlying conditions",
    severity: "Low to Moderate",
    advice: "Ensure adequate sleep (7-9 hours), maintain balanced nutrition, and manage stress. If fatigue persists for more than 2 weeks despite lifestyle changes, consult a doctor.",
    shouldSeeDoctor: false
  },
  nausea: {
    condition: "Possible digestive issues or viral infection",
    severity: "Low to Moderate",
    advice: "Eat small, bland meals. Stay hydrated with clear fluids. Avoid strong odors. If nausea persists for more than 48 hours or is accompanied by severe abdominal pain, seek medical care.",
    shouldSeeDoctor: false
  },
  "stomach pain": {
    condition: "Possible digestive issues, gastritis, or other conditions",
    severity: "Moderate",
    advice: "Avoid spicy and fatty foods. Eat smaller meals. If pain is severe, persistent, or accompanied by fever or vomiting, consult a doctor.",
    shouldSeeDoctor: true
  },
  dizziness: {
    condition: "Possible causes include dehydration, low blood pressure, or inner ear issues",
    severity: "Moderate",
    advice: "Sit or lie down immediately. Stay hydrated. Avoid sudden movements. If dizziness is frequent or accompanied by fainting, seek medical evaluation.",
    shouldSeeDoctor: true
  }
};
