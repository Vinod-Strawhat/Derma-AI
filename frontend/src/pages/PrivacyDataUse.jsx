import { useTheme } from '../context/ThemeContext'
import LegalPage from './LegalPage'

function PrivacyDataUse() {
  const { darkMode } = useTheme()
  const p = `mb-4 leading-relaxed`
  const h = `text-xl font-semibold mt-8 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`

  return (
    <LegalPage title="Privacy & Data Use">
      <p className={p}>Last updated: August 2026</p>

      <p className={p}>
        This page provides additional detail about how DermaAI handles your data, complementing our Privacy Policy.
      </p>

      <h2 className={h}>Skin Image Data</h2>
      <p className={p}>
        When you upload a skin image for analysis, the image is processed by our AI model to generate a preliminary assessment. Images are stored securely and are used solely for providing you with analysis results and for improving our AI models (with appropriate anonymization).
      </p>

      <h2 className={h}>How Your Data Is Used</h2>
      <ul className={`list-disc pl-6 mb-4 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <li><strong className={darkMode ? 'text-white' : 'text-gray-900'}>Service delivery:</strong> Your images and profile data are used to provide you with skin analysis results and personalized guidance.</li>
        <li><strong className={darkMode ? 'text-white' : 'text-gray-900'}>AI improvement:</strong> Anonymized and aggregated data may be used to train and improve our machine learning models. Individual images are not shared publicly.</li>
        <li><strong className={darkMode ? 'text-white' : 'text-gray-900'}>Service improvement:</strong> Usage analytics help us understand how the platform is used and where we can improve.</li>
      </ul>

      <h2 className={h}>Data Storage & Security</h2>
      <p className={p}>
        All data is stored on secure servers with industry-standard encryption. We implement access controls, regular security audits, and follow best practices for data protection.
      </p>

      <h2 className={h}>Your Data Rights</h2>
      <p className={p}>You have the right to:</p>
      <ul className={`list-disc pl-6 mb-4 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data and account</li>
        <li>Opt out of data being used for AI model training</li>
        <li>Export your data in a portable format</li>
      </ul>

      <h2 className={h}>Data Sharing</h2>
      <p className={p}>
        We do not sell your personal data to third parties. We may share anonymized, aggregated data for research purposes. We may disclose data if required by law or to protect the rights and safety of our users.
      </p>

      <h2 className={h}>Cookies & Tracking</h2>
      <p className={p}>
        DermaAI uses essential cookies to maintain your session and preferences. We do not use third-party advertising trackers.
      </p>

      <h2 className={h}>Contact</h2>
      <p className={p}>
        To exercise your data rights or ask questions about our data practices, please contact us through our platform.
      </p>
    </LegalPage>
  )
}

export default PrivacyDataUse
