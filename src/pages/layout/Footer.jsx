import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-lg font-semibold text-white">Laundry Hub</span>
          </div>
          <p className="text-sm">
            Your trusted partner for premium laundry and dry cleaning services with
            convenient pickup and delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Services</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-2">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" />
              123 Laundry Lane, Clean City, CC 12345
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-400" />
              911
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              support@laundry.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © 2025 <span className="font-medium">Laundry Hub</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
