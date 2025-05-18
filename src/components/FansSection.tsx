
import { Button } from "@/components/ui/button";
import { Heart, Instagram, MessageSquare, Twitter, Video } from "lucide-react";

const FansSection = () => {
  return (
    <section id="for-fans" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm mb-4">
            <p className="text-sm font-medium text-felaco-blue">For Fans</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Follow Your Favorite <span className="gradient-text">Creators</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover and support your favorite creators all in one place. Get exclusive content and interact directly with creators you love.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-felaco-purple/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="text-felaco-purple h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Exclusive Content</h3>
                <p className="text-gray-600">Access photos, videos, and live streams not available anywhere else.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-felaco-blue/10 flex items-center justify-center flex-shrink-0 mt-1">
                <MessageSquare className="text-felaco-blue h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Direct Interaction</h3>
                <p className="text-gray-600">Chat directly with your favorite creators and join interactive live sessions.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-felaco-orange/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Video className="text-felaco-orange h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">All-in-One Platform</h3>
                <p className="text-gray-600">No more switching between apps - get Instagram, Twitter, Snapchat, and more in one place.</p>
              </div>
            </div>
          </div>
          
          <Button className="cta-button text-lg px-8 py-6">Discover Creators</Button>
        </div>
        
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Instagram className="text-felaco-purple h-5 w-5" />
                  <span className="text-sm font-medium">Instagram-style</span>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-gray-500">1.2k</span>
                  </div>
                  <span className="text-xs text-gray-500">5m ago</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Twitter className="text-felaco-blue h-5 w-5" />
                  <span className="text-sm font-medium">Twitter-style</span>
                </div>
                <p className="text-sm mb-2">Just posted a new exclusive photo set for my subscribers! 📸 #content #exclusive</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-gray-500">845</span>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Video className="text-felaco-orange h-5 w-5" />
                  <span className="text-sm font-medium">Snapchat-style</span>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-felaco-gradient flex items-center justify-center">
                    <span className="text-white font-bold">24h</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className="text-xs text-gray-500">Tap to view</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-felaco-purple">Premium</span>
                </div>
                <div className="aspect-square bg-black rounded-lg mb-2 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-felaco-gradient flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className="text-xs text-gray-500">Exclusive content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FansSection;
