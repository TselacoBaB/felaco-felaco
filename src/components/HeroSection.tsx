
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden pt-20 pb-28 md:pt-28 md:pb-40 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 -z-10" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-felaco-purple opacity-10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-felaco-orange opacity-10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-6 z-10">
          <div className="inline-block px-4 py-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm">
            <p className="text-sm font-medium text-gray-600">
              <span className="text-felaco-purple font-semibold">New</span> - The Ultimate Creator Platform
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Create, Share, and <span className="gradient-text">Monetize</span> Your Content
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Felaco combines the best of Instagram, Twitter, Snapchat, and Strip Chat into one powerful platform for creators and fans.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button className="cta-button text-lg px-8 py-6">Get Started</Button>
            <Button variant="outline" className="text-lg px-8 py-6 rounded-full">Learn More</Button>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden"></div>
            </div>
            <p className="text-sm text-gray-500"><span className="font-semibold">10,000+</span> creators already joined</p>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-felaco-purple via-felaco-blue to-felaco-orange rounded-full blur-md opacity-20 absolute -z-10"></div>
          <div className="w-full max-w-md">
            <div className="relative w-full rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100 card-hover animate-float">
              <div className="bg-felaco-gradient h-3 w-full"></div>
              <img src="/lovable-uploads/c57b3ac2-d55c-4fbe-869f-d3207d6b9bde.png" alt="Felaco Logo" className="absolute top-6 left-6 w-8 h-8" />
              <div className="p-6 pt-14">
                <div className="space-y-4">
                  <div className="w-full h-40 bg-gray-100 rounded-lg"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-felaco-purple"></div>
                      <div className="w-6 h-6 rounded-full bg-felaco-blue"></div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
