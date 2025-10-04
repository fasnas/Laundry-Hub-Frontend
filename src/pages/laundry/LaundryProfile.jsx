import React, { useEffect, useState } from "react";
import { User, Mail, MapPin, Calendar, Package, Edit, Camera } from "lucide-react";
import axiosInstance from "../../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

export default function LaundryProfile() {
  const [laundry, setLaundry] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchLaundry = async () => {
      try {
        const { data } = await axiosInstance.get("/getlogedlaundry");
        setLaundry(data);
      } catch (err) {
        console.error("Error loading laundry profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaundry();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCoordinates = (coordinates) => {
    if (!coordinates || coordinates.length !== 2) return "Location not set";
    return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!laundry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <User className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-red-600">Unable to load laundry profile</p>
        </div>
      </div>
    );
  }

  const { name, email, profileImage, location, createdAt, items, role, updatedAt } = laundry;
  const coordinates = location?.coordinates || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="mt-2 text-gray-600">Manage your laundry business information</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Cover Section */}
          <div className="bg-gradient-to-r bg-blue-200 h-32 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={profileImage}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
            <div className="flex items-center justify-center text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full uppercase">
                {role}
              </span>
            </div>
            
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900 font-medium">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Location
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Coordinates</p>
                  <p className="text-gray-900 font-medium">{formatCoordinates(coordinates)}</p>
                  {coordinates.length === 2 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                      View on Map →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium">{formatDate(createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900 font-medium">{formatDate(updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-orange-600" />
              Services
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Package className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Available Services</p>
                  <p className="text-gray-900 font-medium">{items?.length || 0} Services</p>
                </div>
              </div>
              {items && items.length > 0 && (
                <div className="mt-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800"
                   onClick={()=>navigate("/items")}
                  >
                    Manage Services →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {/* <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Update Profile
            </button> */}
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <Package className="w-4 h-4 mr-2"
              onClick={()=>navigate("items")}
              />
              Manage Services
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}