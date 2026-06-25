import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-glow-primary transition-all duration-300">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-text-primary tracking-tight">
              Prep<span className="gradient-text">Mate</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#why-prepmate" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Why PrepMate</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Get Started →
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
