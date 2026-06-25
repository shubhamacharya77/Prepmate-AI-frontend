import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, #6C63FF 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'pulseGlow 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'pulseGlow 5s ease-in-out infinite reverse',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(108,99,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-in">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          AI-Powered Career Copilot
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-text-primary leading-[1.05] tracking-tight mb-6 animate-in" style={{ animationDelay: '100ms' }}>
          Prepare Smarter for{' '}
          <span className="gradient-text">Interviews</span>
          {' '}&{' '}
          <span className="relative">
            <span className="gradient-text">Career Growth</span>
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-in" style={{ animationDelay: '200ms' }}>
          Get a personalized career roadmap, discover matched job opportunities,
          and practice interviews with AI — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in" style={{ animationDelay: '300ms' }}>
          <Button
            size="xl"
            variant="primary"
            onClick={() => navigate('/login')}
            className="min-w-48 glow-primary"
            id="hero-get-started"
          >
            Get Started Free →
          </Button>
          <Button
            size="xl"
            variant="secondary"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            id="hero-learn-more"
          >
            Learn More
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-10 mt-16 animate-in" style={{ animationDelay: '400ms' }}>
          {[
            { label: 'Resume Analysis', value: 'AI' },
            { label: 'Interview Questions', value: '∞' },
            { label: 'Career Paths', value: '100+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black gradient-text">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cards preview */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  );
}
