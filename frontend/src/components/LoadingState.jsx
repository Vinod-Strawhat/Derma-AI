import { Loader2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function LoadingState({ message, className }) {
  const { t } = useLanguage()

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className ?? ''}`} role="status" aria-live="polite">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
      <p className="mt-1 text-xs text-gray-400">{t('loading.demoNote')}</p>
    </div>
  )
}

export default LoadingState