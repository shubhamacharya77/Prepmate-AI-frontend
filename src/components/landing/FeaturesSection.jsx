import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '📄',
    title: 'Resume Upload & Analysis',
    description: 'Upload your PDF resume and let AI extract your skills, experience, and strengths to build your personalized profile.',
    color: 'from-primary to-primary-light',
    border: 'border-primary/20',
    glow: 'hover:border-primary/40',
  },
  {
    icon: '🗺️',
    title: 'AI Career Roadmap',
    description: 'Get a month-by-month, personalized learning roadmap tailored to your resume and target role. Know exactly what to learn next.',
    color: 'from-accent to-primary',
    border: 'border-accent/20',
    glow: 'hover:border-accent/40',
  },
  {
    icon: '🔍',
    title: 'Smart Job Search',
    description: 'Paste a job description or search by keywords. Our AI finds and ranks matching opportunities based on your profile.',
    color: 'from-success to-accent',
    border: 'border-success/20',
    glow: 'hover:border-success/40',
  },
  {
    icon: '🤝',
    title: 'Interview Preparation',
    description: 'Practice with AI-generated questions tailored to your topic and difficulty. Structured Q&A flow for real interview simulation.',
    color: 'from-warning to-danger',
    border: 'border-warning/20',
    glow: 'hover:border-warning/40',
  },
];

export default function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6 leading-tight">
            Everything you need to{' '}
            <span className="gradient-text">land your dream role</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            PrepMate combines AI-powered analysis with structured workflows to give you an unfair advantage in your career.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`
                group relative bg-bg-surface border ${feature.border} ${feature.glow}
                rounded-3xl p-8 cursor-pointer card-hover overflow-hidden
              `}
              onClick={() => navigate('/login')}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at top left, rgba(108,99,255,0.08) 0%, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color}
                flex items-center justify-center text-2xl mb-6
                shadow-lg group-hover:scale-110 transition-transform duration-300
              `}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:gradient-text transition-all">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore feature</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
