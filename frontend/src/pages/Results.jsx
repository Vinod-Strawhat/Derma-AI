import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  GitCompareArrows,
  History,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import ResultSummary from '../components/ResultSummary'
import PredictionList from '../components/PredictionList'
import GradCamCard from '../components/GradCamCard'
import GuidanceCard from '../components/GuidanceCard'
import LoadingState from '../components/LoadingState'
import NearbyDermatologistsModal from '../components/NearbyDermatologistsModal'
import { useSimulatedLoading } from '../hooks/useSimulatedLoading'
import { mockConfidentResult, mockUncertainResult, mockHighRiskResult } from '../data/mockResults'
import { useLanguage } from '../context/LanguageContext'
import { buildImageUrl } from '../api/imageUrl'
import { diseaseGuidance } from '../data/diseaseGuidance'

const availableScenarios = ['confident', 'uncertain', 'high-risk']

const scenarioMap = {
  confident: mockConfidentResult,
  uncertain: mockUncertainResult,
  'high-risk': mockHighRiskResult,
}

// Resolve disease-specific guidance for a result. The class name is
// matched against the canonical diseaseGuidance data; anything unknown
// falls back to the general preliminary guidance.
function getDiseaseGuidance(t, result) {
  const className = result?.prediction?.className
  const guideKey = className && diseaseGuidance[className] ? className : 'general'
  const guide = diseaseGuidance[guideKey]
  const pick = (field) => {
    const value = t(`diseaseGuidance.${guideKey}.${field}`)
    return Array.isArray(value) ? value : guide[field]
  }
  return {
    className,
    guideKey,
    dos: pick('dos'),
    donts: pick('donts'),
    whenToSeekCare: pick('whenToSeekCare'),
    source: guide.source,
  }
}

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch (err) {
    return iso
  }
}

