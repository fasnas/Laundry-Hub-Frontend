import React from "react";
import LaundrySidebar from "./LaundrySidebar";
import { Outlet } from "react-router-dom";
import { userContext } from "../Context/userContext";
import { useContext } from "react";

const LaundryLayout = ({ laundryName }) => {
  const{userdata}=useContext(userContext)

  return (
    <div className="flex h-screen">
      <LaundrySidebar laundryName={laundryName} />

      <div className="flex flex-col flex-1">
        <div className="h-16 bg-white shadow px-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome To {userdata?.name}
          </h2>
          <div className="flex items-center gap-4">
            {/* <img
              src="/avatar.png"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            /> */}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LaundryLayout;
