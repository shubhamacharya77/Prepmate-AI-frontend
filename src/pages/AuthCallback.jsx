import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      // Small delay for UX
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
    } else {
      setError('Authentication failed. No token received from server.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mx-auto mb-6 text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-3">Authentication Failed</h2>
          <p className="text-text-secondary text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base gradient-mesh flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-6" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Signing you in...</h2>
        <p className="text-text-secondary text-sm">Verifying your Google account</p>
      </div>
    </div>
  );
}
