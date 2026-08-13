import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ReviewItem({ label, value, valid, notProvided }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        {valid ? (
          <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-[18px] h-[18px] text-gray-300 flex-shrink-0" />
        )}
        <span className={`text-sm ${valid ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{label}</span>
      </div>
      <span className={`text-sm ${valid ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
        {valid ? value : notProvided}
      </span>
    </div>
  )
}

function ReviewCard({
  hasImage,
  age,
  gender,
  region,
  genderLabel,
  regionLabel,
  allComplete,
  analysisPending,
  onAnalyze,
  onClear,
}) {
  const { t } = useLanguage()

  return (
    <div className="card p-6 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('review.title')}</h2>
      <p className="text-sm text-gray-500 mb-4">{t('review.subtitle')}</p>

      <div className="divide-y divide-gray-100">
        <ReviewItem
          label={t('review.skinImage')}
          value={t('review.imageSelected')}
          valid={hasImage}
          notProvided={t('review.notProvided')}
        />

        <ReviewItem
          label={t('review.age')}
          value={age !== '' && age !== null ? `${age} ${t('review.years')}` : ''}
          valid={age !== '' && age !== null}
          notProvided={t('review.notProvided')}
        />

        <ReviewItem
          label={t('review.gender')}
          value={genderLabel || ''}
          valid={Boolean(gender) && gender !== 'Unknown'}
          notProvided={t('review.notProvided')}
        />

        <ReviewItem
          label={t('review.bodyRegion')}
          value={regionLabel || ''}
          valid={Boolean(regionLabel)}
          notProvided={t('review.notProvided')}
        />
      </div>

      <div className="mt-5 space-y-3">
        <button
          onClick={onAnalyze}
          disabled={!allComplete || analysisPending}
          className="btn-primary w-full !py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {analysisPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('loading.analyzing')}
            </>
          ) : (
            t('review.analyzeSkin')
          )}
        </button>

        {allComplete ? (
          <button
            onClick={onClear}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t('review.clearAll')}
          </button>
        ) : (
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            {t('review.provideRequired')}
          </p>
        )}
      </div>

      {analysisPending && (
        <div className="mt-4 rounded-xl bg-medical-50 border border-medical-100 p-4 text-left">
          <p className="text-sm font-medium text-medical-700 mb-1">{t('review.almostThere')}</p>
          <p className="text-xs text-medical-700/80 leading-relaxed">
            {t('review.pendingDesc')}
          </p>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          {t('review.disclaimer')}
        </p>
      </div>
    </div>
  )
}

export default ReviewCard