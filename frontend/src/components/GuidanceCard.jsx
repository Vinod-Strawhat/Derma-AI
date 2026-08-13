import { CheckCircle2, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function GuidanceCard({ dos, avoid }) {
  const { t } = useLanguage()

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">{t('guidance.dosTitle')}</h3>
        </div>
        <ul className="space-y-2.5">
          {dos.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">{t('guidance.avoidTitle')}</h3>
        </div>
        <ul className="space-y-2.5">
          {avoid.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default GuidanceCard