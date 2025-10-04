// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axiosInstance from "../../utils/AxiosInstance";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { toast } from "sonner";

// const customIcon = new L.Icon({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const LocationPicker = ({ setCoords }) => {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setCoords([lng, lat]);
//     },
//   });
//   return null;
// };

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [otp, setOtp] = useState("");
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [laundryForm, setLaundryForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     address: "",
//   });
//   const [coords, setCoords] = useState([77.5946, 12.9716]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     let interval;
//     if (otpTimer > 0) {
//       interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSendOtp = async () => {
//     if (!formData.email) return toast.warning("Please enter an email first");
//     try {
//       const res = await axiosInstance.post("/otp", {
//         email: formData.email,
//       });
//       toast.success(res.data.message);
//       setShowOtpInput(true);
//       setOtpTimer(60);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error sending OTP");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!otp) return toast.warning("Please enter the OTP before signing up");
//     if (formData.password !== formData.confirmPassword)
//       return toast.error("Passwords do not match");

//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         otp,
//       });
//       toast.success(res.data.message)
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLaundryInputChange = (e) => {
//     setLaundryForm({ ...laundryForm, [e.target.name]: e.target.value });
//   };

//   const handleLaundrySubmit = async (e) => {
//     e.preventDefault();
//     if (laundryForm.password !== laundryForm.confirmPassword)
//       return toast.warning("Passwords do not match");

//     const payload = {
//       name: laundryForm.name,
//       email: laundryForm.email,
//       password: laundryForm.password,
//       address: laundryForm.address,
//       location: {
//         type: "Point",
//         coordinates: coords,
//       },
//     };

//     try {
//       const res = await axiosInstance.post("/laundry", payload);
//       toast.success(res.data.message || "Laundry registered successfully!");
//       setLaundryForm({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         address: "",
//       });
//       setCoords([77.5946, 12.9716]);
//       setShowModal(false);
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="mt-10 min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
//       <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md z-10">
//         <div className="flex justify-center mb-4">
//           <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
//             S
//           </div>
//         </div>
//         <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
//           Create Account
//         </h2>
//         <p className="text-center text-sm text-gray-500 mb-2">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline font-medium">
//             Sign in
//           </Link>
//         </p>
//         <p className="text-center text-sm text-gray-500 mb-6">
//           Apply for franchise?{" "}
//           <button
//             type="button"
//             onClick={() => setShowModal(true)}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Apply
//           </button>
//         </p>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md px-4 py-2"
//           />

//           <div className="relative">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email address"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-4 py-2 pr-32"
//             />
//             <button
//               type="button"
//               onClick={handleSendOtp}
//               disabled={otpTimer > 0}
//               className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
//             >
//               {otpTimer > 0 ? `${otpTimer}s` : "Send OTP"}
//             </button>
//           </div>

//           {showOtpInput && (
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-4 py-2"
//             />
//           )}

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md px-4 py-2"
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md px-4 py-2"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
//           >
//             {loading ? "Creating..." : "Sign up"}
//           </button>
//         </form>
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0  bg-gray-100 flex items-center justify-center z-50 px-2 mt-25">
//           <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh] relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
//               onClick={() => setShowModal(false)}
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4 text-center">Register Laundry</h2>
//             <form onSubmit={handleLaundrySubmit} className="space-y-3">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Laundry Name"
//                 value={laundryForm.name}
//                 onChange={handleLaundryInputChange}
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={laundryForm.email}
//                 onChange={handleLaundryInputChange}
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={laundryForm.password}
//                 onChange={handleLaundryInputChange}
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//                 required
//               />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={laundryForm.confirmPassword}
//                 onChange={handleLaundryInputChange}
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//                 required
//               />
//               <textarea
//                 name="address"
//                 placeholder="Address"
//                 value={laundryForm.address}
//                 onChange={handleLaundryInputChange}
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//               />
//               <div className="h-60">
//                 <MapContainer
//                   center={[coords[1], coords[0]]}
//                   zoom={13}
//                   style={{ height: "100%", width: "100%" }}
//                 >
//                   <TileLayer
//                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />
//                   <Marker position={[coords[1], coords[0]]} icon={customIcon} />
//                   <LocationPicker setCoords={setCoords} />
//                 </MapContainer>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </form>

//           </div>

//         </div>
//       )}
//     </div>
//   );
// };

// export default Signup;

///FORM VALIDATED BELOW

// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axiosInstance from "../../utils/AxiosInstance";
// import { useForm } from "react-hook-form";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { toast } from "sonner";

// const customIcon = new L.Icon({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const LocationPicker = ({ setCoords }) => {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setCoords([lng, lat]);
//     },
//   });
//   return null;
// };

// const Signup = () => {
//   const [otp, setOtp] = useState("");
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [coords, setCoords] = useState([77.5946, 12.9716]);
//   const navigate = useNavigate();

//   // ---- React Hook Form instances ----
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const {
//     register: registerLaundry,
//     handleSubmit: handleLaundrySubmit,
//     watch: watchLaundry,
//     reset: resetLaundry,
//     formState: { errors: laundryErrors },
//   } = useForm();

//   // OTP countdown
//   useEffect(() => {
//     let interval;
//     if (otpTimer > 0) {
//       interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer]);

//   // Send OTP
//   const handleSendOtp = async (email) => {
//     if (!email) return toast.warning("Please enter an email first");
//     try {
//       const res = await axiosInstance.post("/otp", { email });
//       toast.success(res.data.message);
//       setShowOtpInput(true);
//       setOtpTimer(60);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error sending OTP");
//     }
//   };

//   // ===== User Signup =====
//   const onSignup = async (data) => {
//     if (!otp) return toast.warning("Please enter the OTP before signing up");
//     try {
//       setLoading(true);
//       await axiosInstance.post("/register", {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         otp,
//       });
//       toast.success("Signup successful");
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== Laundry Submit =====
//   const onLaundrySubmit = async (data) => {
//     try {
//       await axiosInstance.post("/laundry", {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         address: data.address,
//         location: { type: "Point", coordinates: coords },
//       });
//       toast.success("Laundry registered successfully!");
//       resetLaundry();
//       setCoords([77.5946, 12.9716]);
//       setShowModal(false);
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="mt-10 min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
//       <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md z-10">
//         <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
//           Create Account
//         </h2>
//         <p className="text-center text-sm text-gray-500 mb-2">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline font-medium">
//             Sign in
//           </Link>
//         </p>
//         <p className="text-center text-sm text-gray-500 mb-6">
//           Apply for franchise?{" "}
//           <button
//             type="button"
//             onClick={() => setShowModal(true)}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Apply
//           </button>
//         </p>

//         {/* USER SIGNUP FORM */}
//         <form className="space-y-4" onSubmit={handleSubmit(onSignup)}>
//           <input
//             {...register("name", { required: "Name is required" })}
//             placeholder="Full Name"
//             className="w-full border border-gray-300 rounded-md px-4 py-2"
//           />
//           {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

//           <div className="relative">
//             <input
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
//               })}
//               placeholder="Email address"
//               className="w-full border border-gray-300 rounded-md px-4 py-2 pr-32"
//             />
//             <button
//               type="button"
//               onClick={() => handleSendOtp(watch("email"))}
//               disabled={otpTimer > 0}
//               className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
//             >
//               {otpTimer > 0 ? `${otpTimer}s` : "Send OTP"}
//             </button>
//           </div>
//           {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

//           {showOtpInput && (
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-4 py-2"
//             />
//           )}

//           <input
//             type="password"
//             {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })}
//             placeholder="Password"
//             className="w-full border border-gray-300 rounded-md px-4 py-2"
//           />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

//           <input
//             type="password"
//             {...register("confirmPassword", {
//               required: "Confirm password",
//               validate: (val) => val === watch("password") || "Passwords do not match",
//             })}
//             placeholder="Confirm Password"
//             className="w-full border border-gray-300 rounded-md px-4 py-2"
//           />
//           {errors.confirmPassword && (
//             <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
//           >
//             {loading ? "Creating..." : "Sign up"}
//           </button>
//         </form>
//       </div>

//       {/* ===== Laundry Modal ===== */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 px-2 mt-25">
//           <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh] relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
//               onClick={() => setShowModal(false)}
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4 text-center">Register Laundry</h2>

//             <form onSubmit={handleLaundrySubmit(onLaundrySubmit)} className="space-y-3">
//               <input
//                 {...registerLaundry("name", { required: "Laundry name required" })}
//                 placeholder="Laundry Name"
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//               />
//               {laundryErrors.name && <p className="text-red-500 text-sm">{laundryErrors.name.message}</p>}

//               <input
//                 type="email"
//                 {...registerLaundry("email", {
//                   required: "Email required",
//                   pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
//                 })}
//                 placeholder="Email"
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//               />
//               {laundryErrors.email && <p className="text-red-500 text-sm">{laundryErrors.email.message}</p>}

//               <input
//                 type="password"
//                 {...registerLaundry("password", { required: "Password required", minLength: { value: 6, message: "Min 6 chars" } })}
//                 placeholder="Password"
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//               />
//               {laundryErrors.password && <p className="text-red-500 text-sm">{laundryErrors.password.message}</p>}

//               <input
//                 type="password"
//                 {...registerLaundry("confirmPassword", {
//                   required: "Confirm password",
//                   validate: (val) => val === watchLaundry("password") || "Passwords do not match",
//                 })}
//                 placeholder="Confirm Password"
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//               />
//               {laundryErrors.confirmPassword && (
//                 <p className="text-red-500 text-sm">{laundryErrors.confirmPassword.message}</p>
//               )}

//               <textarea
//                 {...registerLaundry("address", { required: "Address required" })}
//                 placeholder="Address"
//                 className="w-full border border-gray-300 rounded-md px-4 py-2"
//               />
//               {laundryErrors.address && <p className="text-red-500 text-sm">{laundryErrors.address.message}</p>}

//               <div className="h-60">
//                 <MapContainer
//                   center={[coords[1], coords[0]]}
//                   zoom={13}
//                   style={{ height: "100%", width: "100%" }}
//                 >
//                   <TileLayer
//                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />
//                   <Marker position={[coords[1], coords[0]]} icon={customIcon} />
//                   <LocationPicker setCoords={setCoords} />
//                 </MapContainer>
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signup;



import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { useForm } from "react-hook-form";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "sonner";

const customIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationPicker = ({ setCoords }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoords([lng, lat]);
    },
  });
  return null;
};

