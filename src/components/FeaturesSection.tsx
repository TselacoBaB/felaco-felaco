
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Image, MessageSquare, Share, User, Video } from "lucide-react";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="border-gray-200 card-hover">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-felaco-purple to-felaco-orange flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Image className="text-felaco-purple" size={24} />,
      title: "Photo Sharing",
      description: "Share high-quality images with your fans and followers, just like Instagram."
    },
    {
      icon: <Video className="text-felaco-blue" size={24} />,
      title: "Video Content",
      description: "Upload and monetize short or long-form videos with advanced analytics."
    },
    {
      icon: <MessageSquare className="text-felaco-orange" size={24} />,
      title: "Direct Messaging",
      description: "Connect privately with your fans through our secure messaging system."
    },
    {
      icon: <Share className="text-felaco-purple" size={24} />,
      title: "Social Features",
      description: "Engage with your audience through comments, likes, and shares."
    },
    {
      icon: <Heart className="text-felaco-orange" size={24} />,
      title: "Fan Subscriptions",
      description: "Create subscription tiers with exclusive content for your most loyal fans."
    },
    {
      icon: <User className="text-felaco-blue" size={24} />,
      title: "Custom Profile",
      description: "Design your profile page to showcase your brand and attract new fans."
    }
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All Your Favorite Platforms <span className="gradient-text">Combined</span>
          </h2>
          <p className="text-xl text-gray-600">
            Felaco brings together the best features from the top social and content creation platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
