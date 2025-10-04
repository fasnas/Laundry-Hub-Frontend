import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { toast } from "sonner";

const CouponListingPage = () => {
  const [laundries, setLaundries] = useState([]);
  const [selectedLaundry, setSelectedLaundry] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  useEffect(() => {
    fetchLaundries();
  }, []);

  const fetchLaundries = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getall-laundry");
      setLaundries(res.data.laundries || []);
    } catch (error) {
      console.error("Error fetching laundries:", error);
      toast.error("Failed to load laundries");
    } finally {
      setLoading(false);
    }
  };

  // ✅ expects a laundry object (not just id)
  const fetchLaundryCoupons = async (laundry) => {
    try {
      setLoadingCoupons(true);
      console.log("Posting payload:", { laundryId: laundry._id });
      const res = await axiosInstance.post("/laundrywisecoupon", {
        laundryId: laundry._id,
      });
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
      setCoupons([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // ✅ pass the whole object to fetchLaundryCoupons
  const handleLaundrySelect = (laundry) => {
    setSelectedLaundry(laundry);
    fetchLaundryCoupons(laundry);
  };


  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading laundries...</div>
      </div>
    );
  }
  console.log(coupons)
  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-17">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Coupons</h1>
          <p className="text-gray-600 mt-2">Find the best deals from your favorite laundries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Laundry List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Select Laundry</h2>
              </div>
              <div className="max-h-96 overflow-y-auto p-4">
                {laundries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-4">🏪</div>
                    <p>No laundries available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {laundries.map((laundry) => (
                      <div
                        key={laundry._id}
                        onClick={() => handleLaundrySelect(laundry)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedLaundry?._id === laundry._id
                            ? "bg-blue-50 border-2 border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <h3 className="font-medium text-gray-900">{laundry.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{laundry.address}</p>
                        {laundry.email && (
                          <p className="text-xs text-gray-400 mt-1">{laundry.email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Coupons Display */}
          <div className="lg:col-span-2">
            {!selectedLaundry ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-6xl text-gray-300 mb-4">🎟️</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Laundry</h3>
                <p className="text-gray-500">
                  Choose a laundry from the list to view available coupons
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedLaundry.name}
                      </h2>
                      <p className="text-gray-600">{selectedLaundry.address}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLaundry(null);
                        setCoupons([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Available Coupons ({coupons.length})
                    </h3>
                  </div>

                  {loadingCoupons ? (
                    <div className="p-12 text-center">
                      <div className="animate-pulse text-lg">Loading coupons...</div>
                    </div>
                  ) : coupons.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-4xl text-gray-300 mb-4">🎫</div>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        No Coupons Available
                      </h4>
                      <p className="text-gray-500">
                        This laundry doesn't have any active coupons at the moment
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 space-y-4">
                      {coupons.map((coupon) => (
                        <div
                          key={coupon._id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                                {coupon.code}
                              </div>
                            
                            </div>
                            <button
                              onClick={() => copyCouponCode(coupon.code)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Copy Code
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Save ₹{coupon.discountValue}
                              </h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Minimum Order:</span> ₹{coupon.minOrderAmount}
                                </p>
                                <p>
                                  <span className="font-medium">Usage Limit:</span> {coupon.perUserLimit} 
                                </p>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Validity</h5>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Expires:</span> {formatDate(coupon.expiresAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponListingPage;
