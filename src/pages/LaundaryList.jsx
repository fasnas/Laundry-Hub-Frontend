import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axiosInstance from "../utils/AxiosInstance";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// 🛠 Trigger resize when map modal opens
const ResizeMapOnOpen = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // slight delay after render
  }, [map]);
  return null;
};

// Detect map clicks
const LocationSelector = ({ onSelect }) => {
  useMapEvents({
    click: (e) => onSelect(e.latlng),
  });
  return null;
};

const LaundryListWithMapFilter = () => {
  const [laundries, setLaundries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [locationInfo, setLocationInfo] = useState({ lat: null, lng: null, name: "" });
  // const [allLaundries, setAllLaundries] = useState([]);
  const navigate = useNavigate();

  // Fetch laundries by coords
  const fetchLaundriesByCoords = async ({ lat, lng, name }) => {
    try {
      const res = await axiosInstance.post("/getlaundarydistance", {
        latitude: lat,
        longitude: lng,
        locationname: name,
      });
      setLaundries(res.data?.laundries || []);
    } catch (err) {
      console.error("Error fetching laundries:", err);
    }
  };

  const handleMapClick = async ({ lat, lng }) => {
    setSelectedCoords({ lat, lng });
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const geoData = await geoRes.json();
      const place = geoData?.display_name || "Unknown Location";

      const updatedLocation = {
        lat: lat.toFixed(5),
        lng: lng.toFixed(5),
        name: place,
      };

      setLocationInfo(updatedLocation);
      localStorage.setItem("selectedLocation", JSON.stringify(updatedLocation));
      await fetchLaundriesByCoords(updatedLocation);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      setLocationInfo(parsedLocation);
      setSelectedCoords({
        lat: parseFloat(parsedLocation.lat),
        lng: parseFloat(parsedLocation.lng),
      });
      fetchLaundriesByCoords(parsedLocation);
    }
  }, []);



// useEffect(() => {
//   const fetchAll = async () => {
//     try {
//       const res = await axiosInstance.get("/getall-laundry"); // endpoint returning all laundries with lat/lng
//       setAllLaundries(res.data.laundries || []);
//     } catch (err) {
//       console.error("Error fetching all laundries:", err);
//     }
//   };
//   fetchAll();
// }, []);


  return (
    <div className="flex flex-col md:flex-row mt-20 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-4">Filter Laundries</h2>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Selected Coordinates:</p>
          {locationInfo.lat && locationInfo.lng ? (
            <div className="text-xs text-gray-600 mb-2">
              Lat: <span className="font-semibold">{locationInfo.lat}</span><br />
              Lng: <span className="font-semibold">{locationInfo.lng}</span><br />
              <span className="text-blue-700 mt-2 inline-block">🏙 {locationInfo.name}</span>
            </div>
          ) : (
            <p className="text-gray-400">No location selected</p>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📍 Select Location
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🧺 Laundry Services</h1>
        {laundries.length === 0 ? (
          <p className="text-gray-500">No laundries found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {laundries.map((laundry) => (
              <div
                key={laundry._id}
                onClick={() => navigate(`/list/${laundry._id}`)}
                className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={laundry.profileImage}
                  alt={laundry.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {laundry.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Map Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl w-[95%] max-w-[600px] h-[80vh] p-4 relative shadow-xl">
            <h2 className="text-lg font-bold mb-2 text-center">
              📍 Please select the location
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              ✖
            </button>

            <div className="h-[calc(100%-2.5rem)] rounded-lg overflow-hidden">
              <MapContainer
                center={[9.99277,76.31836]}
                zoom={5}
                className="h-full w-full"
              >
                <ResizeMapOnOpen />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationSelector onSelect={handleMapClick} />
                {selectedCoords && <Marker position={selectedCoords} />}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryListWithMapFilter;
