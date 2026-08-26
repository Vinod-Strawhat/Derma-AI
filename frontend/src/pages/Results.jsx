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
  AlertTriangle,
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
import { useTheme } from '../context/ThemeContext'
import { buildImageUrl } from '../api/imageUrl'
import { diseaseGuidance } from '../data/diseaseGuidance'

const availableScenarios = ['confident', 'uncertain', 'high-risk']

const scenarioMap = {
  confident: mockConfidentResult,
  uncertain: mockUncertainResult,
  'high-risk': mockHighRiskResult,
}

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
  const { darkMode } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const loading = useSimulatedLoading(600)

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
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-[#07111F] via-[#0D1B2A] to-[#07111F]' : 'bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
          <button
            onClick={() => navigate('/dashboard')}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('results.back')}
          </button>

          {/* Header */}
          <section className="animate-fade-in-down">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${darkMode ? 'bg-emerald-900/30 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                {t('results.realBadge')}
              </div>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('results.heading')}
            </h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('results.subtitle')}
            </p>
          </section>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-3 space-y-6">
              {/* Prediction summary */}
              <section className="animate-fade-in-up animation-delay-200">
                <ResultSummary result={result} />
              </section>

              {/* Analyzed image */}
              <section className="animate-fade-in-up animation-delay-300">
                <div className="card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                      <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.analyzedImage')}</h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{result.image?.fileName}</p>
                    </div>
                  </div>
                  <div className={`relative aspect-[4/3] rounded-xl overflow-hidden border ${darkMode ? 'border-white/5 bg-[#0D1B2A]' : 'border-gray-100 bg-gray-50/60'}`}>
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
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{result.image?.fileName}</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatTimestamp(result.image?.analyzedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Top predictions */}
              <section className="animate-fade-in-up animation-delay-400">
                <div className="card p-6">
                  <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.topPredictions')}</h3>
                  <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('results.topPredictionsDesc')}
                  </p>
                  <PredictionList predictions={topPredictions} />
                </div>
              </section>

              {/* Grad-CAM - visually prominent */}
              <section className="animate-fade-in-up animation-delay-500">
                <div className={`card p-6 border-2 ${darkMode ? 'border-accent-800/40 bg-gradient-to-br from-accent-900/20 to-[#0D1B2A]' : 'border-accent-100/60 bg-gradient-to-br from-accent-50/20 to-white'}`}>
                  <GradCamCard
                    imageUrl={result.gradcam?.imageUrl}
                    available={imageAvailable}
                  />
                </div>
              </section>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Scan info */}
              <section className="animate-fade-in-up animation-delay-300">
                <div className="card p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                      <Calendar className="w-[18px] h-[18px] text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.scanInfo')}</h3>
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
                        <dt className={`flex-1 min-w-0 leading-snug ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</dt>
                        <dd className={`font-medium text-right flex-shrink-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              {/* Actions */}
              <section className="animate-fade-in-up animation-delay-400">
                <div className="card p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.professionalEvaluation')}</h3>
                      <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                    <div className={`pt-1 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`} />
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
          <section className="animate-fade-in-up animation-delay-500">
            <div className="mb-6">
              <h2 className={`text-xl font-bold tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.guidanceForClass')}</h2>
              {guidanceClassName ? (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('results.aiPrediction')}{' '}
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{guidanceClassName}</span>
                </p>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('results.generalGuidance')}</p>
              )}
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('results.guidanceSubtext')}</p>
            </div>
            <GuidanceCard
              dos={guidance.dos}
              donts={guidance.donts}
              whenToSeekCare={guidance.whenToSeekCare}
              source={guidance.source}
            />
          </section>

          {/* Disclaimer */}
          <section className={`flex items-start gap-3 p-4 rounded-2xl border ${darkMode ? 'bg-amber-900/20 border-amber-800/40' : 'bg-amber-50/80 border-amber-100'}`}>
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              {result.disclaimer || t('results.disclaimer')}
            </p>
          </section>
          <NearbyDermatologistsModal isOpen={dermModalOpen} onClose={() => setDermModalOpen(false)} />
        </div>
      </div>
    )
  }

  // ─── Demo mode ───────────────────────────────────────────────
  const demoGuidance = getDiseaseGuidance(t, demoResult)
  const demoGuidanceClassName = demoGuidance.className

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-[#07111F] via-[#0D1B2A] to-[#07111F]' : 'bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        <button
          onClick={() => navigate('/dashboard')}
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('results.back')}
        </button>

        {/* Header */}
        <section className="animate-fade-in-down">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-3 ${darkMode ? 'bg-amber-900/30 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
            {t('results.demoBadge')}
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('results.heading')}
          </h1>
          <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('results.subtitle')}
          </p>
        </section>

        {/* Scenario switcher (demo only) */}
        <section className="animate-fade-in-up animation-delay-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-medium mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('results.demoScenario')}</span>
            {availableScenarios.map((scenarioKey) => (
              <button
                key={scenarioKey}
                onClick={() => navigate('/results', { state: { scenario: scenarioKey }, replace: true })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  scenario === scenarioKey
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : `${darkMode ? 'bg-[#0D1B2A] text-gray-300 border-white/10 hover:bg-[#142538] hover:border-white/20' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`
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

        {loading ? (
          <section className="animate-fade-in-up animation-delay-300">
            <div className="card">
              <LoadingState message={t('loading.results')} />
            </div>
          </section>
        ) : (
          <>
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-3 space-y-6">
                <section className="animate-fade-in-up animation-delay-300">
                  <ResultSummary result={demoResult} />
                </section>

                <section className="animate-fade-in-up animation-delay-400">
                  <div className="card p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                        <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.analyzedImage')}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{demoResult.image.fileName}</p>
                      </div>
                    </div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary-200 via-medical-200 to-accent-200 dark:from-primary-900/40 dark:via-medical-900/30 dark:to-accent-900/40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4">
                          <ImageIcon className="w-12 h-12 text-primary-700/60 dark:text-primary-300/60 mb-3 mx-auto" />
                          <p className={`text-sm font-medium ${darkMode ? 'text-primary-200' : 'text-primary-800'}`}>
                            {t('results.demoSkinImage')}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-primary-300/70' : 'text-primary-700/70'}`}>
                            {t('results.uploadedWillAppear')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="animate-fade-in-up animation-delay-500">
                  <div className="card p-6">
                    <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.topPredictions')}</h3>
                    <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('results.topPredictionsDesc')}
                    </p>
                    <PredictionList predictions={demoResult.prediction.topPredictions} />
                  </div>
                </section>

                <section className="animate-fade-in-up animation-delay-600">
                  <div className={`card p-6 border-2 ${darkMode ? 'border-accent-800/40 bg-gradient-to-br from-accent-900/20 to-[#0D1B2A]' : 'border-accent-100/60 bg-gradient-to-br from-accent-50/20 to-white'}`}>
                    <GradCamCard />
                  </div>
                </section>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <section className="animate-fade-in-up animation-delay-400">
                  <div className="card p-6">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                        <Calendar className="w-[18px] h-[18px] text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.scanInfo')}</h3>
                    </div>
                    <dl className="space-y-3 text-sm">
                      {[
                        [t('results.dateTime'), demoResult.image.analyzedAt],
                        [t('results.age'), `${demoResult.patient.age} ${t('results.years')}`],
                        [t('results.gender'), demoResult.patient.gender],
                        [t('results.bodyRegion'), demoResult.patient.region.charAt(0).toUpperCase() + demoResult.patient.region.slice(1)],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-3">
                          <dt className={`flex-1 min-w-0 leading-snug ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</dt>
                          <dd className={`font-medium text-right flex-shrink-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </section>

                <section className="animate-fade-in-up animation-delay-500">
                  <div className="card p-6">
                    <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.nextSteps')}</h3>
                    <ul className="space-y-2.5 mb-6">
                      {t(`guidance.${scenarioGuidanceKey}.next`).map((step) => (
                        <li key={step} className={`flex items-start gap-2.5 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-3">
                      <div>
                        <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.professionalEvaluation')}</h3>
                        <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                      <div className={`pt-1 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`} />
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
                <h2 className={`text-xl font-bold tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('results.guidanceForClass')}</h2>
                {demoGuidanceClassName ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('results.aiPrediction')}{' '}
                    <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{demoGuidanceClassName}</span>
                  </p>
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('results.generalGuidance')}</p>
                )}
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('results.guidanceSubtext')}</p>
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
        <section className={`flex items-start gap-3 p-4 rounded-2xl border ${darkMode ? 'bg-amber-900/20 border-amber-800/40' : 'bg-amber-50/80 border-amber-100'}`}>
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
            {t('results.disclaimer')}
          </p>
        </section>
        <NearbyDermatologistsModal isOpen={dermModalOpen} onClose={() => setDermModalOpen(false)} />
      </div>
    </div>
  )
}

export default Results