const Signup = () => {
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coords, setCoords] = useState([77.5946, 12.9716]);
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

  // ---- React Hook Form instances ----
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const {
    register: registerLaundry,
    handleSubmit: handleLaundrySubmit,
    watch: watchLaundry,
    reset: resetLaundry,
    formState: { errors: laundryErrors },
  } = useForm();

  // OTP countdown
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Send OTP
  const handleSendOtp = async (email) => {
    if (!email) return toast.warning("Please enter an email first");
    try {
      const res = await axiosInstance.post("/otp", { email });
      toast.success(res.data.message);
      setShowOtpInput(true);
      setOtpTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  // ===== User Signup =====
  const onSignup = async (data) => {
    if (!otp) return toast.warning("Please enter the OTP before signing up");
    try {
      setLoading(true);
      await axiosInstance.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        otp,
      });
      toast.success("Signup successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== Laundry Submit =====
  const onLaundrySubmit = async (data) => {
  try {
    // Prepare FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("address", data.address);
    formData.append("location", JSON.stringify({ type: "Point", coordinates: coords }));

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // Send to backend
    await axiosInstance.post("/laundry", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Laundry registered successfully!");
    resetLaundry();
    setCoords([77.5946, 12.9716]);
    setProfileImage(null);
    setShowModal(false);
    navigate("/login");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  }
};




  return (
    <div className="mt-10 min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md z-10">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mb-6">
          Apply for franchise?{" "}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:underline font-medium"
          >
            Apply
          </button>
        </p>

        {/* USER SIGNUP FORM */}
        <form className="space-y-4" onSubmit={handleSubmit(onSignup)}>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <div className="relative">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-32"
            />
            <button
              type="button"
              onClick={() => handleSendOtp(watch("email"))}
              disabled={otpTimer > 0}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {otpTimer > 0 ? `${otpTimer}s` : "Send OTP"}
            </button>
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {showOtpInput && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          )}

          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password",
              validate: (val) => val === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
      </div>

      {/* ===== Laundry Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 px-2 mt-25">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Register Laundry</h2>

            <form onSubmit={handleLaundrySubmit(onLaundrySubmit)} className="space-y-3">
              <input
                {...registerLaundry("name", { required: "Laundry name required" })}
                placeholder="Laundry Name"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {laundryErrors.name && <p className="text-red-500 text-sm">{laundryErrors.name.message}</p>}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />

              <input
                type="email"
                {...registerLaundry("email", {
                  required: "Email required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {laundryErrors.email && <p className="text-red-500 text-sm">{laundryErrors.email.message}</p>}

              <input
                type="password"
                {...registerLaundry("password", { required: "Password required", minLength: { value: 6, message: "Min 6 chars" } })}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {laundryErrors.password && <p className="text-red-500 text-sm">{laundryErrors.password.message}</p>}

              <input
                type="password"
                {...registerLaundry("confirmPassword", {
                  required: "Confirm password",
                  validate: (val) => val === watchLaundry("password") || "Passwords do not match",
                })}
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {laundryErrors.confirmPassword && (
                <p className="text-red-500 text-sm">{laundryErrors.confirmPassword.message}</p>
              )}

              <textarea
                {...registerLaundry("address", { required: "Address required" })}
                placeholder="Address"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {laundryErrors.address && <p className="text-red-500 text-sm">{laundryErrors.address.message}</p>}

              <div className="h-60">
                <MapContainer
                  center={[coords[1], coords[0]]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[coords[1], coords[0]]} icon={customIcon} />
                  <LocationPicker setCoords={setCoords} />
                </MapContainer>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
