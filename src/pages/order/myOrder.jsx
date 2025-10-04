// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../utils/AxiosInstance";
// import Loader from "../../components/Loader";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   console.log(orders)
//   const [trackingOrderId, setTrackingOrderId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("/getorders");
//       setOrders(res.data.orders);
//       console.log("Orders data:", res.data.orders);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Failed to fetch orders");
//       setLoading(false);
//     }
//   };

//   // Calculate total items in an order
//   const getTotalItems = (categories) => {
//     return categories.reduce((total, category) => {
//       return (
//         total +
//         category.products.reduce(
//           (catTotal, product) => catTotal + product.quantity,
//           0
//         )
//       );
//     }, 0);
//   };

//   if (loading) {
//     return (
//       <div className="p-20 bg-gray-50 text-center">
//         <div className="animate-pulse">Loading your orders...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-20 bg-gray-50 text-center">
//         <div className="text-red-600">{error}</div>
//         <button
//           onClick={fetchOrders}
//           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 md:p-20 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>

//         {orders.length === 0 ? (
//           <div className="bg-white shadow rounded-lg p-12 text-center">
//             <div className="text-gray-400 text-6xl mb-4">📦</div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No orders found
//             </h3>
//             <p className="text-gray-500">
//               You haven't placed any orders yet.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden"
//               >
//                 {/* Order Header */}
//                 <div className="bg-gray-50 px-6 py-4 border-b">
//                   <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//                     <div>
//                       <p className="text-sm text-gray-600">Order ID</p>
//                       <p className="font-mono text-sm font-semibold text-gray-800">
//                         {order._id}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Order Date</p>
//                       <p className="font-semibold text-gray-800">
//                         {new Date(order.createdAt).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="px-3 py-1 rounded-full text-sm font-medium text-green-700">
//                         {order.payment.razorpayPaymentId ? "Paid" : "Cash On Pickup"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Content */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {/* Items Section */}
//                     <div>
//                       <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
//                         🧺 Items ({getTotalItems(order.categories)} total)
//                       </h4>

//                       <div className="space-y-4">
//                         {order.categories.map((category) => (
//                           <div
//                             key={category._id}
//                             className="border rounded-lg p-4 bg-gray-50"
//                           >
//                             <h5 className="font-semibold text-blue-700 capitalize mb-3">
//                               {category.categoryName}
//                             </h5>

//                             <div className="space-y-2">
//                               {category.products.map((product) => (
//                                 <div
//                                   key={product._id}
//                                   className="flex justify-between items-center text-sm"
//                                 >
//                                   <div className="flex-1">
//                                     <span className="font-medium text-gray-800">
//                                       {product.name}
//                                     </span>
//                                   </div>
//                                   <div className="flex items-center gap-4">
//                                     <span className="text-gray-600">
//                                       Qty: {product.quantity}
//                                     </span>
//                                     <span className="font-semibold text-gray-800">
//                                       ₹{product.price}
//                                     </span>
//                                     <span className="font-semibold text-blue-600">
//                                       ₹{(product.price * product.quantity).toFixed(
//                                         2
//                                       )}
//                                     </span>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="mt-4 pt-4 border-t">
//                         <div className="flex justify-between items-center">
//                           <span className="text-lg font-semibold text-gray-800">
//                             Total Amount:
//                           </span>
//                           <span className="text-xl font-bold text-green-600">
//                             ₹{order.totalPrice}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Address & Laundry Info */}
//                     <div>
//                       <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
//                         📍 Pickup & Delivery Info
//                       </h4>

//                       {/* Delivery Address - Fixed to use addressDetails */}
//                       <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                         <div className="text-sm text-gray-600 mb-2">
//                           Adress
//                         </div>
//                         {!order.addressDetails ? (
//                           <div className="text-gray-500 text-sm">
//                             Address ID: {order.address}
//                             <br />
//                             <span className="text-xs">
//                               (Address details not available)
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="text-gray-800">
//                             <p className="font-medium">{order.addressDetails.name}</p>
//                             <p className="text-sm text-gray-600">{order.addressDetails.phone}</p>
//                             <p>{order.addressDetails.line1}</p>
//                             {order.addressDetails.line2 && (
//                               <p>{order.addressDetails.line2}</p>
//                             )}
//                             <p>
//                               {order.addressDetails.city}, {order.addressDetails.state} -{" "}
//                               {order.addressDetails.zip}
//                             </p>
//                             <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
//                               {order.addressDetails.type}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Laundry Info - Fixed to use proper laundry data */}
//                       {order.laundry && (
//                         <div className="bg-green-50 rounded-lg p-4 mb-4">
//                           <h5 className="text-sm font-semibold text-green-700 mb-1">
//                             🏬 Laundry Service
//                           </h5>
//                           <p className="text-gray-800 font-medium">{order.laundry.name}</p>
//                         </div>
//                       )}


