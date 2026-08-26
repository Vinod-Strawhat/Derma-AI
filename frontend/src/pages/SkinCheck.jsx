import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Camera, ClipboardList, ImageIcon, User, CheckCircle2, Circle } from 'lucide-react'
import SkinImageInput from '../components/SkinImageInput'
import PatientInfoForm from '../components/PatientInfoForm'
import ReviewCard from '../components/ReviewCard'
import { REGION_GROUPS } from '../data/skinCheckOptions'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { analyzeSkin, API_MODE, ApiError } from '../api/predictApi'

function SkinCheck() {
  const { t } = useLanguage()
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  const steps = [
    { number: '01', label: t('skincheck.step1'), icon: ImageIcon },
    { number: '02', label: t('skincheck.step2'), icon: User },
    { number: '03', label: t('skincheck.step3'), icon: ClipboardList },
  ]
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [source, setSource] = useState(null)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [region, setRegion] = useState('')
  const [analysisPending, setAnalysisPending] = useState(false)
  const [error, setError] = useState(null)

  function handleImageChange({ file, source: fileSource }) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImage(file)
    setSource(fileSource)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleImageRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImage(null)
    setPreviewUrl(null)
    setSource(null)
  }

  function handlePatientChange(changes) {
    if (changes.age !== undefined) setAge(changes.age)
    if (changes.gender !== undefined) setGender(changes.gender)
    if (changes.region !== undefined) setRegion(changes.region)
  }

  function handleClear() {
    handleImageRemove()
    setAge('')
    setGender('')
    setRegion('')
    setAnalysisPending(false)
    setError(null)
  }

  function errorMessage(err) {
    if (err instanceof ApiError) {
      const map = {
        network: t('errors.backendUnavailable'),
        timeout: t('errors.timeout'),
        invalidInput: t('errors.invalidInput'),
        unauthorized: t('errors.unauthorized'),
        serverError: t('errors.serverError'),
        malformedResponse: t('errors.malformedResponse'),
      }
      return map[err.code] ?? t('errors.apiScan')
    }
    return t('errors.apiScan')
  }

  function handleAnalyze() {
    if (analysisPending || !allComplete) return
    setError(null)
    setAnalysisPending(true)

    if (!API_MODE) {
      setTimeout(() => {
        navigate('/results', {
          state: {
            scenario: 'confident',
            patient: { age: Number(age), gender, region },
          },
          replace: true,
        })
      }, 1200)
      return
    }

    analyzeSkin({ file: image, age: Number(age), gender, region })
      .then((data) => {
        navigate('/results', {
          state: { result: data },
          replace: true,
        })
      })
      .catch((err) => {
        setAnalysisPending(false)
        setError(errorMessage(err))
      })
  }

  const genderLabel = useMemo(() => {
    if (gender === 'Male') return t('patient.male')
    if (gender === 'Female') return t('patient.female')
    return t('patient.notSpecified')
  }, [gender, t])

  const regionLabel = useMemo(() => {
    if (!region) return ''
    for (const group of REGION_GROUPS) {
      if (group.options.includes(region)) {
        return region.charAt(0).toUpperCase() + region.slice(1)
      }
    }
    return region.charAt(0).toUpperCase() + region.slice(1)
  }, [region])

  const ageValid = age !== '' && age !== null && age !== undefined
  const allComplete = Boolean(image && ageValid && gender && region)

  // Step completion status
  const stepStatus = [
    Boolean(image),
    ageValid && Boolean(gender) && Boolean(region),
    allComplete,
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-[#07111F] via-[#0D1B2A] to-[#07111F]' : 'bg-gradient-to-br from-primary-50/40 via-white to-accent-50/30'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        <Link
          to="/dashboard"
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('skincheck.back')}
        </Link>

        {/* Page header */}
        <section className="animate-fade-in-down">
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('skincheck.heading')}</h1>
          <p className={`text-base md:text-lg max-w-2xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('skincheck.subtext')}
          </p>
        </section>

        {/* Step indicator */}
        <nav aria-label={t('skincheck.stepsAria')} className="animate-fade-in-down animation-delay-200">
          <ol className="grid grid-cols-3 gap-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const completed = stepStatus[index]
              const isCurrent = !completed && (index === 0 || stepStatus[index - 1])
              return (
                <li
                  key={step.number}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 transition-all duration-300 ${
                    isCurrent
                      ? darkMode
                        ? 'border-primary-700 bg-primary-900/30 shadow-sm shadow-primary-900/20'
                        : 'border-primary-200 bg-primary-50/50 shadow-sm'
                      : completed
                        ? darkMode
                          ? 'border-emerald-800 bg-emerald-900/20'
                          : 'border-emerald-200 bg-emerald-50/30'
                        : darkMode
                          ? 'border-gray-700 bg-[#0D1B2A]'
                          : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    completed
                      ? darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'
                      : isCurrent
                        ? darkMode ? 'bg-primary-900/40' : 'bg-primary-100'
                        : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <StepIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wide ${completed ? 'text-emerald-500 dark:text-emerald-400' : isCurrent ? 'text-primary-400 dark:text-primary-300' : 'text-gray-300 dark:text-gray-600'}`}>
                      {t('skincheck.step')} {step.number}
                    </p>
                    <p className={`text-xs sm:text-sm font-semibold truncate ${completed ? 'text-emerald-800 dark:text-emerald-300' : isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step.label}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Left column: image + patient info */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8">
            {/* Section 1 - Skin Image */}
            <section className="animate-fade-in-up animation-delay-200">
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0 ${darkMode ? 'bg-primary-900/40' : 'bg-primary-50'}`}>
                    <Camera className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('skincheck.step1')}</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('skincheck.step1Desc')}
                    </p>
                  </div>
                </div>
                <SkinImageInput
                  image={image}
                  previewUrl={previewUrl}
                  source={source}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>
            </section>

            {/* Section 2 - Patient Information */}
            <section className="animate-fade-in-up animation-delay-300">
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0 ${darkMode ? 'bg-primary-900/40' : 'bg-primary-50'}`}>
                    <User className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('skincheck.step2')}</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('skincheck.step2Desc')}
                    </p>
                  </div>
                </div>
                <PatientInfoForm age={age} gender={gender} region={region} onChange={handlePatientChange} />
              </div>
            </section>
          </div>

          {/* Right column: review & analyze */}
          <aside className="lg:col-span-2 animate-fade-in-up animation-delay-400">
            <div className="lg:sticky lg:top-24">
              {error && (
                <div className={`mb-4 rounded-xl p-4 flex items-start gap-3 ${darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-100'}`}>
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{t('errors.analyzeTitle')}</p>
                    <p className={`text-sm mt-0.5 leading-relaxed ${darkMode ? 'text-red-300/80' : 'text-red-700/80'}`}>{error}</p>
                  </div>
                </div>
              )}
              <ReviewCard
                hasImage={Boolean(image)}
                age={age}
                gender={gender}
                region={region}
                genderLabel={genderLabel}
                regionLabel={regionLabel}
                allComplete={allComplete}
                analysisPending={analysisPending}
                onAnalyze={handleAnalyze}
                onClear={handleClear}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SkinCheck
