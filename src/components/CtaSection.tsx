
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center relative overflow-hidden rounded-3xl bg-felaco-gradient p-1">
        <div className="bg-white dark:bg-gray-900 rounded-[1.4rem] p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join <span className="gradient-text">Felaco</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a creator looking to monetize your content or a fan seeking exclusive experiences, Felaco is the platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="cta-button text-lg px-8 py-6">Start Creating</Button>
            <Button variant="outline" className="text-lg px-8 py-6 rounded-full">Browse Creators</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
