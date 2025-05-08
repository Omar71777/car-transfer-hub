
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { MobileNav } from '@/components/landing/MobileNav';
import { HeroSection } from '@/components/landing/sections/HeroSection';
import { StatsSection } from '@/components/landing/sections/StatsSection';
import { FeaturesSection } from '@/components/landing/sections/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/sections/HowItWorksSection';
import { PricingSection } from '@/components/landing/sections/PricingSection';
import { TestimonialsSection } from '@/components/landing/sections/TestimonialsSection';
import { FAQSection } from '@/components/landing/sections/FAQSection';
import { CTASection } from '@/components/landing/sections/CTASection';
import { FooterSection } from '@/components/landing/sections/FooterSection';

const LandingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Navigation */}
      <LandingHeader />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Page Sections */}
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
