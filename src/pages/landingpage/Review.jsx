import React from "react";
import { Star } from "lucide-react"; // or use any icon library like FontAwesome

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    feedback:
      "SparkleClean has been a game-changer for me. As a busy professional, I no longer have to worry about laundry. The service is reliable and my clothes come back perfectly clean every time.",
  },
  {
    name: "Michael Chen",
    rating: 5,
    feedback:
      "I've tried several laundry services, but SparkleClean stands out. The attention to detail is impressive, and the delivery is always on time. Highly recommend!",
  },
  {
    name: "Emily Rodriguez",
    rating: 3,
    feedback:
      "The convenience of scheduling pickups through the app is fantastic. The team is professional, and they handle my clothes with care. SparkleClean has made my life easier!",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-sky-100 to-sky-200 px-6 text-center pb-40 ">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        What Our Customers Say
      </h2>
      <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
        Don’t just take our word for it. Here’s what our customers have to say about SparkleClean.
      </p>

      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg shadow-md p-6 text-left">
            <div className="flex items-center mb-3 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < t.rating ? "#facc15" : "none"}
                  stroke="#facc15"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 italic mb-4">“{t.feedback}”</p>
            <p className="font-semibold text-gray-900">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