function Results() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const loading = useSimulatedLoading(600)

  // Real API mode: a full API response is passed via router state.
  const realResult = location.state?.result

  const scenario = location.state?.scenario ?? 'confident'
  const selectedResult = scenarioMap[scenario] ?? mockConfidentResult
  const passedPatient = location.state?.patient

  const demoResult = passedPatient
    ? { ...selectedResult, patient: passedPatient }
    : selectedResult

  const [dermModalOpen, setDermModalOpen] = useState(false)

  const scenarioGuidanceKey =
    scenario === 'high-risk' ? 'highRisk' : scenario === 'uncertain' ? 'uncertain' : 'confident'

  if (realResult) {
    const result = realResult
    const topPredictions = result.prediction?.topPredictions ?? []
    const imageAvailable = Boolean(result.gradcam?.available && result.gradcam?.imageUrl)
    const guidance = getDiseaseGuidance(t, result)
    const guidanceClassName = guidance.className

    return (
      <div className="bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('results.back')}
          </button>

          <section className="animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-medical-50 border border-medical-100 text-xs font-medium text-medical-700 mb-4">
              {t('results.realBadge')}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {t('results.heading')}
            </h1>
            <p className="text-base text-gray-500">
              {t('results.subtitle')}
            </p>
          </section>

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-3 space-y-6">
              <section className="animate-fade-in-up animation-delay-300">
                <ResultSummary result={result} />
              </section>

              <section className="animate-fade-in-up animation-delay-400">
                <div className="card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{t('results.analyzedImage')}</h3>
                      <p className="text-xs text-gray-400">{result.image?.fileName}</p>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 bg-gray-50/60">
                    {result.image?.imageUrl ? (
                      <img
                        src={buildImageUrl(result.image.imageUrl)}
                        alt={result.image?.fileName || t('results.analyzedImage')}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4">
                          <ImageIcon className="w-10 h-10 text-primary-500/60 mb-2 mx-auto" />
                          <p className="text-sm font-medium text-gray-600">{result.image?.fileName}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTimestamp(result.image?.analyzedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="animate-fade-in-up animation-delay-500">
                <div className="card p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{t('results.topPredictions')}</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    {t('results.topPredictionsDesc')}
                  </p>
                  <PredictionList predictions={topPredictions} />
                </div>
              </section>

              <section className="animate-fade-in-up animation-delay-600">
                <GradCamCard
                  imageUrl={result.gradcam?.imageUrl}
                  available={imageAvailable}
                />
              </section>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <section className="animate-fade-in-up animation-delay-400">
                <div className="card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Calendar className="w-[18px] h-[18px] text-primary-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{t('results.scanInfo')}</h3>
                  </div>
                  <dl className="space-y-3 text-sm">
                    {[
                      [t('results.dateTime'), formatTimestamp(result.image?.analyzedAt)],
                      [t('results.age'), `${result.patient?.age} ${t('results.years')}`],
                      [t('results.gender'), result.patient?.gender],
                      [
                        t('results.bodyRegion'),
                        result.patient?.region
                          ? result.patient.region.charAt(0).toUpperCase() + result.patient.region.slice(1)
                          : '',
                      ],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <dt className="flex-1 min-w-0 text-gray-500 leading-snug">{label}</dt>
                        <dd className="font-medium text-gray-900 text-right flex-shrink-0">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              <section className="animate-fade-in-up animation-delay-500">
                <div className="card p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{t('results.professionalEvaluation')}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {t('results.considerDermatologist')}
                      </p>
                    </div>
                    <button
                      onClick={() => setDermModalOpen(true)}
                      className="btn-primary w-full !py-3 text-sm"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {t('results.consultDermatologist')}
                    </button>
                    <div className="pt-1 border-t border-gray-100" />
                    <button
                      onClick={() => navigate('/history')}
                      className="btn-secondary w-full !py-3 text-sm"
                    >
                      <History className="w-4 h-4 mr-2" />
                      {t('results.viewHistory')}
                    </button>
                    <button
                      onClick={() => navigate('/compare')}
                      className="btn-secondary w-full !py-3 text-sm"
                    >
                      <GitCompareArrows className="w-4 h-4 mr-2" />
                      {t('results.compareScans')}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Guidance */}
          <section className="animate-fade-in-up animation-delay-600">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">{t('results.guidanceForClass')}</h2>
              {guidanceClassName ? (
                <p className="text-sm text-gray-500">
                  {t('results.aiPrediction')}{' '}
                  <span className="font-semibold text-gray-700">{guidanceClassName}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-500">{t('results.generalGuidance')}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{t('results.guidanceSubtext')}</p>
            </div>
            <GuidanceCard
              dos={guidance.dos}
              donts={guidance.donts}
              whenToSeekCare={guidance.whenToSeekCare}
              source={guidance.source}
            />
          </section>

        <section className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {result.disclaimer || t('results.disclaimer')}
          </p>
        </section>
          <NearbyDermatologistsModal isOpen={dermModalOpen} onClose={() => setDermModalOpen(false)} />
      </div>
    </div>
    )
  }

  const demoGuidance = getDiseaseGuidance(t, demoResult)
  const demoGuidanceClassName = demoGuidance.className

  return (
    <div className="bg-gradient-to-br from-primary-50/60 via-white to-accent-50/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('results.back')}
        </button>

        {/* Header */}
        <section className="animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700 mb-4">
            {t('results.demoBadge')}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {t('results.heading')}
          </h1>
          <p className="text-base text-gray-500">
            {t('results.subtitle')}
          </p>
        </section>

        {/* Scenario switcher (demo only) */}
        <section className="animate-fade-in-up animation-delay-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400 mr-1">{t('results.demoScenario')}</span>
            {availableScenarios.map((scenarioKey) => (
              <button
                key={scenarioKey}
                onClick={() => navigate('/results', { state: { scenario: scenarioKey }, replace: true })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  scenario === scenarioKey
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {scenarioKey === 'confident'
                  ? t('results.scenarioHighConf')
                  : scenarioKey === 'uncertain'
                    ? t('results.scenarioUncertain')
                    : t('results.scenarioHighRisk')}
              </button>
            ))}
          </div>
        </section>

        {/* Main Layout */}
        {loading ? (
          <section className="animate-fade-in-up animation-delay-300">
            <div className="card">
              <LoadingState message={t('loading.results')} />
            </div>
          </section>
        ) : (
          <>
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Left: prediction + image + top3 + explainability */}
          <div className="lg:col-span-3 space-y-6">
            <section className="animate-fade-in-up animation-delay-300">
              <ResultSummary result={demoResult} />
            </section>

            {/* Uploaded image */}
            <section className="animate-fade-in-up animation-delay-400">
              <div className="card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{t('results.analyzedImage')}</h3>
                    <p className="text-xs text-gray-400">{demoResult.image.fileName}</p>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary-200 via-medical-200 to-accent-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <ImageIcon className="w-12 h-12 text-primary-700/60 mb-3 mx-auto" />
                      <p className="text-sm font-medium text-primary-800">
                        {t('results.demoSkinImage')}
                      </p>
                      <p className="text-xs text-primary-700/70 mt-1">
                        {t('results.uploadedWillAppear')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top 3 predictions */}
            <section className="animate-fade-in-up animation-delay-500">
              <div className="card p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('results.topPredictions')}</h3>
                <p className="text-sm text-gray-500 mb-5">
                  {t('results.topPredictionsDesc')}
                </p>
                <PredictionList predictions={demoResult.prediction.topPredictions} />
              </div>
            </section>

            {/* Grad-CAM */}
            <section className="animate-fade-in-up animation-delay-600">
              <GradCamCard />
            </section>
          </div>

          {/* Right: scan info + next steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan information */}
            <section className="animate-fade-in-up animation-delay-400">
              <div className="card p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Calendar className="w-[18px] h-[18px] text-primary-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{t('results.scanInfo')}</h3>
                </div>
                <dl className="space-y-3 text-sm">
                  {[
                    [t('results.dateTime'), demoResult.image.analyzedAt],
                    [t('results.age'), `${demoResult.patient.age} ${t('results.years')}`],
                    [t('results.gender'), demoResult.patient.gender],
                    [t('results.bodyRegion'), demoResult.patient.region.charAt(0).toUpperCase() + demoResult.patient.region.slice(1)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <dt className="flex-1 min-w-0 text-gray-500 leading-snug">{label}</dt>
                      <dd className="font-medium text-gray-900 text-right flex-shrink-0">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* Next steps */}
            <section className="animate-fade-in-up animation-delay-500">
              <div className="card p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('results.nextSteps')}</h3>
                <ul className="space-y-2.5 mb-6">
                  {t(`guidance.${scenarioGuidanceKey}.next`).map((step) => (
                    <li key={step} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{t('results.professionalEvaluation')}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {t('results.considerDermatologist')}
                    </p>
                  </div>
                  <button
                    onClick={() => setDermModalOpen(true)}
                    className="btn-primary w-full !py-3 text-sm"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('results.consultDermatologist')}
                  </button>
                  <div className="pt-1 border-t border-gray-100" />
                  <button
                    onClick={() => navigate('/history')}
                    className="btn-secondary w-full !py-3 text-sm"
                  >
                    <History className="w-4 h-4 mr-2" />
                    {t('results.viewHistory')}
                  </button>
                  <button
                    onClick={() => navigate('/compare')}
                    className="btn-secondary w-full !py-3 text-sm"
                  >
                    <GitCompareArrows className="w-4 h-4 mr-2" />
                    {t('results.compareScans')}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Guidance */}
        <section className="animate-fade-in-up animation-delay-600">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">{t('results.guidanceForClass')}</h2>
            {demoGuidanceClassName ? (
              <p className="text-sm text-gray-500">
                {t('results.aiPrediction')}{' '}
                <span className="font-semibold text-gray-700">{demoGuidanceClassName}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">{t('results.generalGuidance')}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{t('results.guidanceSubtext')}</p>
          </div>
          <GuidanceCard
            dos={demoGuidance.dos}
            donts={demoGuidance.donts}
            whenToSeekCare={demoGuidance.whenToSeekCare}
            source={demoGuidance.source}
          />
        </section>
          </>
        )}

        {/* Disclaimer */}
        <section className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            {t('results.disclaimer')}
          </p>
        </section>
        <NearbyDermatologistsModal isOpen={dermModalOpen} onClose={() => setDermModalOpen(false)} />
      </div>
    </div>
  )
}

export default Results