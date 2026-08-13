export const CLASS_NAMES = [
  'Actinic Keratosis',
  'Basal Cell Carcinoma',
  'Benign Keratosis',
  'Dermatofibroma',
  'Melanoma',
  'Melanocytic Nevus',
  'Squamous Cell Carcinoma',
  'Vascular Lesion',
]

export const mockPatient = {
  age: 48,
  gender: 'Female',
  region: 'abdomen',
}

export const mockScanImage = {
  fileName: 'skin-sample-08122026.jpg',
  source: 'upload',
  analyzedAt: 'Aug 12, 2026 · 2:14 PM',
}

export const mockConfidentResult = {
  isDemo: true,
  patient: mockPatient,
  image: mockScanImage,
  prediction: {
    className: 'Benign Keratosis',
    confidence: 0.892,
    riskLevel: 'low',
    topPredictions: [
      { className: 'Benign Keratosis', probability: 0.892 },
      { className: 'Melanocytic Nevus', probability: 0.071 },
      { className: 'Melanoma', probability: 0.037 },
    ],
  },
  uncertainty: {
    isUncertain: false,
  },
  guidance: {
    dos: [
      'Track the lesion over time with regular photos and notes.',
      "Monitor size, shape, color, and texture for changes.",
      'Use sun protection (broad-spectrum SPF) on the affected area.',
      'Keep the area clean and avoid irritating clothing or friction.',
      "Consult a dermatologist if the lesion changes or you notice anything new.",
    ],
    avoid: [
      'Do not diagnose yourself or treat based on this result alone.',
      'Do not scratch, pick, or remove the lesion yourself.',
      'Do not apply home remedies or acids to the affected area.',
      'Do not ignore persistent itching, bleeding, or changes.',
      'Do not treat this as a replacement for professional screening.',
    ],
  },
  nextSteps: [
    'Perform a self examination of the area in a few weeks.',
    'Consult a qualified dermatologist for a professional evaluation.',
    'Schedule a full-body skin check if you have not had one recently.',
  ],
  disclaimer:
    'AI-assisted preliminary information. This is not a medical diagnosis.',
}

export const mockUncertainResult = {
  isDemo: true,
  patient: mockPatient,
  image: mockScanImage,
  prediction: {
    className: null,
    confidence: null,
    riskLevel: 'uncertain',
    topPredictions: [
      { className: 'Melanocytic Nevus', probability: 0.40 },
      { className: 'Benign Keratosis', probability: 0.40 },
      { className: 'Melanoma', probability: 0.20 },
    ],
  },
  uncertainty: {
    isUncertain: true,
    message:
      'Several conditions received similar prediction scores. The AI could not confidently distinguish between them.',
  },
  guidance: {
    dos: [
      'Take a clear, well-lit photo of the area and repeat the check.',
      'Monitor for any change in size, color, or shape over time.',
      'Keep a record of the exact location and appearance.',
      'Consult a qualified dermatologist as soon as possible.',
    ],
    avoid: [
      'Do not assume any single condition from this result.',
      'Do not delay a professional consultation based on this result.',
      'Do not use home remedies or over-the-counter treatments for this area.',
    ],
  },
  nextSteps: [
    'Re-run the analysis with a clearer image if possible.',
    'Consult a qualified dermatologist promptly for confirmation.',
    'Bring the affected area and this report to your consultation.',
  ],
  disclaimer:
    'AI-assisted preliminary information. This is not a medical diagnosis.',
}

export const mockHighRiskResult = {
  isDemo: true,
  patient: { ...mockPatient, age: 63, gender: 'Male', region: 'back' },
  image: mockScanImage,
  prediction: {
    className: 'Melanoma',
    confidence: 0.78,
    riskLevel: 'high',
    topPredictions: [
      { className: 'Melanoma', probability: 0.78 },
      { className: 'Actinic Keratosis', probability: 0.13 },
      { className: 'Basal Cell Carcinoma', probability: 0.09 },
    ],
  },
  uncertainty: {
    isUncertain: false,
  },
  guidance: {
    dos: [
      'This is a preliminary AI signal — not a confirmed diagnosis.',
      'See a qualified dermatologist or healthcare provider promptly.',
      'Document the lesion with photos from today for your visit.',
      'Follow professional advice for any follow-up tests or biopsy.',
    ],
    avoid: [
      'Do not ignore or delay a professional consultation.',
      'Do not attempt to treat or remove the lesion yourself.',
      'Do not rely on this result as a definitive answer.',
    ],
  },
  nextSteps: [
    'Book an appointment with a dermatologist as soon as possible.',
    'Bring this report and current photos to your consultation.',
    'Ask your clinician about next diagnostic steps.',
  ],
  disclaimer:
    'AI-assisted preliminary information. This is not a medical diagnosis.',
}