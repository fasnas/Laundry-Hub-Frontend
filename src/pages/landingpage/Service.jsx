import React from "react";

const services = [
  {
    title: "Wash & Fold",
    desc: "Your everyday laundry, washed, dried, and neatly folded.",
    image: "https://images.ctfassets.net/exql6ar8lq2x/7jAutDzhLPFYI43qPNVdIg/814676b136cdf3066581cd8c5ca96c0e/Woman_Holding_Folded_Clothes.jpg", // replace with your image
  },
  {
    title: "Dry Cleaning",
    desc: "Professional care for your delicate and special garments.",
    image: "https://housing.com/news/wp-content/uploads/2023/07/How-to-dry-clean-clothes-at-home-f.jpg", // replace with your image
  },
  {
    title: "Steam Ironing",
    desc: "Crisp, wrinkle-free clothes ready to wear or hang.",
    image: "https://cdn.accentuate.io/607624560944/-1695035269432/imp-of-ironing-v1716891803647.jpg?800x800", // replace with your image
  },
  {
    title: "Special Care",
    desc: "Custom treatment for specialty items and fabrics.",
    image: "https://www.love2laundry.com/blog/wp-content/uploads/2023/03/shutterstock_1776525326.jpg", // replace with your image
  },
];

const Services = () => {
  return (
    <section className=" py-14 px-6 text-center bg-gradient-to-br from-sky-10 to-sky-100">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Services</h2>
      <p className="text-gray-600 mb-10 max-w-xl mx-auto">
        We offer a range of professional laundry and dry cleaning services to meet your needs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={service.image}
              alt={service.title}
              className="h-44 w-full object-cover"
            />
            <div className="p-5 text-left">
              <h4 className="font-semibold text-lg mb-2">{service.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{service.desc}</p>
            
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
