const steps = [
  {
    num: '01',
    title: 'Sign In with Google',
    description: 'One-click Google login. No passwords, no friction. Secure OAuth authentication gets you in instantly.',
    icon: '🔐',
    color: '#6C63FF',
  },
  {
    num: '02',
    title: 'Upload Your Resume',
    description: 'Upload your PDF resume and tell us your target role. Our AI begins analyzing your profile immediately.',
    icon: '📎',
    color: '#00D4FF',
  },
  {
    num: '03',
    title: 'Get Personalized Insights',
    description: 'Receive a tailored career roadmap, skill gap analysis, and curated job matches — all powered by AI.',
    icon: '✨',
    color: '#00E5A0',
  },
  {
    num: '04',
    title: 'Practice Interviews',
    description: 'Run structured interview sessions with AI-generated questions. Build confidence before the real thing.',
    icon: '🎯',
    color: '#FFB347',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6">
            From zero to{' '}
            <span className="gradient-text">interview-ready</span>
            {' '}in 4 steps
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            PrepMate's guided flow takes you from signup to confident job seeker in minutes, not weeks.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-primary via-accent to-success opacity-20 -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`flex items-center gap-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className="flex-1 lg:text-right">
                  {i % 2 !== 0 && (
                    <div className="lg:text-left">
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: step.color }}>
                        Step {step.num}
                      </span>
                      <h3 className="text-2xl font-bold text-text-primary mt-2 mb-3">{step.title}</h3>
                      <p className="text-text-secondary leading-relaxed max-w-sm">{step.description}</p>
                    </div>
                  )}
                  {i % 2 === 0 && (
                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: step.color }}>
                        Step {step.num}
                      </span>
                      <h3 className="text-2xl font-bold text-text-primary mt-2 mb-3">{step.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  )}
                </div>

                {/* Icon node */}
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}22 0%, ${step.color}11 100%)`,
                      border: `2px solid ${step.color}33`,
                      boxShadow: `0 8px 32px ${step.color}22`,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Empty spacer for alternating */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
