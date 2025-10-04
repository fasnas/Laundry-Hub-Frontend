import React, { useState } from "react";
import { useContext } from "react";
import { userContext } from "../Context/userContext";

import {
  FaUser,
  FaTachometerAlt,
  FaShoppingCart,
  FaCogs,
  FaTags ,
  FaGift,
  FaSignOutAlt,
  FaComments,
  FaBell,
  FaFileAlt,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const LaundrySidebar = ({ laundryName }) => {
  const {userdata}=useContext(userContext)
  const [isHovered, setIsHovered] = useState(false);
  const navigate=useNavigate()

  function handlelogout(){
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    navigate("/login")
  }

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "laundryhome" },
    { icon: <FaUser />, label: "Profile", path: "laundryprofile" },
    { icon: <FaShoppingCart />, label: "Orders", path: "laundryorders " },
    { icon: <FaCogs />, label: "Order Managment", path: "laundryordermanagment" },
    { icon: <FaTags  />, label: "Price Managment", path: "items" },
    { icon: <FaGift />, label: "Coupon Managment", path: "coupon" },
    { icon: <FaComments />, label: "Chat", path: "adminchat" },
    // { icon: <FaBell />, label: "Notification Managment", path: "companies" },
    { icon: <FaFileAlt />, label: "Report", path: "report" },    
  ];

  return (
    <div
      className={`h-screen shadow-sm duration-300 flex flex-col mt-2 ${
        isHovered ? "w-55" : "w-16"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo and Laundry Name */}
      <div className="flex items-center gap-2 p-4">
        <h1 className="text-white">.</h1>
        {isHovered && (
          <span className="text-xl font-bold text-black">{laundryName}</span>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-8 ">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                isActive ? "bg-blue-900 text-white" : "text-black"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {isHovered && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4">
        <button className="flex items-center gap-3 text-red-500 hover:text-red-600"
         onClick={handlelogout}
        >
          <FiLogOut className="text-lg" />
          {isHovered && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default LaundrySidebar;
