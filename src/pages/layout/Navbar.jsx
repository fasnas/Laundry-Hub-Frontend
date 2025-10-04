import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../../assets/Screenshot 2025-06-25 110925.png";
import { useContext } from "react";
import { userContext } from "../Context/userContext";

const Navbar = () => {
  const {userdata}=useContext(userContext)
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for detecting outside click
  const menuRef = useRef(null); // for desktop dropdown
  const mobileMenuRef = useRef(null); // for mobile dropdown

  // Sync token on route change
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [location]);

  // Sync token across tabs
  useEffect(() => {
    const handleStorage = () => {
      const updatedToken = localStorage.getItem("token");
      setToken(updatedToken);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Detect click outside (desktop + mobile menus)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedLocation");
    localStorage.removeItem("name");
    setToken(null);
    navigate("/login");
    setIsOpen(false);
  };

  const navItems = [
    { label: "Services", href: "services" },
    { label: "Blog", href: "blog" },
    { label: "Offers", href: "offers" },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showNavbar ? 0 : -80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white shadow-md fixed top-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-start gap-2 text-blue-900 font-bold text-xl">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex space-x-6 text-gray-700 font-medium">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-blue-900 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {token ? (
            <>
              <button
                onClick={() => navigate("/list")}
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-500 transition"
              >
                Place Order
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition"
                >
                  <Menu size={20} />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2"
                  >
                    <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition"
                    onClick={() => navigate("/profile")}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition"
                      onClick={() => navigate("/orders")}
                    >
                      Orders
                    </button>
                    {/* <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition">
                      Notification
                    </button> */}
                    <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition"
                      onClick={() => navigate("/chat")}
                    >
                      Chat Support
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/signup"
              className="bg-blue-900 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden" ref={mobileMenuRef}>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-md px-6 pb-4"
          ref={mobileMenuRef}
        >
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-800 hover:text-blue-800 transition"
              >
                {item.label}
              </a>
            ))}

            {token ? (
              <>
                <button
                  onClick={() => {
                    navigate("/list");
                    setIsOpen(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-full text-sm"
                >
                  Place Order
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm text-center"
              >
                Signup
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
