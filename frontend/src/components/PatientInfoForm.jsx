import { GENDER_OPTIONS, REGION_GROUPS } from '../data/skinCheckOptions'
import { useLanguage } from '../context/LanguageContext'

function PatientInfoForm({ age, gender, region, onChange }) {
  const { t } = useLanguage()

  const genderLabel = (value) => {
    if (value === 'Male') return t('patient.male')
    if (value === 'Female') return t('patient.female')
    return t('patient.notSpecified')
  }

  const groupLabel = (label) => {
    const map = {
      'Head & Neck': t('patient.groupHeadNeck'),
      'Torso': t('patient.groupTorso'),
      'Upper Extremity': t('patient.groupUpper'),
      'Lower Extremity': t('patient.groupLower'),
      'Other Skin Areas': t('patient.groupOther'),
      'Unspecified': t('patient.groupUnspecified'),
    }
    return map[label] ?? label
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('patient.age')}
        </label>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          min="0"
          max="120"
          step="1"
          value={age}
          onChange={(e) => onChange({ age: e.target.value })}
          placeholder={t('patient.agePlaceholder')}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('patient.gender')}
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => onChange({ gender: e.target.value })}
          className="input-field appearance-none cursor-pointer"
        >
          <option value="">{t('patient.selectGender')}</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {genderLabel(option.value)}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('patient.bodyRegion')}
        </label>
        <select
          id="region"
          value={region}
          onChange={(e) => onChange({ region: e.target.value })}
          className="input-field appearance-none cursor-pointer"
        >
          <option value="">{t('patient.selectRegion')}</option>
          {REGION_GROUPS.map((group) => (
            <optgroup key={group.label} label={groupLabel(group.label)}>
              {group.options.map((regionValue) => (
                <option key={regionValue} value={regionValue}>
                  {regionValue.charAt(0).toUpperCase() + regionValue.slice(1)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  )
}

export default PatientInfoForm