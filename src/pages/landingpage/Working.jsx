import React from "react";
import { FaBoxOpen, FaClock, FaLandmark, FaTruck } from "react-icons/fa";

const Working = () => {
  const steps = [
    {
      icon: <FaLandmark size={28} className="text-blue-500" />,
      title: "1. Select Adress",
      desc: "Choose a convenient Adress for us to collect your laundry from your doorstep.",
    },
    {
      icon: <FaBoxOpen size={28} className="text-blue-500" />,
      title: "2. Schedule Pickup",
      desc: "Choose a convenient time for us to collect your laundry from your doorstep.",
    },
    {
      icon: <FaClock size={28} className="text-blue-500" />,
      title: "3. We Clean & Care",
      desc: "Our professionals clean your clothes with premium detergents and careful attention.",
    },
    {
      icon: <FaTruck size={28} className="text-blue-500" />,
      title: "4. Fast Delivery",
      desc: "We deliver your fresh, clean clothes back to you at your preferred time.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-sky-40 to-sky-200 py-14 px-6 text-center h-[65vh]">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        How LaundryHub Works
      </h2>
      <p className="text-gray-600 mb-10">
        We've simplified the laundry process so you can focus on what matters most to you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-left hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h4 className="font-semibold text-lg mb-2 text-center">{step.title}</h4>
            <p className="text-gray-600 text-sm text-center">{step.desc}</p>
          </div>
        ))}
      </div>

      <button className="mt-10 px-6 py-2 bg-gray-900 text-white font-semibold rounded-full hover:bg-blue-700 transition flex items-center justify-center mx-auto">
        Get Started <span className="ml-2">→</span>
      </button>
    </section>
  );
};

export default Working;
