import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get('/api/oauth');
      const { authorization_url } = response.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (err) {
      setError('Failed to initiate login. Please check if the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base gradient-mesh flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #6C63FF, transparent)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-muted hover:text-text-secondary text-sm mb-8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to home
        </button>

        {/* Card */}
        <div className="bg-bg-surface border border-border rounded-3xl p-8 shadow-2xl animate-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-xl text-text-primary">
              Prep<span className="gradient-text">Mate</span>
            </span>
          </div>

          <h1 className="text-3xl font-black text-text-primary mb-2">Welcome back</h1>
          <p className="text-text-secondary mb-8 text-sm leading-relaxed">
            Sign in with your Google account to access your career dashboard, roadmap, and interview practice sessions.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            id="google-login-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-3 px-6 py-4
              bg-white text-gray-800 font-semibold text-base rounded-2xl
              hover:bg-gray-50 transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl
              btn-press
            "
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          <p className="text-center text-text-muted text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Features reminder */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: '🗺️', label: 'Career Roadmap' },
            { icon: '🔍', label: 'Job Search' },
            { icon: '🎙️', label: 'Interview Prep' },
          ].map((f) => (
            <div key={f.label} className="text-center p-3 rounded-xl bg-bg-surface/50 border border-border">
              <p className="text-xl mb-1">{f.icon}</p>
              <p className="text-xs text-text-muted">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
