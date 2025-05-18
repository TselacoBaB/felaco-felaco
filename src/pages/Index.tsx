import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CreatorSection from "@/components/CreatorSection";
import FansSection from "@/components/FansSection";
import TestimonialSection from "@/components/TestimonialSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to the app
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>Felaco – Connect with Creators & Fans | Social, Stories, Reels, and More</title>
        <meta name="description" content="Felaco is the next-gen platform for creators and fans. Discover exclusive content, trending stories, and connect with your favorite creators. Join now!" />
        <meta name="keywords" content="Felaco, creators, fans, social, stories, reels, trending, exclusive, platform" />
        <meta property="og:title" content="Felaco – Connect with Creators & Fans" />
        <meta property="og:description" content="Felaco is the next-gen platform for creators and fans. Discover exclusive content, trending stories, and connect with your favorite creators." />
        <meta property="og:image" content="/lovable-uploads/icon_logo_f.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://felaco.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Felaco – Connect with Creators & Fans" />
        <meta name="twitter:description" content="Felaco is the next-gen platform for creators and fans. Discover exclusive content, trending stories, and connect with your favorite creators." />
        <meta name="twitter:image" content="/lovable-uploads/icon_logo_f.png" />
        <link rel="canonical" href="https://felaco.com/" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          
          <div className="py-16 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Platform Launch Countdown</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're excited to launch Felaco soon. Get ready to connect with creators and fans!
                </p>
              </div>
              <CountdownTimer />
            </div>
          </div>
          
          <FeaturesSection />
          <CreatorSection />
          <FansSection />
          <TestimonialSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
