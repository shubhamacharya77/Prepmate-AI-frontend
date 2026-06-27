import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRequireAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import OnboardingModal from '../components/onboarding/OnboardingModal';
import Spinner from '../components/ui/Spinner';
import client from '../api/client';

const services = [
  {
    icon: '🗺️',
    title: 'Career Roadmap',
    description: 'Get your personalized month-by-month career roadmap built from your resume and target role.',
    to: '/roadmap',
    color: 'from-primary to-primary-light',
    border: 'border-primary/20',
    hoverBorder: 'hover:border-primary/50',
  },
  {
    icon: '🔍',
    title: 'Job Search',
    description: 'Find jobs that match your profile by pasting a job description or searching by keyword.',
    to: '/jobs',
    color: 'from-accent to-primary',
    border: 'border-accent/20',
    hoverBorder: 'hover:border-accent/50',
  },
  {
    icon: '🎙️',
    title: 'Interview Prep',
    description: 'Practice with AI-generated interview questions tailored to your topic and difficulty level.',
    to: '/interview',
    color: 'from-success to-accent',
    border: 'border-success/20',
    hoverBorder: 'hover:border-success/50',
  },
  {
    icon: '⚙️',
    title: 'Settings',
    description: 'Manage your resume, update your profile, or configure account preferences.',
    to: '/settings',
    color: 'from-warning to-danger',
    border: 'border-warning/20',
    hoverBorder: 'hover:border-warning/50',
  },
];

export default function DashboardPage() {
  const isAuth = useRequireAuth();
  const { user, hasResume, userStats, loading } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(!hasResume);

  useEffect(() => {
    if (hasResume) {
      setShowOnboarding(false);
    } else if (!loading) {
      setShowOnboarding(true);
    }
  }, [hasResume, loading]);

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (hasResume) {
      setLoadingAnalysis(true);
      client.get('/api/resume_analysis')
        .then((res) => {
          setAnalysis(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch resume analysis", err);
        })
        .finally(() => setLoadingAnalysis(false));
    }
  }, [hasResume]);

  if (!isAuth) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base gradient-mesh flex items-center justify-center p-4">
        <div className="bg-bg-surface-2/80 backdrop-blur-xl border border-border rounded-3xl p-10 flex flex-col items-center shadow-2xl animate-in max-w-sm w-full">
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
            <Spinner size="lg" className="relative z-10" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Syncing Profile</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Preparing your dashboard</span>
            <div className="flex gap-1 ml-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <DashboardLayout>
        {/* Welcome Header */}
        <div className="mb-10">
          <p className="text-text-muted text-sm mb-1">{greeting()},</p>
          <h1 className="text-4xl font-black text-text-primary">
            {userStats?.user_info?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Welcome'} 👋
          </h1>
          <p className="text-text-secondary mt-2">
            What would you like to work on today?
          </p>
        </div>

        {/* No resume warning */}
        {!hasResume && !showOnboarding && (
          <div className="mb-8 flex items-start gap-4 p-4 bg-warning/10 border border-warning/20 rounded-2xl">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-warning font-semibold text-sm">Upload your resume to get started</p>
              <p className="text-text-secondary text-xs mt-0.5">
                Some features require a resume to work. Upload yours to unlock full functionality.
              </p>
            </div>
            <button
              onClick={() => setShowOnboarding(true)}
              className="px-4 py-1.5 bg-warning/20 text-warning text-xs font-medium rounded-lg hover:bg-warning/30 transition-colors"
            >
              Upload Now
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Resume Status', value: hasResume ? 'Uploaded ✓' : 'Not uploaded', color: hasResume ? 'text-success' : 'text-warning' },
            { label: 'Interviews Taken', value: userStats?.total_interviews || 0, color: 'text-accent' },
            { label: 'Roadmap Status', value: userStats?.has_roadmap ? 'Generated ✓' : (hasResume ? 'Ready to generate' : 'Needs Resume'), color: userStats?.has_roadmap ? 'text-success' : 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg-surface border border-border rounded-2xl p-5">
              <p className="text-text-muted text-xs mb-2">{stat.label}</p>
              <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Resume Analysis Section */}
        {hasResume && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
              <span className="text-primary">✨</span> Resume Highlights
            </h2>
            <div className="bg-bg-surface border border-border rounded-3xl p-6 sm:p-8">
              {loadingAnalysis ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="ml-3 text-sm text-text-muted">Loading your analysis...</span>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {analysis.summary && (
                    <div>
                      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Professional Summary</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{analysis.summary}</p>
                    </div>
                  )}

                  {analysis.skills && analysis.skills.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Core Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(analysis.skills) ? analysis.skills : (typeof analysis.skills === 'string' ? analysis.skills.split(',') : [])).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-bg-surface-2 border border-border rounded-lg text-xs font-medium text-text-primary">
                            {typeof skill === 'string' ? skill.trim() : skill?.name || JSON.stringify(skill)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    {analysis.experience && analysis.experience.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Experience</h3>
                        <div className="space-y-3">
                          {(Array.isArray(analysis.experience) ? analysis.experience : []).map((exp, i) => (
                            <div key={i} className="text-sm">
                              <p className="font-semibold text-text-primary">{exp.role}</p>
                              <p className="text-text-muted text-xs">{exp.company} • {exp.duration}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.projects && analysis.projects.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Key Projects</h3>
                        <div className="space-y-3">
                          {(Array.isArray(analysis.projects) ? analysis.projects : []).map((proj, i) => (
                            <div key={i} className="text-sm">
                              <p className="font-semibold text-text-primary">{proj.project_name}</p>
                              <p className="text-text-secondary text-xs truncate mt-0.5">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-text-muted text-sm text-center py-8">No analysis available yet. It might still be processing.</p>
              )}
            </div>
          </div>
        )}

        {/* Service Cards */}
        <h2 className="text-lg font-bold text-text-primary mb-5">Your Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <div
              key={service.title}
              onClick={() => navigate(service.to)}
              className={`
                group relative bg-bg-surface border ${service.border} ${service.hoverBorder}
                rounded-3xl p-7 cursor-pointer card-hover overflow-hidden
              `}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(108,99,255,0.06), transparent 60%)' }} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-text-muted group-hover:text-primary transition-colors">
                  <span>Open</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </>
  );
}
