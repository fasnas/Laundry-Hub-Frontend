// components/OrdersDisplayComponent.js
import React, {  useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import Loader from "../../components/Loader";
import { toast } from "sonner";

const laundryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getlaundryorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.items);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "payment pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === "All") return true;
    return order.status === filterStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "amount-high":
        return b.totalPrice - a.totalPrice;
      case "amount-low":
        return a.totalPrice - b.totalPrice;
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTotalItems = (categories) => {
    return categories.reduce((total, category) =>
      total + category.products.reduce((catTotal, product) => catTotal + product.quantity, 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          {/* <p className="mt-4 text-gray-600">Loading orders...</p> */}
          {Loader}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View your laundry orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Orders</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Total Orders: {sortedOrders.length}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {sortedOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            sortedOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on: {formatDate(order.createdAt)}
                      </p>
                      {order.updatedAt !== order.createdAt && (
                        <p className="text-sm text-gray-500">
                          Last updated: {formatDate(order.updatedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3 lg:mt-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.paymentStatus)}`}>
                        Payment: {order.payment.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.categories.map((category) => (
                          <div key={category._id} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-800 mb-2 capitalize">
                              {category.categoryName}
                            </h5>
                            <div className="space-y-2">
                              {category.products.map((product) => (
                                <div key={product._id} className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <span className="text-gray-700 font-medium">{product.name}</span>
                                    <span className="text-gray-500 ml-2">x {product.quantity}</span>
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    ₹{product.price * product.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.notes && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-1">Order Notes</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items ({getTotalItems(order.categories)})</span>
                            <span className="font-medium">₹{order.totalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">₹30</span>
                          </div>
                          <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                            <span>Total Amount</span>
                            <span>₹{order.totalPrice + 30}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span className="font-medium capitalize">{order.payment.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">₹{order.payment.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium capitalize ${order.payment.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {order.payment.paymentStatus}
                            </span>
                          </div>
                          {order.payment.razorpayPaymentId && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-gray-500">
                                Payment ID: {order.payment.razorpayPaymentId}
                              </p>
                            </div>
                          )}
                          {order.payment.paidAt && (
                            <div>
                              <p className="text-xs text-gray-500">
                                Paid on: {formatDate(order.payment.paidAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default laundryOrders;