import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Register";
import Layout from "./pages/layout/Layout";
import Landing from "./pages/landingpage/Landing";
import Services from "./pages/landingpage/Service";
import Testimonials from "./pages/landingpage/Review";
import Working from "./pages/landingpage/Working";
import Coupon from "./pages/Coupon";
import BlogPage from "./pages/landingpage/Blog";
import MyOrders from "./pages/order/myOrder";
import LaundryLayout from "./pages/laundry/LaundryLayout";
import LaundryHome from "./pages/laundry/LaundryHome";
import LaundryProfile from "./pages/laundry/LaundryProfile";
import LaundryList from "./pages/LaundaryList";
import LaundryDetail from "./pages/singleLaundry";
import LaundryItemForm from "./pages/laundry/itemAdding";
import { PrivateRoute } from "./protect/ProtectedRoute";
import { PublicRoute } from "./protect/ProtectedRoute";
import ToastProvider from "./components/Toast";
import AddressPage from "./pages/payment/Adress";
import AdminOrdersComponent from "./pages/laundry/orderManagment";
import LaundryOrders from "./pages/laundry/LaundryOrders";
import ForgotPassword from "./pages/auth/Forgot";
import CouponManagement from "./pages/laundry/couponManagment";
import CouponBrowser from "./pages/Coupon";
import UserProfile from "./pages/UserProfile";
// import Chat from "./pages/ChatSupport";
// import LaundryChatPage from "./pages/laundry/LaundryChat";
import LaundryChatSystem from "./pages/laundry/LaundryChat";
import Chat from "./pages/ChatSupport";

import MonthlyReport from "./pages/laundry/LaundryReport";
import { FaUserTimes } from "react-icons/fa";
import UserMetaCard from "./pages/laundry/LaundryProfile";
import LaundryChat from "./pages/laundry/LaundryChat";
import UserChat from "./pages/ChatSupport";
import NotFound from "./pages/notFound";

const App = () => {
  return (
    <Router>
      <ToastProvider />
      <Routes>
        {/* //user// */}
        <Route element={<Layout />}>
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<Landing />} />
          <Route path="/services" element={<Services />} />
          <Route path="/works" element={<Working />} />
          <Route path="/review" element={<Testimonials />} />
          <Route path="/offers" element={<CouponBrowser />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/chat" element={<PrivateRoute><UserChat/></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/list" element={<PrivateRoute><LaundryList /></PrivateRoute>} />
          <Route path="/list/:id" element={<PrivateRoute><LaundryDetail /></PrivateRoute>} />
          <Route path="/address" element={<PrivateRoute><AddressPage /></PrivateRoute>} />
          <Route path="/forgot" element={<ForgotPassword />} />

        </Route>
        <Route path="*" element={<NotFound />} />

        {/* //laundry// */}
        <Route element={<LaundryLayout />}>
          <Route path="/laundryhome" element={<LaundryHome />} />
          <Route path="/laundryprofile" element={<LaundryProfile />} />
          <Route path="/items" element={<LaundryItemForm />} />
          <Route path="/laundryorders" element={<LaundryOrders />} />
          <Route path="/laundryordermanagment" element={<AdminOrdersComponent />} />
          <Route path="/coupon" element={<CouponManagement />} />
          <Route path="/adminchat" element={<LaundryChat />} />
          <Route path="/report" element={<MonthlyReport />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
