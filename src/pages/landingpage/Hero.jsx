import React from "react";
import Navbar from "../layout/Navbar";
// import sample from "../../assets/laundry-elements-and-clothes-banner-vector.jpg";
import DraggableChatButton from "../../components/ChatDrag";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate=useNavigate()
  return (
    <div>
      {/* <Navbar /> */}
      <section className="relative min-h-[100vh] bg-gradient-to-br from-sky-100 to-sky-300 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Left Section */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Laundry <span className="text-blue-800">Made Effortless</span>
            </h1>
            <p className="text-gray-700 text-lg">
              Schedule a pickup in seconds. Let us clean, fold, and return your
              clothes — fresh and flawless.
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full shadow-lg transition duration-200"
              onClick={()=>navigate("/list")}
              >
                Book Now
              </button>
              <button className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-6 py-3 rounded-full transition duration-200"
                 onClick={()=>navigate("/list")}
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-800">10K+</h2>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-800">24 Hrs</h2>
                <p className="text-sm text-gray-600">Quick Turnaround</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-800">99%</h2>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Background Shape */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L48,197.3C96,171,192,117,288,90.7C384,64,480,64,576,80C672,96,768,128,864,144C960,160,1056,160,1152,154.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>
  
      {/* <DraggableChatButton/> */}
    </div>
  );
};

export default Hero;