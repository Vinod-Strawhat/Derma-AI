import { useTheme } from '../context/ThemeContext'
import LegalPage from './LegalPage'

function PrivacyPolicy() {
  const { darkMode } = useTheme()
  const p = `mb-4 leading-relaxed`
  const h = `text-xl font-semibold mt-8 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`

  return (
    <LegalPage title="Privacy Policy">
      <p className={p}>Last updated: August 2026</p>

      <p className={p}>
        DermaAI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-assisted dermatology platform.
      </p>

      <h2 className={h}>Information We Collect</h2>
      <p className={p}>
        We may collect information you provide directly, including account details (name, email address), skin images you upload for analysis, and any additional health information you choose to share through our platform.
      </p>
      <p className={p}>
        We also collect certain information automatically, such as device type, browser type, operating system, IP address, and usage data including pages visited and features used.
      </p>

      <h2 className={h}>How We Use Your Information</h2>
      <p className={p}>We use the information we collect to:</p>
      <ul className={`list-disc pl-6 mb-4 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <li>Provide and maintain the DermaAI service</li>
        <li>Process and analyze skin images for preliminary guidance</li>
        <li>Improve our AI models and service quality</li>
        <li>Communicate with you about your account and our services</li>
        <li>Ensure the security and integrity of our platform</li>
      </ul>

      <h2 className={h}>Data Security</h2>
      <p className={p}>
        We implement industry-standard security measures to protect your personal information. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className={h}>Data Retention</h2>
      <p className={p}>
        We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us.
      </p>

      <h2 className={h}>Third-Party Services</h2>
      <p className={p}>
        We do not sell your personal information. We may use third-party service providers who assist us in operating our platform and who are obligated to keep your information confidential.
      </p>

      <h2 className={h}>Children's Privacy</h2>
      <p className={p}>
        DermaAI is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.
      </p>

      <h2 className={h}>Changes to This Policy</h2>
      <p className={p}>
        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
      </p>

      <h2 className={h}>Contact Us</h2>
      <p className={p}>
        If you have questions about this Privacy Policy, please contact us through our platform or via email.
      </p>
    </LegalPage>
  )
}

export default PrivacyPolicy
