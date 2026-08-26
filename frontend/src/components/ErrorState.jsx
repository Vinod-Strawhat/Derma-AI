import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function ErrorState({ title, message, onRetry }) {
  const { t } = useLanguage()

  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary !px-6 !py-2.5 text-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('errors.retry')}
        </button>
      )}
    </div>
  )
}

export default ErrorState
