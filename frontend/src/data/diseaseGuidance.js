// Disease-specific educational guidance keyed by the EXACT class names
// returned by the backend (see backend/app/config.py CLASS_NAMES).
//
// This file is the canonical ENGLISH reference and source-of-truth for
// the guidance content and its authoritative source metadata. Reviewed
// translations for the other languages live in translations.js under
// the `diseaseGuidance` key and are resolved via the language context.
//
// MEDICAL SAFETY:
//   - This is AI-assisted EDUCATIONAL guidance for the PREDICTED class.
//     It is NOT a diagnosis, a prescription, or a treatment plan.
//   - The app always prefixes the class with "AI prediction:" and shows
//     the medical disclaimer. Do not add diagnosis or treatment language.

export const diseaseGuidance = {
  Melanoma: {
    dos: [
      'Monitor the area for changes in size, shape, color, bleeding, or itching.',
      'Take clear, dated photos so any changes can be compared over time.',
      'Protect skin from the sun with shade, clothing, and broad-spectrum sunscreen.',
      'Seek prompt professional evaluation of a suspicious or changing spot.',
    ],
    donts: [
      'Do not delay professional evaluation of a changing, itching, or bleeding spot.',
      'Do not scratch, cut, burn, or attempt to remove the lesion yourself.',
      'Do not rely on this AI prediction as a diagnosis of melanoma.',
      'Do not ignore a new mole that appears after age 30 or a mole that changes.',
    ],
    whenToSeekCare: [
      'Seek prompt evaluation if a spot is asymmetric, has an irregular border, shows several colors, or is changing.',
      'Seek evaluation if a mole itches, bleeds, or looks different from your other spots.',
    ],
    source: {
      name: 'American Academy of Dermatology',
      url: 'https://www.aad.org/public/diseases/skin-cancer/types/common/melanoma/symptoms',
    },
  },

  'Squamous Cell Carcinoma': {
    dos: [
      'Monitor the area for growth, bleeding, crusting, or any change.',
      'Protect skin from the sun with shade, clothing, and broad-spectrum sunscreen.',
      'Keep a dated photo record of the lesion for comparison.',
      'Seek professional evaluation and follow any follow-up recommendations.',
    ],
    donts: [
      'Do not delay professional evaluation of a growing or non-healing sore.',
      'Do not attempt to treat or remove the lesion yourself.',
      'Do not rely on this AI prediction as a diagnosis of skin cancer.',
      'Do not ignore rough, scaly patches that crust or bleed.',
    ],
    whenToSeekCare: [
      'Seek evaluation if a rough or scaly patch grows, bleeds, or fails to heal.',
      'Seek evaluation if a sore heals and then returns.',
    ],
    source: {
      name: 'American Cancer Society',
      url: 'https://www.cancer.org/cancer/types/basal-and-squamous-cell-skin-cancer/detection-diagnosis-staging/signs-and-symptoms.html',
    },
  },

  'Basal Cell Carcinoma': {
    dos: [
      'Monitor the area for slow growth, bleeding, crusting, or changes.',
      'Protect skin from the sun with shade, clothing, and broad-spectrum sunscreen.',
      'Keep a record of the lesion and any changes.',
      'Seek professional assessment of a bump or sore that does not heal.',
    ],
    donts: [
      'Do not attempt to remove or destroy the lesion yourself.',
      'Do not delay evaluation of a bleeding or non-healing sore.',
      'Do not rely on this AI prediction as a diagnosis.',
      'Do not ignore a firm, round, or shiny growth that changes.',
    ],
    whenToSeekCare: [
      'Seek evaluation if a bump or sore bleeds, crusts, heals, and then returns.',
      'Seek evaluation if a spot looks like a scar or has a center that dips inward.',
    ],
    source: {
      name: 'American Academy of Dermatology',
      url: 'https://www.aad.org/public/diseases/skin-cancer/basal-cell-carcinoma',
    },
  },

  'Actinic Keratosis': {
    dos: [
      'Protect skin from the sun daily, since actinic keratoses are sun-related.',
      'Monitor rough, scaly, or changing areas of skin.',
      'Seek professional evaluation, as actinic keratoses can be associated with an increased risk of squamous cell carcinoma.',
      'Keep a dated photo record of affected areas.',
    ],
    donts: [
      'Do not scrape, cut, burn, or try to remove the lesion yourself.',
      'Do not rely on this AI prediction as a diagnosis.',
      'Do not ignore areas that feel rough or scaly on sun-exposed skin.',
    ],
    whenToSeekCare: [
      'Seek professional evaluation for rough, scaly spots, especially on sun-exposed areas.',
      'Seek evaluation if an area changes, bleeds, crusts, or becomes sore.',
    ],
    source: {
      name: 'American Academy of Dermatology',
      url: 'https://www.aad.org/public/diseases/skin-cancer/actinic-keratosis-overview',
    },
  },

  'Benign Keratosis': {
    dos: [
      'Note that benign keratoses are common growths that are often harmless.',
      'Observe the growth for changes if a professional has confirmed it is benign.',
      'Seek professional evaluation if the growth changes, becomes irritated, or bleeds.',
      'Use sun protection and regular skin checks as general care.',
    ],
    donts: [
      'Do not attempt home removal methods such as cutting, freezing, or burning.',
      'Do not rely on this AI prediction as a diagnosis.',
      'Do not ignore a growth that changes, bleeds, or is uncertain.',
    ],
    whenToSeekCare: [
      'Seek evaluation if a growth changes, bleeds, becomes irritated, or the diagnosis is uncertain.',
      'Seek evaluation if a wart-like growth grows rapidly or looks unusual.',
    ],
    source: {
      name: 'American Academy of Dermatology',
      url: 'https://www.aad.org/public/diseases/a-z/seborrheic-keratoses-overview',
    },
  },

  Dermatofibroma: {
    dos: [
      'Note that dermatofibromas are common nodules that are usually benign.',
      'Monitor the nodule for any change in size, color, or symptoms.',
      'Seek professional assessment if the nodule changes or becomes painful.',
      'Use gentle skin care and sun protection as general care.',
    ],
    donts: [
      'Do not attempt to remove the nodule yourself.',
      'Do not rely on this AI prediction as a diagnosis.',
      'Do not ignore a firm nodule that changes or grows.',
    ],
    whenToSeekCare: [
      'Seek assessment if a firm nodule changes, grows, bleeds, or becomes painful.',
      'Seek evaluation if you are unsure whether the growth is new or different.',
    ],
    source: {
      name: 'DermNet',
      url: 'https://dermnetnz.org/topics/dermatofibroma',
    },
  },

  'Melanocytic Nevus': {
    dos: [
      'Note that most moles are harmless.',
      'Monitor moles for changes in size, shape, color, or structure.',
      'Keep a dated record or photos of moles for comparison.',
      'Use sun protection and perform regular skin self-exams.',
    ],
    donts: [
      'Do not cut, shave, or attempt to remove a mole at home.',
      'Do not rely on this AI prediction as a diagnosis.',
      'Do not ignore a new mole after age 30 or a mole that itches, bleeds, or changes.',
    ],
    whenToSeekCare: [
      'Seek assessment if a mole is asymmetric, has irregular borders, shows several colors, or is changing.',
      'Seek evaluation if a mole itches, bleeds, or looks different from your other moles.',
    ],
    source: {
      name: 'American Academy of Dermatology',
      url: 'https://www.aad.org/public/diseases/a-z/when-is-a-mole-a-problem',
    },
  },

  'Vascular Lesion': {
    dos: [
      'Note that "vascular lesion" is a broad class; many such lesions are benign, but appearance alone cannot confirm the exact type.',
      'Monitor unexpected changes or bleeding in the area.',
      'Keep a record of the lesion and any changes.',
      'Seek professional assessment when uncertain or changing.',
    ],
    donts: [
      'Do not attempt destructive home treatment such as freezing, burning, or cutting.',
      'Do not rely on this AI prediction as a diagnosis.',
      'Do not ignore bleeding, rapid growth, or an unusual change.',
    ],
    whenToSeekCare: [
      'Seek assessment if the lesion changes, bleeds, grows, or becomes painful.',
      'Seek evaluation if you are uncertain what the lesion is.',
    ],
    source: {
      name: 'DermNet',
      url: 'https://dermnetnz.org/topics/cherry-angioma',
    },
  },

  general: {
    dos: [
      'Monitor the area for changes in size, shape, or color.',
      'Keep a record or photos of changes for comparison over time.',
      'Consider professional evaluation if the area is concerning or changing.',
    ],
    donts: [
      'Do not scratch, cut, burn, or attempt to remove the lesion yourself.',
      'Do not rely on the AI result as a medical diagnosis.',
      'Do not delay professional evaluation for a concerning or changing lesion.',
    ],
    whenToSeekCare: [
      'Seek professional evaluation if the area changes, bleeds, or concerns you.',
    ],
    source: {
      name: 'American Academy of Dermatology',
      url: 'https://www.aad.org/public/diseases/skin-cancer',
    },
  },
}