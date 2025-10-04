import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/otp", {
        email: formData.email,
      });
      toast.success(response.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/verifyotp", {
        email: formData.email,
        otp: formData.otp,
      });
      toast.success(response.data.message || "OTP verified successfully");
      setStep(3);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Invalid OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/forgotpassword", {
        email: formData.email,
        otp: formData.otp,
        newpassword: formData.newPassword,
      });
      toast.success(response.data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
        Forgot your password?
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Enter your email address and we'll send you an OTP to reset your password
      </p>

      <form className="space-y-4" onSubmit={handleSendOTP}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </>
  );

  const renderOTPStep = () => (
    <>
      <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
        Verify OTP
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Enter the OTP sent to <span className="font-medium">{formData.email}</span>
      </p>

      <form className="space-y-4" onSubmit={handleVerifyOTP}>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
          maxLength="6"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
        >
          Back to email
        </button>
      </form>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">
        Reset Password
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Enter your new password
      </p>

      <form className="space-y-4" onSubmit={handleResetPassword}>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength="6"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength="6"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
            L
          </div>
        </div>

        {/* Dynamic Content based on step */}
        {step === 1 && renderEmailStep()}
        {step === 2 && renderOTPStep()}
        {step === 3 && renderPasswordStep()}

        {/* Back to Login */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;