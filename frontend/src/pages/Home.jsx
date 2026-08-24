import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Eye, Sparkles, Stethoscope, Camera, BarChart3, Lightbulb, ChevronRight, AlertCircle, Shield, Zap, Activity } from 'lucide-react'
import ScanVisual from '../components/ScanVisual'
import ParticlesBackground from '../components/ParticlesBackground'
import DermaAILogo from '../components/DermaAILogo'
import { useLanguage } from '../context/LanguageContext'

function Home() {
  const { t } = useLanguage()

  const features = [
    { icon: Brain, title: t('home.f1Title'), description: t('home.f1Desc'), color: 'text-primary-600', bgColor: 'bg-primary-50', hoverBg: 'group-hover:bg-primary-100' },
    { icon: Eye, title: t('home.f2Title'), description: t('home.f2Desc'), color: 'text-accent-600', bgColor: 'bg-accent-50', hoverBg: 'group-hover:bg-accent-100' },
    { icon: Sparkles, title: t('home.f3Title'), description: t('home.f3Desc'), color: 'text-medical-600', bgColor: 'bg-medical-50', hoverBg: 'group-hover:bg-medical-100' },
    { icon: Stethoscope, title: t('home.f4Title'), description: t('home.f4Desc'), color: 'text-emerald-600', bgColor: 'bg-emerald-50', hoverBg: 'group-hover:bg-emerald-100' },
  ]

  const steps = [
    { icon: Camera, step: '01', title: t('home.step1Title'), description: t('home.step1Desc') },
    { icon: Brain, step: '02', title: t('home.step2Title'), description: t('home.step2Desc') },
    { icon: BarChart3, step: '03', title: t('home.step3Title'), description: t('home.step3Desc') },
    { icon: Lightbulb, step: '04', title: t('home.step4Title'), description: t('home.step4Desc') },
  ]

  return (
    <div className="relative">
      <ParticlesBackground />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-30" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-200/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-medical-200/10 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary-100 shadow-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
                <span className="text-xs font-medium text-primary-700">{t('home.badge')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                {t('home.title1')}{' '}
                <span className="text-gradient-medical">{t('home.title2')}</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 max-w-xl">
                {t('home.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/skin-check" className="group btn-primary !px-8 !py-3.5 text-base shadow-medical hover:shadow-medical-lg">
                  {t('home.startSkinCheck')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#how-it-works" className="btn-secondary !px-8 !py-3.5 text-base">
                  {t('home.learnMore')}
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  <span className="text-xs text-gray-500">{t('home.trustPrivacy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  <span className="text-xs text-gray-500">{t('home.trustInstant')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-500" />
                  <span className="text-xs text-gray-500">{t('home.trustExplainable')}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-200">
              <ScanVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-20 md:py-28 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t('home.featuresHeading1')}{' '}
              <span className="text-gradient-medical">{t('home.featuresHeading2')}</span>
            </h2>
            <p className="section-subtext">
              {t('home.featuresSubtext')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group card-interactive p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.hoverBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 py-20 md:py-28 bg-gradient-to-b from-gray-50/80 to-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t('home.stepsHeading1')}{' '}
              <span className="text-gradient-medical">{t('home.stepsHeading2')}</span>
            </h2>
            <p className="section-subtext">
              {t('home.stepsSubtext')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200" />

            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative text-center animate-fade-in-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-white border-2 border-primary-100 shadow-sm flex items-center justify-center group-hover:border-primary-300 group-hover:shadow-medical transition-all duration-300">
                  <step.icon className="w-7 h-7 text-primary-600" />
                </div>

                <span className="text-xs font-bold text-primary-400 tracking-widest uppercase mb-2 block">
                  {t('home.step')} {step.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-primary-900 to-accent-900 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            {t('home.ctaSubtext')}
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            {t('home.ctaButton')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
