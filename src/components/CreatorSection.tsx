
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share } from "lucide-react";

const CreatorSection = () => {
  return (
    <section id="for-creators" className="py-24 px-6 bg-creator-gradient">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-felaco-purple opacity-5 rounded-full blur-3xl -z-10"></div>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-felaco-purple to-felaco-orange"></div>
                <div>
                  <p className="font-semibold">@creator</p>
                  <p className="text-sm text-gray-500">Content Creator</p>
                </div>
              </div>
              <Button className="cta-button h-8 px-4">Subscribe</Button>
            </div>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg w-full"></div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="text-felaco-purple h-5 w-5" />
                    <span className="text-sm">2.4k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="text-felaco-blue h-5 w-5" />
                    <span className="text-sm">142</span>
                  </div>
                </div>
                <div>
                  <Share className="text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div className="pt-2">
                <p className="font-semibold">Latest exclusive content for my subscribers ✨</p>
                <p className="text-gray-600 text-sm mt-1">Check out my latest creation! Exclusive for my Tier 3 subscribers.</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-purple-100 text-felaco-purple rounded-full text-sm">Exclusive</span>
                <span className="px-3 py-1 bg-blue-100 text-felaco-blue rounded-full text-sm">Premium</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm mb-4">
            <p className="text-sm font-medium text-felaco-purple">For Content Creators</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Monetize Your Content <span className="gradient-text">Your Way</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Take full control of your content and earnings. Felaco offers the most creator-friendly platform with the lowest fees in the industry.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-felaco-purple/10 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-felaco-purple"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Multiple Revenue Streams</h3>
                <p className="text-gray-600">Subscriptions, pay-per-view content, tips, merchandise, and more.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-felaco-blue/10 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-felaco-blue"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Advanced Analytics</h3>
                <p className="text-gray-600">Track performance and understand what content resonates with your audience.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-felaco-orange/10 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-felaco-orange"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Promotional Tools</h3>
                <p className="text-gray-600">Grow your audience with our built-in promotional and marketing tools.</p>
              </div>
            </div>
          </div>
          
          <Button className="cta-button text-lg px-8 py-6">Start Creating</Button>
        </div>
      </div>
    </section>
  );
};

export default CreatorSection;
