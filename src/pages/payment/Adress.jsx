import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackAlert from "../../components/BackAlert";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Coupon related states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      type: "HOME",
    }
  });

  useEffect(() => {
    fetchAddresses();
    fetchCart();
    loadRazorpayScript();
    fetchAvailableCoupons();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cartsummary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      const res = await axiosInstance.get("/available-coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableCoupons(res.data.coupons || []);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("Please enter a coupon code");
      return;
    }

    if (!cart?.totalPrice || !cart?._id) {
      toast.warning("Cart information not available");
      return;
    }

    try {
      setApplyingCoupon(true);
      const res = await axiosInstance.post("/apply-coupon", {
        code: couponCode.toUpperCase(),
        orderTotal: cart.totalPrice,
        cartid: cart._id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discountAmount: res.data.discountAmount,
        finalTotal: res.data.finalTotal
      });
      
      // Update cart with new total
      setCart(prevCart => ({
        ...prevCart,
        totalPrice: res.data.finalTotal
      }));
      fetchCart();
      toast.success(`Coupon applied! You saved ₹${res.data.discountAmount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!cart?._id) {
      toast.warning("Cart information not available");
      return;
    }

    const couponDiscount = appliedCoupon?.discountAmount || 0;

    try {
      const res = await axiosInstance.post("/remove-coupon", {
        cartid: cart._id,
        couponDiscount
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedCoupon(null);
      setCouponCode("");
      fetchCart();
      
      toast.success("Coupon removed");
    } catch (err) {
      // Fallback: remove coupon locally if API fails
      setAppliedCoupon(null);
      setCouponCode("");
      fetchCart();
      toast.success("Coupon removed");
    }
  };

  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.code);
    setShowAllCoupons(false);
  };

  // Form submit handler using React Hook Form
  const onSubmitAddress = async (data) => {
    try {
      setAddingAddress(true);
      const res = await axiosInstance.post("/addresses/add", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
      reset(); // Reset form using React Hook Form
      setShowAddForm(false);
      toast.success("Address added successfully!");
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error("Failed to add address");
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete("/addresses/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { addressId },
      });
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
      toast.error("Failed to delete address");
    }
  };

  const createOrder = async () => {
    try {
      const orderData = {
        laundryId: cart.laundry._id,
        categories: cart.categories,
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
        notes: "",
        couponCode: appliedCoupon?.code || null,
      };

      const res = await axiosInstance.post("/createorder", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error("Error creating order:", err);
      throw new Error("Failed to create order");
    }
  };

  const handleRazorpayPayment = async (orderData) => {
    const { order, razorpayOrder } = orderData;
    
    const options = {
      key: "rzp_test_GcYeDXpTqSAVpK",
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "LaundryApp",
      description: `Order #${order.orderNumber}`,
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          setProcessingPayment(true);
          
          const verifyRes = await axiosInstance.post(
            "/verifypayment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order._id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (verifyRes.data.success) {
            toast.success("Payment successful!");
            navigate("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
        } finally {
          setProcessingPayment(false);
        }
      },
      prefill: {
        name: addresses.find(addr => addr._id === selectedAddressId)?.name || "",
        email: "",
        contact: addresses.find(addr => addr._id === selectedAddressId)?.phone || "",
      },
      theme: {
        color: "#4F46E5",
      },
      modal: {
        ondismiss: function() {
          setProcessingPayment(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleCODOrder = async (orderData) => {
    try {
      toast.success("Order placed successfully with Cash on Delivery!");
      navigate("/orders");
    } catch (error) {
      console.error("COD order error:", error);
      toast.error("Failed to place COD order");
    }
  };

  const handleProceedToPay = async () => {
    if (!selectedAddressId) {
      toast.warning("Please select an address to proceed");
      return;
    }

    if (!cart?.laundry._id) {
      toast.warning("Cart is missing laundry information. Please go back to cart.");
      return;
    }

    try {
      setProcessingPayment(true);
      
      const orderData = await createOrder();
      
      if (paymentMethod === "Razorpay") {
        await handleRazorpayPayment(orderData);
      } else if (paymentMethod === "COD") {
        await handleCODOrder(orderData);
      }
      
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error(err.message || "Failed to process payment");
      setProcessingPayment(false);
    }
  };

  const getTotalItems = () => {
    if (!cart?.categories) return 0;
    return cart.categories.reduce(
      (total, category) =>
        total +
        category.products.reduce(
          (catTotal, product) => catTotal + product.quantity,
          0
        ),
      0
    );
  };

  const subtotal = cart?.totalPrice || 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <BackAlert/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address Selection & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    if (!showAddForm) reset(); // Reset form when opening
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {showAddForm ? "Cancel" : "+ Add Address"}
                </button>
              </div>

              {showAddForm && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Add New Address
                  </h3>
                  <form onSubmit={handleSubmit(onSubmitAddress)} className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        {...register("name", { 
                          required: "Full name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters"
                          }
                        })}
                        type="text"
                        placeholder="Full Name *"
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Please enter a valid 10-digit phone number"
                          }
                        })}
                        type="tel"
                        placeholder="Phone Number *"
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <input
                        {...register("line1", {
                          required: "Address line 1 is required",
                          minLength: {
                            value: 5,
                            message: "Address must be at least 5 characters"
                          }
                        })}
                        type="text"
                        placeholder="Address Line 1 *"
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.line1 ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.line1 && (
                        <p className="mt-1 text-xs text-red-600">{errors.line1.message}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <input
                        {...register("line2")}
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <input
                        {...register("city", {
                          required: "City is required",
                          minLength: {
                            value: 2,
                            message: "City name must be at least 2 characters"
                          }
                        })}
                        type="text"
                        placeholder="City *"
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register("state", {
                          required: "State is required",
                          minLength: {
                            value: 2,
                            message: "State name must be at least 2 characters"
                          }
                        })}
                        type="text"
                        placeholder="State *"
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register("zip", {
                          required: "ZIP code is required",
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: "Please enter a valid 6-digit ZIP code"
                          }
                        })}
                        type="text"
                        placeholder="ZIP Code *"
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.zip ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.zip && (
                        <p className="mt-1 text-xs text-red-600">{errors.zip.message}</p>
                      )}
                    </div>

                    <div>
                      <select
                        {...register("type", { required: "Address type is required" })}
                        className={`block w-full px-3 py-2 border rounded-md text-sm ${
                          errors.type ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="HOME">Home</option>
                        <option value="WORK">Work</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {errors.type && (
                        <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
                      )}
                    </div>

                    <div className="col-span-2 flex gap-3 mt-4">
                      <button
                        type="submit"
                        disabled={addingAddress}
                        className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-medium disabled:bg-gray-400"
                      >
                        {addingAddress ? "Saving..." : "Save Address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          reset();
                        }}
                        className="py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No addresses found. Please add a new address.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`relative border rounded-lg p-4 cursor-pointer ${
                          selectedAddressId === address._id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                            className="mt-1 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {address.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {address.phone}
                                </p>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {address.type}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {address.line1}
                              {address.line2 && `, ${address.line2}`}
                              <br />
                              {address.city}, {address.state} - {address.zip}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address._id);
                              }}
                              className="mt-2 text-xs text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "Razorpay"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Razorpay"}
                        onChange={() => setPaymentMethod("Razorpay")}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Online Payment (Razorpay)
                        </p>
                        <p className="text-xs text-gray-500">
                          Pay securely with UPI, Cards, Net Banking, Wallets
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "COD"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-500">
                          Pay when your laundry is delivered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm sticky top-8">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {cart ? (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Items ({getTotalItems()})
                      </span>
                      <span className="font-medium">₹{couponDiscount ? subtotal + couponDiscount : subtotal}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      {cart.categories.map((c) => (
                        <div key={c._id}>
                          <span className="font-medium">
                            {c.categoryName}:
                          </span>{" "}
                          {c.products
                            .map((p) => `${p.name} (${p.quantity})`)
                            .join(", ")}
                        </div>
                      ))}
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm mb-2 text-green-600">
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}
                    
                    <div className="border-t mt-4 pt-4 flex justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500">empty cart...</p>
                )}
              </div>

              {/* Coupon Section */}
              <div className="p-6 border-t bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Apply Coupon</h3>
                
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:bg-gray-400"
                      >
                        {applyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-green-600">
                        You saved ₹{couponDiscount}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <button
                  onClick={handleProceedToPay}
                  disabled={!selectedAddressId || !cart || processingPayment}
                  className="w-full bg-indigo-600 rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {processingPayment
                    ? "Processing Payment..."
                    : !selectedAddressId
                    ? "Select Address"
                    : `Pay ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;