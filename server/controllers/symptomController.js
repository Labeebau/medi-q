const axios = require('axios');

// Expanded Clinical Triage Engine with Gynecology, Pediatrics, ENT, Ophthalmology, Urology, Psychiatry
const analyzeClinicalSymptoms = (symptomsText) => {
  const text = (symptomsText || '').toLowerCase();

  // Gynecology & Obstetrics
  if (
    text.includes('gynecolog') ||
    text.includes('gynaecolog') ||
    text.includes('pregnancy') ||
    text.includes('period') ||
    text.includes('menstrual') ||
    text.includes('pelvic') ||
    text.includes('ovarian') ||
    text.includes('uterus') ||
    text.includes('cramp')
  ) {
    return {
      recommendedDepartment: 'Gynecology',
      confidence: '95%',
      possibleDiseases: ['Dysmenorrhea / Pelvic Cramps', 'Polycystic Ovarian Syndrome (PCOS)', 'Hormonal Imbalance'],
    };
  }

  // Pediatrics
  if (
    text.includes('child') ||
    text.includes('infant') ||
    text.includes('baby') ||
    text.includes('pediatric') ||
    text.includes('paediatric') ||
    text.includes('toddler')
  ) {
    return {
      recommendedDepartment: 'Pediatrics',
      confidence: '94%',
      possibleDiseases: ['Pediatric Viral Infection', 'Childhood Upper Respiratory Infection', 'Infant Colic'],
    };
  }

  // ENT (Ear, Nose, Throat)
  if (
    text.includes('ear') ||
    text.includes('nose') ||
    text.includes('throat') ||
    text.includes('sinus') ||
    text.includes('tonsil') ||
    text.includes('hearing')
  ) {
    return {
      recommendedDepartment: 'ENT (Ear, Nose, Throat)',
      confidence: '93%',
      possibleDiseases: ['Acute Sinusitis', 'Tonsillitis', 'Otitis Media / Ear Infection'],
    };
  }

  // Ophthalmology / Eye Care
  if (
    text.includes('eye') ||
    text.includes('vision') ||
    text.includes('blur') ||
    text.includes('cataract') ||
    text.includes('cornea') ||
    text.includes('optic')
  ) {
    return {
      recommendedDepartment: 'Ophthalmology',
      confidence: '96%',
      possibleDiseases: ['Conjunctivitis / Pink Eye', 'Refractive Vision Error', 'Ocular Dryness'],
    };
  }

  // Urology
  if (
    text.includes('urine') ||
    text.includes('urinary') ||
    text.includes('bladder') ||
    text.includes('kidney') ||
    text.includes('prostate')
  ) {
    return {
      recommendedDepartment: 'Urology',
      confidence: '92%',
      possibleDiseases: ['Urinary Tract Infection (UTI)', 'Renal / Kidney Calculus', 'Bladder Irritation'],
    };
  }

  // Psychiatry / Mental Health
  if (
    text.includes('anxiety') ||
    text.includes('depression') ||
    text.includes('stress') ||
    text.includes('insomnia') ||
    text.includes('panic')
  ) {
    return {
      recommendedDepartment: 'Psychiatry',
      confidence: '90%',
      possibleDiseases: ['Generalized Anxiety', 'Insomnia / Sleep Disruption', 'Stress Reaction'],
    };
  }

  // Cardiology
  if (
    text.includes('chest') ||
    text.includes('heart') ||
    text.includes('palpitation') ||
    text.includes('cardiac') ||
    text.includes('blood pressure')
  ) {
    return {
      recommendedDepartment: 'Cardiology',
      confidence: '94%',
      possibleDiseases: ['Angina Pectoris', 'Acid Reflux / Heartburn', 'Cardiovascular Strain'],
    };
  }

  // Pulmonology
  if (
    text.includes('cough') ||
    text.includes('breath') ||
    text.includes('lung') ||
    text.includes('wheez') ||
    text.includes('asthma')
  ) {
    return {
      recommendedDepartment: 'Pulmonology',
      confidence: '92%',
      possibleDiseases: ['Acute Bronchitis', 'Upper Respiratory Infection', 'Asthma Flare'],
    };
  }

  // Neurology
  if (
    text.includes('headache') ||
    text.includes('dizzy') ||
    text.includes('migraine') ||
    text.includes('numb') ||
    text.includes('vertigo')
  ) {
    return {
      recommendedDepartment: 'Neurology',
      confidence: '90%',
      possibleDiseases: ['Migraine Headache', 'Tension Headache', 'Vertigo'],
    };
  }

  // Dermatology
  if (
    text.includes('skin') ||
    text.includes('rash') ||
    text.includes('itch') ||
    text.includes('eczema')
  ) {
    return {
      recommendedDepartment: 'Dermatology',
      confidence: '95%',
      possibleDiseases: ['Contact Dermatitis', 'Urticaria / Hives', 'Allergic Rash'],
    };
  }

  // Orthopedics
  if (
    text.includes('joint') ||
    text.includes('bone') ||
    text.includes('knee') ||
    text.includes('back') ||
    text.includes('fracture')
  ) {
    return {
      recommendedDepartment: 'Orthopedics',
      confidence: '91%',
      possibleDiseases: ['Joint Inflammation / Arthritis', 'Musculoskeletal Strain', 'Tendinitis'],
    };
  }

  // Gastroenterology
  if (
    text.includes('stomach') ||
    text.includes('nausea') ||
    text.includes('vomit') ||
    text.includes('diarrhea') ||
    text.includes('abdomen')
  ) {
    return {
      recommendedDepartment: 'Gastroenterology',
      confidence: '89%',
      possibleDiseases: ['Acute Gastritis', 'Gastroenteritis', 'Indigestion'],
    };
  }

  // General Medicine Fallback
  return {
    recommendedDepartment: 'General Medicine',
    confidence: '86%',
    possibleDiseases: ['Viral Syndrome', 'General Fatigue', 'Seasonal Malaise'],
  };
};

// @desc    Analyze symptoms using Gemini AI or Clinical Engine
// @route   POST /api/symptoms/analyze
const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symptoms text to analyze.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Call Gemini API if key is valid
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey.length > 10) {
      try {
        const promptText = `Act as a medical triage system. Analyze patient symptoms: "${symptoms}".
Return strictly valid JSON without markdown fences:
{
  "recommendedDepartment": "Gynecology" | "Pediatrics" | "ENT (Ear, Nose, Throat)" | "Ophthalmology" | "Urology" | "Psychiatry" | "Cardiology" | "Pulmonology" | "Neurology" | "Dermatology" | "Orthopedics" | "Gastroenterology" | "General Medicine",
  "confidence": "90%",
  "possibleDiseases": ["Disease 1", "Disease 2", "Disease 3"]
}`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          { contents: [{ parts: [{ text: promptText }] }] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 8000 }
        );

        const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const cleanedText = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedJSON = JSON.parse(cleanedText);
          return res.status(200).json({
            success: true,
            source: 'Gemini AI',
            data: parsedJSON,
          });
        }
      } catch (geminiErr) {
        console.warn('[Medi-Q] Gemini API call error, using clinical triage fallback:', geminiErr.message);
      }
    }

    // 2. Clinical Rule Engine Triage
    const analysisResult = analyzeClinicalSymptoms(symptoms);
    return res.status(200).json({
      success: true,
      source: 'Clinical Triage Engine',
      data: analysisResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error analyzing symptoms',
    });
  }
};

module.exports = { analyzeSymptoms, analyzeClinicalSymptoms };
