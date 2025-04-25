
const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 container mx-auto bg-primary/5 rounded-3xl">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        What Our Travelers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 italic mb-4">
            "The AI-powered recommendations were spot-on! Found amazing vegan restaurants I wouldn't have discovered otherwise."
          </p>
          <p className="font-semibold">- Sarah M.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 italic mb-4">
            "Virtual tours helped me plan my trip better. It's like being there before actually going!"
          </p>
          <p className="font-semibold">- James R.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 italic mb-4">
            "Love how easy it is to find eco-friendly accommodations. Makes sustainable travel so much simpler."
          </p>
          <p className="font-semibold">- Emma L.</p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
