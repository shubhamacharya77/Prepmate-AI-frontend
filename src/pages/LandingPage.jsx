import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import WhyPrepMateSection from '../components/landing/WhyPrepMateSection';
import FinalCTASection from '../components/landing/FinalCTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyPrepMateSection />
      <FinalCTASection />
    </div>
  );
}
