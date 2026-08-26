import { Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { buildImageUrl } from '../api/imageUrl'

function GradCamCard({ imageUrl, available }) {
  const { t } = useLanguage()

  return (
    <div className="card p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('gradcam.heading')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('gradcam.subtitle')}</p>
        </div>
      </div>

      {available && imageUrl ? (
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 mb-4">
          <img
            src={buildImageUrl(imageUrl)}
            alt={t('gradcam.availableAlt')}
            className="w-full object-cover"
          />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 p-6 text-center mb-4">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D1B2A] border border-gray-100 dark:border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            {t('gradcam.unavailable')}
          </span>
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        {t('gradcam.desc')}
      </p>
    </div>
  )
}

export default GradCamCard
