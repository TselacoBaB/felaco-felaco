
const Testimonial = ({ quote, author, role }: { quote: string, author: string, role: string }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
      </div>
      <p className="text-gray-800 mb-4 italic">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "Felaco has completely transformed how I monetize my content. I'm making 3x more than I did on other platforms!",
      author: "Jessica K.",
      role: "Content Creator"
    },
    {
      quote: "I love that I can interact with my favorite creators directly. The exclusive content is worth every penny.",
      author: "Michael T.",
      role: "Subscriber"
    },
    {
      quote: "The all-in-one aspect saved me so much time. No more juggling multiple platforms to reach my audience.",
      author: "Alicia R.",
      role: "Influencer"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">Creators and Fans</span>
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied users who've made Felaco their home for content creation and consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
