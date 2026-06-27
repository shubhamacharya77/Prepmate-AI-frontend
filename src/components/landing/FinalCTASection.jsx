import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl p-16 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.08) 100%)',
            border: '1px solid rgba(108,99,255,0.3)',
          }}
        >
          {/* Background blobs */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #6C63FF, transparent)', filter: 'blur(60px)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', filter: 'blur(50px)' }}
          />

          <div className="relative z-10">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-6">Get Started Today</p>
            <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 leading-tight">
              Your next career move{' '}
              <span className="gradient-text">starts here</span>
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals using PrepMate to accelerate their careers.
              Start for free — no credit card required.
            </p>

            <Button
              size="xl"
              variant="primary"
              onClick={() => navigate('/login')}
              className="glow-primary min-w-64 mx-auto"
              id="final-cta-button"
            >
              Start Preparing Now →
            </Button>

            <p className="text-text-muted text-sm mt-6">
              Sign in with Google • Free to use • No setup required
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-border pt-10 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-bold text-text-primary text-sm">PrepMate</span>
        </div>
        <div className="text-center md:text-left">
          <p className="text-text-secondary text-sm font-medium">
            If it works, <span className="text-primary font-bold">Shubham Acharya</span> built it. If it breaks... it's a feature 🐛✨
          </p>
          <p className="text-xs text-text-muted mt-1">
            © {new Date().getFullYear()} PrepMate • Powered by <span className="gradient-text font-bold uppercase tracking-wider">minimal antigravity</span> 🛸
          </p>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="text-text-muted text-sm hover:text-text-secondary transition-colors">Features</a>
          <a href="#how-it-works" className="text-text-muted text-sm hover:text-text-secondary transition-colors">How it Works</a>
        </div>
      </div>
    </section>
  );
}
