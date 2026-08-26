import { Brain, Eye, Camera, BarChart3, Sparkles, Activity, Shield, ArrowRight, AlertCircle, Database, Layers, ScanSearch, Stethoscope, Lightbulb, GitCompareArrows, Clock, User, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function Research() {
  const { darkMode } = useTheme()

  const sectionHeading = `text-2xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`
  const sectionSubtext = `text-base max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
  const p = `mb-4 leading-relaxed`
  const h = `text-xl font-semibold mt-8 mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`

  const datasets = [
    { name: 'HAM10000', desc: 'Human Against Machine with 10000 training images. A large collection of multi-source dermatoscopic images of common pigmented skin lesions.' },
    { name: 'ISIC 2019', desc: 'International Skin Imaging Collaboration 2019. A benchmark dataset for skin lesion analysis toward melanoma detection.' },
    { name: 'PAD-UFES-20', desc: 'A dataset with 2,296 skin lesion images collected from clinical and dermoscopy sources at UFES, Brazil.' },
    { name: 'Derm7pt', desc: 'A dataset of dermoscopic images with clinical metadata and expert annotations for skin lesion analysis.' },
  ]

  const diseases = [
    { name: 'Actinic Keratosis', abbr: 'AK' },
    { name: 'Basal Cell Carcinoma', abbr: 'BCC' },
    { name: 'Benign Keratosis', abbr: 'BKL' },
    { name: 'Dermatofibroma', abbr: 'DF' },
    { name: 'Melanoma', abbr: 'MEL' },
    { name: 'Melanocytic Nevus', abbr: 'NV' },
    { name: 'Squamous Cell Carcinoma', abbr: 'SCC' },
    { name: 'Vascular Lesion', abbr: 'VASC' },
  ]

  const metrics = [
    { label: 'Validation Accuracy', value: '88.85%', icon: BarChart3 },
    { label: 'Precision', value: '89.52%', icon: Shield },
    { label: 'Recall', value: '88.85%', icon: Activity },
    { label: 'Weighted F1-Score', value: '89.04%', icon: Sparkles },
  ]

  const aiFlow = [
    { icon: Camera, label: 'Skin Image' },
    { icon: User, label: 'Patient Metadata\n(Age, Gender, Body Region)' },
    { icon: Brain, label: 'Multimodal Neural Network' },
    { icon: BarChart3, label: 'Disease Prediction' },
    { icon: Sparkles, label: 'Confidence + Explanation' },
  ]

  const gradCamFlow = [
    { icon: Camera, label: 'Original Skin Image' },
    { icon: Brain, label: 'Model Analysis' },
    { icon: Eye, label: 'Grad-CAM Heatmap' },
    { icon: Lightbulb, label: 'Visual Explanation' },
  ]

  const scanFlow = [
    { icon: User, label: 'User' },
    { icon: ScanSearch, label: 'Skin Concern' },
    { icon: Camera, label: 'Multiple Scans' },
    { icon: Clock, label: 'History' },
    { icon: GitCompareArrows, label: 'Compare Previous\nand Latest Scan' },
  ]

  const futureWork = [
    'Improving model accuracy through architecture experiments',
    'More robust cross-dataset validation',
    'Better lesion analysis and segmentation',
    'Improved image-change analysis over time',
    'Support for more languages',
    'Further clinical validation studies',
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
              <Database className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
              <span className={`text-xs font-medium ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>Research & Development</span>
            </div>

            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Research Behind{' '}
              <span className="text-gradient-medical">DermaAI</span>
            </h1>

            <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              An explainable multimodal AI approach for preliminary skin health assessment.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">

        {/* Project Objective */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Project{' '}
              <span className="text-gradient-medical">Objective</span>
            </h2>
            <p className={sectionSubtext}>
              Combining multiple data sources for comprehensive skin health guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className={`card p-6 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What DermaAI Does</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    DermaAI combines skin lesion images with patient metadata — age, gender, and body region — to produce an AI-assisted preliminary skin-condition prediction using a multimodal neural network.
                  </p>
                </div>
              </div>
            </div>

            <div className={`card p-6 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Research Purpose</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    The system is intended for research, educational, and preliminary guidance purposes. It is not a medical diagnostic system and should not replace professional evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multimodal AI Approach */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Multimodal AI{' '}
              <span className="text-gradient-medical">Approach</span>
            </h2>
            <p className={sectionSubtext}>
              Image features and patient metadata are combined before classification
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {aiFlow.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${darkMode ? 'bg-primary-900/30 border border-primary-700/30' : 'bg-primary-50 border border-primary-100'}`}>
                      <step.icon className={`w-7 h-7 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                    </div>
                    <span className={`text-xs font-medium max-w-[100px] leading-tight whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.label}</span>
                  </div>
                  {i < aiFlow.length - 1 && (
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 hidden md:block ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className={`mt-8 p-4 rounded-xl border text-center ${darkMode ? 'bg-primary-900/10 border-primary-700/20' : 'bg-primary-50/50 border-primary-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The neural network learns from both visual patterns in skin images and contextual patient information to produce more informed predictions than image-only analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Datasets */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Training{' '}
              <span className="text-gradient-medical">Datasets</span>
            </h2>
            <p className={sectionSubtext}>
              DermaAI is trained on merged data from multiple established dermatology datasets
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {datasets.map((ds, i) => (
              <div
                key={ds.name}
                className={`card p-6 animate-fade-in-up ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-medical-50 dark:bg-medical-900/30 flex items-center justify-center mb-4">
                  <Database className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                </div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ds.name}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ds.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disease Classes */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Disease{' '}
              <span className="text-gradient-medical">Classes</span>
            </h2>
            <p className={sectionSubtext}>
              The model classifies skin lesions into 8 categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {diseases.map((d, i) => (
              <div
                key={d.abbr}
                className={`card p-4 text-center animate-fade-in-up ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className={`text-xs font-bold tracking-wider uppercase mb-2 block ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>{d.abbr}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{d.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Model Performance */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Model{' '}
              <span className="text-gradient-medical">Performance</span>
            </h2>
            <p className={sectionSubtext}>
              Current evaluated validation metrics
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`card p-5 text-center animate-fade-in-up ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <m.icon className={`w-6 h-6 mx-auto mb-3 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.value}</p>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Best Epoch: <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>18</span>
            </p>
          </div>

          <div className={`mt-6 p-4 rounded-xl border max-w-2xl mx-auto text-center ${darkMode ? 'bg-amber-900/10 border-amber-700/20' : 'bg-amber-50/50 border-amber-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
              These are research evaluation metrics, not clinical accuracy claims. Real-world performance may vary.
            </p>
          </div>
        </section>

        {/* Explainable AI */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Explainable AI{' '}
              <span className="text-gradient-medical">(Grad-CAM)</span>
            </h2>
            <p className={sectionSubtext}>
              Understanding what the model sees
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              {gradCamFlow.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${darkMode ? 'bg-accent-900/30 border border-accent-700/30' : 'bg-accent-50 border border-accent-100'}`}>
                      <step.icon className={`w-7 h-7 ${darkMode ? 'text-accent-400' : 'text-accent-600'}`} />
                    </div>
                    <span className={`text-xs font-medium max-w-[100px] leading-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.label}</span>
                  </div>
                  {i < gradCamFlow.length - 1 && (
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 hidden md:block ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Grad-CAM provides a visual indication of the image regions that influenced the model's prediction. It generates a heatmap overlay showing which areas of the skin image were most relevant to the model's classification decision.
              </p>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-amber-900/10' : 'bg-amber-50'}`}>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                  <strong>Important:</strong> Grad-CAM is an explanation of model attention, not a medical measurement of lesion size, spread, or disease severity. It does not diagnose cancer or determine medical stage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk and Uncertainty */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Risk and{' '}
              <span className="text-gradient-medical">Uncertainty</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className={`card p-6 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Confidence ≠ Severity</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Model confidence is a measure of how certain the AI is about its prediction. It is not a measure of disease severity or medical urgency.
              </p>
            </div>

            <div className={`card p-6 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Handling Uncertainty</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                When the model is uncertain between multiple conditions, DermaAI does not present one condition as certain. Instead, it shows the top predictions and flags the result as uncertain.
              </p>
            </div>

            <div className={`card p-6 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preliminary Guidance</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                The system can provide preliminary precautions and recommend professional evaluation when appropriate. This is not a substitute for clinical assessment.
              </p>
            </div>
          </div>
        </section>

        {/* Scan History & Comparison */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Scan History &{' '}
              <span className="text-gradient-medical">Comparison</span>
            </h2>
            <p className={sectionSubtext}>
              User-centered tracking for monitoring skin changes over time
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              {scanFlow.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${darkMode ? 'bg-emerald-900/30 border border-emerald-700/30' : 'bg-emerald-50 border border-emerald-100'}`}>
                      <step.icon className={`w-7 h-7 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <span className={`text-xs font-medium max-w-[100px] leading-tight whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.label}</span>
                  </div>
                  {i < scanFlow.length - 1 && (
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 hidden md:block ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Users can organize scans by individual skin concerns and compare their own previous scans and AI assessments over time. This helps track changes in a specific area of interest.
              </p>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-amber-900/10' : 'bg-amber-50'}`}>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                  <strong>Note:</strong> Comparison does not medically prove that a lesion has grown or progressed. It is a tool for personal reference and should be interpreted by a healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Improvements */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className={sectionHeading}>
              Future{' '}
              <span className="text-gradient-medical">Improvements</span>
            </h2>
            <p className={sectionSubtext}>
              Planned areas of ongoing research and development
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className={`card p-6 ${darkMode ? 'bg-[#0D1B2A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <ul className="space-y-3">
                {futureWork.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className={`text-xs font-bold ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>{i + 1}</span>
                    </div>
                    <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Research Disclaimer */}
        <section className="animate-fade-in-up">
          <div className={`max-w-3xl mx-auto p-6 rounded-2xl border ${darkMode ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>Research Disclaimer</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-amber-200/80' : 'text-amber-700'}`}>
                  DermaAI is a research/educational project designed to provide AI-assisted preliminary information. It does not replace professional medical diagnosis or consultation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Research
