// import React, { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import axiosInstance from "../../utils/AxiosInstance";
// import { toast } from "sonner";
// import { userContext } from "../Context/userContext";

// const Login = () => {
//   const { userdata, setuserdata } = useContext(userContext)

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post("/login", formData);
//       console.log(response)

//       toast.success(response.data.message);

//       const { user, token } = response.data;
//       setuserdata(user)

//       console.log(userdata, "user data from context api")


//       localStorage.setItem("token", token);
//       localStorage.setItem("name", user.name);
//       localStorage.setItem("role", user.role);

//       if (user.role === "user") {
//         navigate("/");
//       } else if (user.role == "laundry") {
//         navigate("/laundryhome");
//       } else {
//         navigate("/notfound"); // default fallback
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || err.message || "Login failed";
//       toast.error(errorMessage);
//     }
//   };


//   const handleGoogleLogin = async (credentialResponse) => {
//     try {
//       const response = await axiosInstance.post("/googlelogin", {
//         credential: credentialResponse.credential,
//       });
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("name", response.data.user.name);
//       toast.success("google login success");
//       navigate("/");
//     } catch (err) {
//       console.error("Google Login error:", err);
//       toast.error("Google Login Failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
//         {/* Avatar */}
//         <div className="flex justify-center mb-4">
//           <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
//             L
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
//           Sign in  Here
//         </h2>
//         <p className="text-center text-sm text-gray-500 mb-6">
          
         
//         </p>

//         {/* Form */}
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email address"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <div className="flex justify-between items-center text-sm text-gray-600">
//             <Link to="/signup" className="text-blue-600 hover:underline">
//               Create account
//             </Link>

//             <Link to="/forgot" className="text-blue-600 hover:underline">
//               Forgot password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
//           >
//             Sign In
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="my-4 text-center text-sm text-gray-500">
//           Or continue with
//         </div>

//         {/* Google Login */}
//         <div className="flex justify-center">
//           <GoogleLogin
//             onSuccess={handleGoogleLogin}
//             onError={() => {
//               console.log("Google Login Failed");
//               toast.error("Google Login Failed");
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



////FORM VALIDATED BELLOW


import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "sonner";
import { userContext } from "../Context/userContext";

const Login = () => {
  const { setuserdata } = useContext(userContext);
  const navigate = useNavigate();

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Submit handler
  const onSubmit = async (formData) => {
    try {
      const response = await axiosInstance.post("/login", formData);
      toast.success(response.data.message);

      const { user, token } = response.data;
      setuserdata(user);
      console.log(user,"haha")

      localStorage.setItem("token", token);
      localStorage.setItem("name", user.name);
      localStorage.setItem("role", user.role);

      if (user.role === "user") {
        navigate("/");
      } else if (user.role === "laundry") {
        navigate("/laundryhome");
      } else {
        navigate("/notfound");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post("/googlelogin", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.user.name);
      toast.success("Google login success");
      navigate("/");
    } catch (err) {
      console.error("Google Login error:", err);
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
            L
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
          Sign in Here
        </h2>

        {/* Form with React Hook Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create account
            </Link>
            <Link to="/forgot" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 text-center text-sm text-gray-500">
          Or continue with
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
