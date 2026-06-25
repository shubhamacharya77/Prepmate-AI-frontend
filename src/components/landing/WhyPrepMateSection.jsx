const benefits = [
  {
    icon: '🧠',
    title: 'Personalized Guidance',
    description: 'Every roadmap, question, and recommendation is tailored to YOUR resume and YOUR goals. No generic advice.',
  },
  {
    icon: '⚡',
    title: 'AI-Driven Career Planning',
    description: 'Powered by advanced language models that understand career trajectories, market trends, and skill requirements.',
  },
  {
    icon: '🎯',
    title: 'Real Interview Practice',
    description: 'Structured Q&A sessions that simulate actual interviews — technical and HR — with domain-specific questions.',
  },
  {
    icon: '🔗',
    title: 'Job Matching',
    description: 'Find roles that match your profile. Paste a job description or search by keyword to discover opportunities.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Monitor your interview performance, track skill growth, and see how your profile evolves over time.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your resume and personal data are encrypted and stored securely. Only you can access your profile.',
  },
];

export default function WhyPrepMateSection() {
  return (
    <section id="why-prepmate" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-success text-sm font-semibold tracking-widest uppercase mb-4">Why PrepMate</p>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6">
            Built for{' '}
            <span className="gradient-text">serious job seekers</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Not another generic career tool. PrepMate uses your actual resume to give you laser-focused, actionable insights.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="group p-6 bg-bg-surface border border-border rounded-2xl card-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-bg-surface-2 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/10 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{benefit.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison table teaser */}
        <div className="mt-20 p-8 rounded-3xl animated-border">
          <div className="grid grid-cols-3 text-center gap-6">
            <div>
              <p className="text-4xl font-black gradient-text mb-2">10x</p>
              <p className="text-text-secondary text-sm">Faster interview prep than traditional methods</p>
            </div>
            <div className="border-x border-border">
              <p className="text-4xl font-black gradient-text mb-2">AI</p>
              <p className="text-text-secondary text-sm">Personalized analysis for every user</p>
            </div>
            <div>
              <p className="text-4xl font-black gradient-text mb-2">∞</p>
              <p className="text-text-secondary text-sm">Interview sessions with no limits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
