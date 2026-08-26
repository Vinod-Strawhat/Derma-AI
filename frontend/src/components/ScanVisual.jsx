import { useLanguage } from '../context/LanguageContext'

function ScanVisual() {
  const { t } = useLanguage()

  return (
    <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
      {/* ── Outer radar sweep ring ── */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full border border-primary-200/30" />
        <div className="absolute inset-3 rounded-full border border-primary-200/20" />
        <div className="absolute inset-6 rounded-full border border-primary-100/40" />
        {/* Radar sweep */}
        <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '10s' }} viewBox="0 0 400 400">
          <defs>
            <linearGradient id="sweepGrad" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="rgba(99,133,243,0.18)" />
              <stop offset="100%" stopColor="rgba(99,133,243,0)" />
            </linearGradient>
          </defs>
          <path d="M200,200 L200,8 A192,192 0 0,1 366,82 Z" fill="url(#sweepGrad)" />
        </svg>
      </div>

      {/* ── AI network nodes around the periphery ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        {/* Connection lines */}
        <line x1="60" y1="80" x2="130" y2="140" stroke="rgba(99,133,243,0.2)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="340" y1="90" x2="280" y2="150" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-opacity" values="0.15;0.3;0.15" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="55" y1="300" x2="125" y2="260" stroke="rgba(99,133,243,0.18)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="6s" repeatCount="indefinite" />
        </line>
        <line x1="345" y1="310" x2="285" y2="265" stroke="rgba(139,92,246,0.18)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="4.5s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="40" x2="200" y2="95" stroke="rgba(99,133,243,0.15)" strokeWidth="1" strokeDasharray="3 3">
          <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="360" x2="200" y2="305" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="3 3">
          <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="5.5s" repeatCount="indefinite" />
        </line>

        {/* Node dots */}
        <circle cx="58" cy="78" r="3.5" fill="rgba(99,133,243,0.5)">
          <animate attributeName="r" values="3;4.5;3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="342" cy="88" r="3" fill="rgba(139,92,246,0.5)">
          <animate attributeName="r" values="2.5;4;2.5" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="53" cy="302" r="2.5" fill="rgba(99,133,243,0.4)">
          <animate attributeName="r" values="2;3.5;2" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="347" cy="312" r="2.5" fill="rgba(139,92,246,0.4)">
          <animate attributeName="r" values="2;3.5;2" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="38" r="2" fill="rgba(99,133,243,0.35)">
          <animate attributeName="r" values="1.5;3;1.5" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="362" r="2" fill="rgba(139,92,246,0.35)">
          <animate attributeName="r" values="1.5;3;1.5" dur="5.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* ── Skin analysis area (rounded rectangle with organic feel) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(99,133,243,0.12)] border border-primary-200/50">
        {/* Skin base gradient — warm tones like real skin */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5e6d8] via-[#ecdcc8] to-[#e8d0b8]" />

        {/* Skin texture: cellular/dermatoglyphic pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.22]" viewBox="0 0 300 300">
          <defs>
            <pattern id="cells" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              {/* Irregular cell-like hexagons */}
              <path d="M14 2 L22 7 L22 17 L14 22 L6 17 L6 7 Z" fill="none" stroke="rgba(160,130,110,0.5)" strokeWidth="0.6" />
              <path d="M0 16 L6 11 L6 21 L0 26" fill="none" stroke="rgba(160,130,110,0.3)" strokeWidth="0.4" />
              <path d="M28 16 L22 11 L22 21 L28 26" fill="none" stroke="rgba(160,130,110,0.3)" strokeWidth="0.4" />
              {/* Tiny pores */}
              <circle cx="14" cy="12" r="0.8" fill="rgba(150,120,100,0.35)" />
              <circle cx="8" cy="20" r="0.5" fill="rgba(150,120,100,0.25)" />
              <circle cx="20" cy="20" r="0.6" fill="rgba(150,120,100,0.25)" />
            </pattern>
            <radialGradient id="skinCenter" cx="50%" cy="45%">
              <stop offset="0%" stopColor="rgba(245,225,210,0.6)" />
              <stop offset="100%" stopColor="rgba(220,195,175,0.3)" />
            </radialGradient>
          </defs>
          <rect width="300" height="300" fill="url(#cells)" />
          <rect width="300" height="300" fill="url(#skinCenter)" />
          {/* Subtle skin lines / creases */}
          <line x1="40" y1="60" x2="260" y2="75" stroke="rgba(160,130,110,0.12)" strokeWidth="0.8" />
          <line x1="30" y1="130" x2="270" y2="140" stroke="rgba(160,130,110,0.1)" strokeWidth="0.6" />
          <line x1="50" y1="200" x2="250" y2="210" stroke="rgba(160,130,110,0.1)" strokeWidth="0.7" />
        </svg>

        {/* Scanning line — horizontal sweep */}
        <div className="absolute inset-x-0 h-[2px]">
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(99,133,243,0.0) 15%, rgba(99,133,243,0.55) 50%, rgba(99,133,243,0.0) 85%, transparent 100%)',
              boxShadow: '0 0 18px 4px rgba(99,133,243,0.15)',
              animation: 'scanVertical 3.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Detection markers that appear at different times */}
        {/* Lesion detection region 1 */}
        <div className="absolute top-[28%] left-[22%] animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <rect x="2" y="2" width="40" height="40" rx="6" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeDasharray="3 2">
              <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
            </rect>
            <circle cx="22" cy="22" r="3" fill="rgba(59,130,246,0.5)">
              <animate attributeName="r" values="2.5;4;2.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Lesion detection region 2 */}
        <div className="absolute bottom-[25%] right-[20%] animate-fade-in" style={{ animationDelay: '2.4s', animationFillMode: 'both' }}>
          <svg width="38" height="38" viewBox="0 0 38 38">
            <rect x="2" y="2" width="34" height="34" rx="5" fill="none" stroke="rgba(139,92,246,0.55)" strokeWidth="1.5" strokeDasharray="3 2">
              <animate attributeName="stroke-opacity" values="0.35;0.75;0.35" dur="3.5s" repeatCount="indefinite" />
            </rect>
            <circle cx="19" cy="19" r="2.5" fill="rgba(139,92,246,0.45)">
              <animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Measurement / analysis label floating near detection */}
        <div className="absolute top-[22%] right-[12%] animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
          <div className="bg-white/90 dark:bg-[#0D1B2A]/90 backdrop-blur-sm rounded-md px-2 py-0.5 shadow-sm border border-primary-100/60 dark:border-primary-500/20">
            <span className="text-[9px] font-semibold text-primary-600 dark:text-primary-400 tracking-wide">92.4%</span>
          </div>
        </div>

        <div className="absolute bottom-[20%] left-[10%] animate-fade-in" style={{ animationDelay: '3s', animationFillMode: 'both' }}>
          <div className="bg-white/90 dark:bg-[#0D1B2A]/90 backdrop-blur-sm rounded-md px-2 py-0.5 shadow-sm border border-accent-100/60 dark:border-accent-500/20">
            <span className="text-[9px] font-semibold text-accent-600 dark:text-accent-400 tracking-wide">{t('scanvisual.lowRisk')}</span>
          </div>
        </div>

        {/* Soft vignette overlay */}
        <div className="absolute inset-0 rounded-[2rem]" style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(240,235,230,0.4) 100%)',
        }} />
      </div>

      {/* ── Corner brackets on skin area ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        {/* Top-left */}
        <path d="M 120 110 L 120 95 L 135 95" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" />
        {/* Top-right */}
        <path d="M 280 110 L 280 95 L 265 95" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom-left */}
        <path d="M 120 290 L 120 305 L 135 305" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom-right */}
        <path d="M 280 290 L 280 305 L 265 305" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* ── Small "dermatoscope lens" ring ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 md:w-76 md:h-76 rounded-full border border-primary-300/25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary-200/15 pointer-events-none" />

      {/* ── Pulsing center dot ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary-400 animate-ping" style={{ animationDuration: '2.5s' }} />
        </div>
      </div>

      {/* ── Status label ── */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white dark:bg-[#0D1B2A] px-5 py-2 rounded-full border border-primary-200/80 dark:border-primary-500/20 shadow-[0_2px_12px_rgba(99,133,243,0.1)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" style={{ animationDuration: '2s' }} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            <span className="text-[11px] font-bold text-primary-700 dark:text-primary-400 tracking-[0.15em] uppercase">{t('scanvisual.status')}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanVertical {
          0% { transform: translateY(0); }
          50% { transform: translateY(210px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ScanVisual
