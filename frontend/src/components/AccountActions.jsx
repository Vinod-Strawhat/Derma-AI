import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

function AccountActions() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { logOut } = useAuth()
  const [deletePrompt, setDeletePrompt] = useState(false)

  function handleLogout() {
    logOut()
    navigate('/')
  }

  function handleDeleteRequest() {
    setDeletePrompt(true)
  }

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t('account.heading')}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        {t('account.desc')}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleLogout} className="btn-secondary !py-3 text-sm flex-1">
          <LogOut className="w-4 h-4 mr-2" />
          {t('account.logOut')}
        </button>

        <button
          onClick={handleDeleteRequest}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-white dark:bg-[#0D1B2A] hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 flex-1"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('account.deleteAccount')}
        </button>
      </div>

      {deletePrompt && (
        <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 animate-fade-in-up">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{t('account.deleteHeading')}</p>
              <p className="text-xs text-red-700/80 dark:text-red-400/80 leading-relaxed mt-1">
                {t('account.deleteDesc')}
              </p>
              <button
                onClick={() => setDeletePrompt(false)}
                className="mt-3 text-xs font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
              >
                {t('account.dismiss')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountActions
