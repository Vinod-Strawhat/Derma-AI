# DermaAI Frontend — Demo → Real Integration Checklist

Developer-facing reference for the upcoming backend/model integration.
The frontend (Phase 9) is frozen. Nothing below has been implemented yet —
it documents what is currently mocked and what it will be replaced with.

## Current demo/mock sources

| Concern | In demo | Will be replaced by |
| --- | --- | --- |
| Prediction class | `src/data/mockResults.js` (scenario mocks) | Real multimodal model output |
| Confidence score | `mockConfidentResult.prediction.confidence` etc. | Real model softmax confidence |
| Top-3 predictions | `mock*Result.prediction.topPredictions` | Real model top-k outputs |
| Risk level | `riskLevel` fields in `mockHistory.js` / `mockResults.js` | Final risk logic (model + rules) |
| Grad-CAM heatmap | `GradCamCard` / Compare attention placeholders | Real Grad-CAM image |
| Scan history | `src/data/mockHistory.js` (`mockSkinConcerns`) | Persisted database records |
| Scan counts / stats | `Dashboard` derives from `mockHistory`; `mockProfile.js` | User-specific DB aggregates |
| Profile | `src/data/mockProfile.js` ("Demo User") | Authenticated user (auth service) |
| Comparison | `src/data/comparison.js` operates on mock scans | Real scan records per user/concern |
| Dermatologist lookup | Inline note on Results (`dermNotice`) | Real nearby-dermatologist search |
| Scans per concern | Hardcoded demo lists | Real user scan records |

## Where the swap happens

- **Data layer**: `frontend/src/data/*` are the only mock stores. Replace them
  with API-backed modules (fetch/RTK/etc.) keeping the same field shapes so the
  rest of the UI does not need to change.
- **Results flow**: `pages/SkinCheck.jsx` → `pages/Results.jsx` currently
  passes a hardcoded `scenario` in router state. Replace with the API response.
- **Loading states**: reusable `components/LoadingState.jsx` and
  `hooks/useSimulatedLoading.js` simulate the pending UI. Swap the simulated
  timer for real request state (`pending` → data/error).
- **Error states**: `components/ErrorState.jsx` (retry pattern) + key
  `errors.apiScan` are ready for real failures. Never render stack traces.

## Rules to preserve during integration

1. Keep model disease class names untranslated (no approved mapping exists).
2. Keep demo labels visible until real data exists — never let mock data look
   like a real user's data. For new users show `0` scans/concerns/comparisons.
3. Preserve medical-safety wording: "AI-assisted prediction", "preliminary",
   "not a medical diagnosis", "consult a qualified dermatologist". Do not claim
   cure/ progression/ diagnosis confirmation.
4. Comparison must stay neutral (e.g., "AI prediction changed from…",
   "Risk classification changed…"), never clinical progression.
5. Keep key parity across all 5 languages (`en`, `kn`, `te`, `ta`, `hi`) when
   editing `src/data/translations.js`.

## Verified after Phase 9

- Routes: `/`, `/signin`, `/signup`, `/dashboard`, `/skin-check`, `/results`,
  `/history`, `/compare`, `/profile` — all build and serve.
- Production build: `npm run build` passes.
- Language: selector works, persists (`localStorage` `dermaai-language`),
  `document.documentElement.lang` updated, key parity = 385 keys × 5 languages.
- Accessibility: global `:focus-visible`, translated image `alt`, `aria-label`s
  on search/steps, `prefers-reduced-motion` support.