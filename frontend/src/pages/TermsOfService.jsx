import { useTheme } from '../context/ThemeContext'
import LegalPage from './LegalPage'

function TermsOfService() {
  const { darkMode } = useTheme()
  const p = `mb-4 leading-relaxed`
  const h = `text-xl font-semibold mt-8 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`

  return (
    <LegalPage title="Terms of Service">
      <p className={p}>Last updated: August 2026</p>

      <p className={p}>
        Welcome to DermaAI. By accessing or using our AI-assisted dermatology platform, you agree to be bound by these Terms of Service. Please read them carefully.
      </p>

      <h2 className={h}>Service Description</h2>
      <p className={p}>
        DermaAI provides AI-powered preliminary skin health guidance. Our platform uses machine learning models to analyze skin images and provide informational assessments. This service is intended for educational and informational purposes only.
      </p>

      <h2 className={h}>Important Medical Disclaimer</h2>
      <p className={p}>
        DermaAI is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information provided by DermaAI.
      </p>

      <h2 className={h}>User Responsibilities</h2>
      <p className={p}>By using DermaAI, you agree to:</p>
      <ul className={`list-disc pl-6 mb-4 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <li>Provide accurate and truthful information</li>
        <li>Upload only images you have the right to share</li>
        <li>Not use the service for any unlawful purpose</li>
        <li>Not attempt to compromise the security or integrity of the platform</li>
        <li>Not reproduce, duplicate, or exploit any part of the service without permission</li>
      </ul>

      <h2 className={h}>Intellectual Property</h2>
      <p className={p}>
        All content, features, and functionality of DermaAI are owned by us and are protected by copyright, trademark, and other intellectual property laws.
      </p>

      <h2 className={h}>Limitation of Liability</h2>
      <p className={p}>
        DermaAI and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the service. The service is provided "as is" without warranties of any kind.
      </p>

      <h2 className={h}>Termination</h2>
      <p className={p}>
        We may terminate or suspend your access to DermaAI immediately, without prior notice, for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users, us, or third parties.
      </p>

      <h2 className={h}>Changes to Terms</h2>
      <p className={p}>
        We reserve the right to modify these Terms at any time. Continued use of DermaAI after changes constitutes acceptance of the modified Terms.
      </p>

      <h2 className={h}>Contact</h2>
      <p className={p}>
        For questions about these Terms of Service, please contact us through our platform.
      </p>
    </LegalPage>
  )
}

export default TermsOfService