//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
//                     <button
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                       onClick={() =>
//                         setTrackingOrderId((prev) =>
//                           prev === order._id ? null : order._id
//                         )
//                       }
//                     >
//                       {trackingOrderId === order._id
//                         ? "Hide Tracking"
//                         : "Track Order"}
//                     </button>
//                   </div>

//                   {/* Tracking Details - Updated status flow */}
//                   {trackingOrderId === order._id && (
//                     <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
//                       <h4 className="font-semibold mb-3 text-blue-800 flex items-center">
//                         🚚 Tracking Details
//                       </h4>

//                       <div className="mt-3 p-3 bg-white rounded border">
//                         <p className="text-sm font-medium text-gray-800">
//                           Current Status:{" "}
//                           <span className="text-blue-600">{order.status}</span>
//                         </p>
//                         <p className="text-xs text-gray-600 mt-1">
//                           Last Updated:{" "}
//                           {new Date(order.updatedAt).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrders;

//below component have pagination included in frontend 

import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import Loader from "../../components/Loader";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getorders");
      setOrders(res.data.orders);
      console.log("Orders data:", res.data.orders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  // Calculate total items in an order
  const getTotalItems = (categories) => {
    return categories.reduce((total, category) => {
      return (
        total +
        category.products.reduce(
          (catTotal, product) => catTotal + product.quantity,
          0
        )
      );
    }, 0);
  };

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTrackingOrderId(null); // Close any open tracking when changing pages
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="p-20 bg-gray-50 text-center">
        <div className="animate-pulse h-140">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20 bg-gray-50 text-center">
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
          {orders.length > 0 && (
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length} orders
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-6">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-800">
                          {order._id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium text-green-700">
                          {order.payment.razorpayPaymentId ? "Paid" : "Cash On Pickup"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Items Section */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          🧺 Items ({getTotalItems(order.categories)} total)
                        </h4>

                        <div className="space-y-4">
                          {order.categories.map((category) => (
                            <div
                              key={category._id}
                              className="border rounded-lg p-4 bg-gray-50"
                            >
                              <h5 className="font-semibold text-blue-700 capitalize mb-3">
                                {category.categoryName}
                              </h5>

                              <div className="space-y-2">
                                {category.products.map((product) => (
                                  <div
                                    key={product._id}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-800">
                                        {product.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-gray-600">
                                        Qty: {product.quantity}
                                      </span>
                                      <span className="font-semibold text-gray-800">
                                        ₹{product.price}
                                      </span>
                                      <span className="font-semibold text-blue-600">
                                        ₹{(product.price * product.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">
                              Total Amount:
                            </span>
                            <span className="text-xl font-bold text-green-600">
                              ₹{order.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Address & Laundry Info */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          📍 Pickup & Delivery Info
                        </h4>

                        {/* Delivery Address */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="text-sm text-gray-600 mb-2">
                            Address
                          </div>
                          {!order.addressDetails ? (
                            <div className="text-gray-500 text-sm">
                              Address ID: {order.address}
                              <br />
                              <span className="text-xs">
                                (Address details not available)
                              </span>
                            </div>
                          ) : (
                            <div className="text-gray-800">
                              <p className="font-medium">{order.addressDetails.name}</p>
                              <p className="text-sm text-gray-600">{order.addressDetails.phone}</p>
                              <p>{order.addressDetails.line1}</p>
                              {order.addressDetails.line2 && (
                                <p>{order.addressDetails.line2}</p>
                              )}
                              <p>
                                {order.addressDetails.city}, {order.addressDetails.state} -{" "}
                                {order.addressDetails.zip}
                              </p>
                              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {order.addressDetails.type}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Laundry Info */}
                        {order.laundry && (
                          <div className="bg-green-50 rounded-lg p-4 mb-4">
                            <h5 className="text-sm font-semibold text-green-700 mb-1">
                              🏬 Laundry Service
                            </h5>
                            <p className="text-gray-800 font-medium">{order.laundry.name}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() =>
                          setTrackingOrderId((prev) =>
                            prev === order._id ? null : order._id
                          )
                        }
                      >
                        {trackingOrderId === order._id
                          ? "Hide Tracking"
                          : "Track Order"}
                      </button>
                    </div>

                    {/* Tracking Details */}
                    {trackingOrderId === order._id && (
                      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold mb-3 text-blue-800 flex items-center">
                          🚚 Tracking Details
                        </h4>

                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-800">
                            Current Status:{" "}
                            <span className="text-blue-600">{order.status}</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Last Updated:{" "}
                            {new Date(order.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {/* First page */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                      1
                    </button>
                    {getPageNumbers()[0] > 2 && (
                      <span className="px-2 py-2 text-gray-500">...</span>
                    )}
                  </>
                )}

                {/* Page numbers */}
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Last page */}
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                      <span className="px-2 py-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;