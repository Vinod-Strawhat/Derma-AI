import { HelpCircle, Camera, Brain, Eye, BarChart3, AlertCircle, Shield, Clock, GitCompareArrows, Globe, Stethoscope, ScanSearch, CheckCircle2, ChevronDown, ChevronUp, User, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function FaqItem({ question, answer, icon: Icon, isLast }) {
  const { darkMode } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className={`border-b ${darkMode ? 'border-white/5' : 'border-gray-100'} ${isLast ? 'border-b-0' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-start gap-4 py-5 text-left group`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${darkMode ? 'bg-primary-900/30 border border-primary-700/20' : 'bg-primary-50 border border-primary-100'}`}>
          <Icon className={`w-4.5 h-4.5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold leading-snug ${darkMode ? 'text-white group-hover:text-primary-300' : 'text-gray-900 group-hover:text-primary-600'} transition-colors`}>
            {question}
          </h3>
        </div>
        <div className={`flex-shrink-0 mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      {open && (
        <div className="pb-5 pl-13">
          <div className="pl-[52px]">
            <div className={`text-sm leading-relaxed space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {answer}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function HelpCenter() {
  const { darkMode } = useTheme()

  const callout = (text, type = 'warning') => {
    const styles = type === 'warning'
      ? darkMode ? 'bg-amber-900/10 border-amber-700/20 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'
      : darkMode ? 'bg-blue-900/10 border-blue-700/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'
    return (
      <div className={`p-3 rounded-lg border text-xs leading-relaxed mt-3 ${styles}`}>
        {text}
      </div>
    )
  }

  const faqs = [
    {
      icon: HelpCircle,
      question: 'How do I use DermaAI?',
      answer: (
        <>
          <p>Using DermaAI is straightforward:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Upload or capture</strong> a skin image using the Skin Check page.</li>
            <li><strong>Enter patient metadata</strong> — age, gender, and body region.</li>
            <li><strong>Start the analysis</strong> and wait for the AI to process the image.</li>
            <li><strong>Review the results</strong> — prediction, confidence score, and Grad-CAM explanation.</li>
            <li><strong>Read the recommended next steps</strong> and guidance provided with the result.</li>
          </ol>
          {callout('Always consult a healthcare professional for any medical concerns. DermaAI provides preliminary guidance only.', 'info')}
        </>
      ),
    },
    {
      icon: Camera,
      question: 'How should I capture the image?',
      answer: (
        <>
          <p>For best results when capturing a skin image:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Use good lighting</strong> — natural daylight or well-lit indoor conditions work best.</li>
            <li><strong>Keep the lesion clearly visible</strong> — the skin area of interest should be the focus of the image.</li>
            <li><strong>Avoid extreme blur</strong> — hold the camera steady and allow it to focus.</li>
            <li><strong>Avoid heavy filters</strong> — do not use beauty filters or color-altering effects.</li>
            <li><strong>Keep the camera focused</strong> — tap to focus on the skin area if using a phone.</li>
            <li><strong>Capture the relevant area</strong> — photograph the actual skin concern, not an unrelated body area.</li>
          </ul>
          {callout('These are general photography tips, not medical instructions. If you are concerned about a skin condition, see a dermatologist.', 'info')}
        </>
      ),
    },
    {
      icon: Brain,
      question: 'What does the prediction mean?',
      answer: (
        <>
          <p>
            The prediction is the skin condition the AI model considers <strong>most likely</strong> based on the provided image and metadata. It represents the model's best guess from the 8 conditions it has been trained to recognize.
          </p>
          <p>
            The prediction is <strong>not a confirmed diagnosis</strong>. Only a qualified healthcare professional can provide a medical diagnosis after proper examination.
          </p>
          {callout('AI predictions are preliminary assessments, not medical diagnoses. Always consult a healthcare professional.', 'warning')}
        </>
      ),
    },
    {
      icon: BarChart3,
      question: 'What does confidence mean?',
      answer: (
        <>
          <p>
            Confidence is a percentage that reflects how certain the model is about its prediction. A higher confidence means the model is more sure, while a lower confidence means it is less certain.
          </p>
          <p><strong>Example:</strong></p>
          <div className={`p-3 rounded-lg my-3 text-sm space-y-1 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="flex justify-between"><span>Condition A</span><span className="font-mono">40%</span></div>
            <div className="flex justify-between"><span>Condition B</span><span className="font-mono">40%</span></div>
            <div className="flex justify-between"><span>Condition C</span><span className="font-mono">20%</span></div>
          </div>
          <p>
            In this example, the model is uncertain between Condition A and Condition B. When confidence is spread across multiple conditions like this, the result should be treated as <strong>uncertain</strong>.
          </p>
        </>
      ),
    },
    {
      icon: BarChart3,
      question: 'What are Top 3 Predictions?',
      answer: (
        <>
          <p>
            When the model is uncertain about a single condition, DermaAI shows the <strong>three highest-scoring predictions</strong> instead of presenting just one. This gives you a broader view of what the model considers possible.
          </p>
          <p>
            Seeing multiple predictions is a sign that the AI is not confident enough to narrow it down to a single condition. This is an honest representation of model uncertainty.
          </p>
        </>
      ),
    },
    {
      icon: Shield,
      question: 'What is the Risk Level?',
      answer: (
        <>
          <p>
            DermaAI assigns a risk level to each prediction: <strong>Low</strong>, <strong>Medium</strong>, <strong>High</strong>, or <strong>Uncertain</strong>. This is a user-facing indication based on the model's confidence and the nature of the predicted condition.
          </p>
          <p>
            <strong>Important:</strong> Risk level is <strong>not</strong> a medical diagnosis or disease stage. It is a simplified indicator to help you decide whether to seek professional evaluation.
          </p>
          {callout('AI confidence ≠ disease severity. A "High" risk level does not mean you have a serious disease, and a "Low" risk level does not guarantee everything is fine.', 'warning')}
        </>
      ),
    },
    {
      icon: Eye,
      question: 'What is Grad-CAM?',
      answer: (
        <>
          <p>
            Grad-CAM (Gradient-weighted Class Activation Mapping) is a technique that creates a <strong>heatmap overlay</strong> on the skin image. It highlights the regions of the image that most influenced the model's prediction.
          </p>
          <p><strong>What Grad-CAM does NOT mean:</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>It does <strong>not</strong> measure cancer spread or severity.</li>
            <li>It does <strong>not</strong> measure lesion size.</li>
            <li>It does <strong>not</strong> determine medical stage.</li>
            <li>It does <strong>not</strong> replace a dermatologist's examination.</li>
          </ul>
          <p>
            Grad-CAM helps you understand <em>where</em> the model is looking, not <em>what</em> it means medically.
          </p>
        </>
      ),
    },
    {
      icon: CheckCircle2,
      question: 'What are the Do\'s & Don\'ts?',
      answer: (
        <>
          <p>
            DermaAI may show preliminary guidance (Do's and Don'ts) alongside the prediction. These are <strong>general informational suggestions</strong> associated with the predicted condition, not personalized medical advice.
          </p>
          <p><strong>Do:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Use the guidance as a starting point for research.</li>
            <li>Discuss results with a healthcare professional.</li>
            <li>Keep records of your scans for future reference.</li>
          </ul>
          <p><strong>Don't:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Self-diagnose based on the prediction.</li>
            <li>Start or stop any treatment without professional advice.</li>
            <li>Ignore concerning symptoms because the AI said "Low Risk."</li>
          </ul>
          {callout('Do\'s and Don\'ts are preliminary guidance, not medical prescriptions. Always follow a healthcare professional\'s advice.', 'warning')}
        </>
      ),
    },
    {
      icon: AlertCircle,
      question: 'What happens if the AI is uncertain?',
      answer: (
        <>
          <p>When the AI cannot confidently determine a single condition:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The system may show the <strong>top 3 predictions</strong> instead of one.</li>
            <li>It provides <strong>general preliminary precautions</strong> applicable to skin concerns.</li>
            <li>It clearly communicates <strong>uncertainty</strong> in the results.</li>
            <li>It <strong>recommends consulting a dermatologist</strong> when appropriate.</li>
          </ul>
          <p>
            Uncertainty is not a failure — it is an honest representation of the model's limitations. It is better for the system to say "I'm not sure" than to present an incorrect guess as fact.
          </p>
        </>
      ),
    },
    {
      icon: Clock,
      question: 'What is Scan History?',
      answer: (
        <>
          <p>
            Scan History is available to signed-in users. It saves and organizes all your previous skin analysis scans so you can review them over time.
          </p>
          <p>
            Each scan stores the uploaded image, the AI prediction, confidence score, risk level, and the Grad-CAM explanation. You can browse your history and revisit any past analysis.
          </p>
        </>
      ),
    },
    {
      icon: ScanSearch,
      question: 'What is Skin Concern tracking?',
      answer: (
        <>
          <p>
            Skin Concern tracking lets you organize your scans by <strong>individual areas of interest</strong>. For example:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>"Neck concern" — all scans related to a spot on your neck.</li>
            <li>"Arm concern" — all scans related to a lesion on your arm.</li>
          </ul>
          <p>
            This prevents unrelated scans from being treated as the same lesion, giving you a clearer view of changes in each specific area over time.
          </p>
        </>
      ),
    },
    {
      icon: GitCompareArrows,
      question: 'How does Compare work?',
      answer: (
        <>
          <p>The Compare feature lets you view two of your scans side by side:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The <strong>default comparison</strong> shows your latest scan alongside the previous scan.</li>
            <li>You can <strong>select a different previous scan</strong> when needed.</li>
            <li>The comparison displays both <strong>images</strong> and their respective <strong>AI assessment information</strong> (prediction, confidence, risk level).</li>
          </ul>
          {callout('Comparison is for personal reference only. It does not medically prove that a lesion has grown or progressed. A healthcare professional should interpret any changes.', 'warning')}
        </>
      ),
    },
    {
      icon: Shield,
      question: 'Are my scans shared with other users?',
      answer: (
        <>
          <p>
            <strong>No.</strong> Your scan history is associated with your signed-in account and is <strong>not visible to other users</strong>. Each user can only see their own scans and analysis results.
          </p>
          <p>
            Your data privacy is important. For more details, refer to our Privacy Policy and Privacy & Data Use pages.
          </p>
        </>
      ),
    },
    {
      icon: Smartphone,
      question: 'Can I use DermaAI on my phone?',
      answer: (
        <>
          <p>
            <strong>Yes.</strong> DermaAI's interface supports both mobile and desktop use:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Camera capture</strong> — take a photo directly from your phone's camera on compatible devices.</li>
            <li><strong>Image upload</strong> — upload an existing photo from your device's gallery.</li>
          </ul>
          <p>
            The interface is fully responsive and works on modern mobile browsers.
          </p>
        </>
      ),
    },
    {
      icon: Globe,
      question: 'How do I change the language?',
      answer: (
        <>
          <p>
            DermaAI supports multiple languages. You can select your preferred language using the language selector in the header:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>English</li>
            <li>Kannada</li>
            <li>Telugu</li>
            <li>Tamil</li>
            <li>Hindi</li>
          </ul>
          <p>
            The selected language applies to the interface, navigation, and general UI text.
          </p>
        </>
      ),
    },
    {
      icon: Stethoscope,
      question: 'When should I see a dermatologist?',
      answer: (
        <>
          <p>You should consider professional evaluation when:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The AI result is <strong>concerning or uncertain</strong>.</li>
            <li>You notice a <strong>new or changing lesion</strong> on your skin.</li>
            <li>A spot is <strong>persistently bleeding, itching, or crusty</strong>.</li>
            <li>You notice <strong>changes in color, shape, or size</strong> of a mole or lesion.</li>
            <li>Any skin condition <strong>does not heal</strong> within a reasonable time.</li>
            <li>You simply want <strong>peace of mind</strong> from a professional assessment.</li>
          </ul>
          {callout('This is general guidance, not a diagnostic rule. When in doubt, always consult a healthcare professional.', 'info')}
        </>
      ),
    },
    {
      icon: AlertCircle,
      question: 'Does DermaAI replace a dermatologist?',
      answer: (
        <>
          <p className="text-base font-semibold">
            No.
          </p>
          <p>
            DermaAI is an AI-assisted research and educational tool. It provides preliminary information to help you understand your skin health better. However, it <strong>cannot</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Perform a physical examination.</li>
            <li>Run lab tests or biopsies.</li>
            <li>Consider your full medical history.</li>
            <li>Replace the judgment of a trained medical professional.</li>
          </ul>
          <p>
            Professional medical evaluation remains essential for accurate diagnosis and treatment.
          </p>
          {callout('DermaAI is a research/educational tool. A qualified healthcare professional should always be consulted for medical concerns.', 'warning')}
        </>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border shadow-sm mb-6 ${darkMode ? 'bg-[#0D1B2A]/80 border-primary-800' : 'bg-white/80 border-primary-100'}`}>
              <HelpCircle className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
              <span className={`text-xs font-medium ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>Support & Documentation</span>
            </div>

            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Help{' '}
              <span className="text-gradient-medical">Center</span>
            </h1>

            <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Everything you need to know about using DermaAI for preliminary skin health guidance.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="divide-y-0">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                icon={faq.icon}
                isLast={i === faqs.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Still have questions?
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
            <AlertCircle className="w-4 h-4" />
            <span>Contact Us coming soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
