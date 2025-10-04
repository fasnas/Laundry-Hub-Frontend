// components/AdminOrdersComponent.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "sonner";
import { io } from 'socket.io-client';

const AdminOrdersManagment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(()=>{
     io('http://localhost:5000');
  },[])

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getlaundryorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.items);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axiosInstance.post(
        "/statusupdate",
        { status: newStatus ,orderid:orderId},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "Item Picked":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-orange-100 text-orange-800";
      case "Washing Completed":
        return "bg-green-100 text-green-800";
      case "Outfor Delivery":
        return "bg-gray-100 text-gray-800";
      case "Completed":
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
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Manage all laundry orders</p>
        </div>

        {/* Filters and Actions */}
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
                  <option value="picked">Item Picked</option>
                  <option value="inprogress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="outfordelivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
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
                        Created: {formatDate(order.createdAt)}
                      </p>
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
                    {/* Order Details */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.categories.map((category) => (
                          <div key={category._id} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-800 mb-2">
                              {category.categoryName}
                            </h5>
                            <div className="space-y-1">
                              {category.products.map((product) => (
                                <div key={product._id} className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {product.name} x {product.quantity}
                                  </span>
                                  <span className="font-medium">₹{product.price * product.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-1">Notes</h5>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Order Summary & Actions */}
                    <div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items ({getTotalItems(order.categories)})</span>
                            <span>₹{order.totalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span>₹30</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{order.totalPrice + 30}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Method:</span> {order.payment.paymentMethod}</p>
                          <p><span className="text-gray-600">Amount:</span> ₹{order.payment.amount}</p>
                          {order.payment.razorpayPaymentId && (
                            <p><span className="text-gray-600">Payment ID:</span> {order.payment.razorpayPaymentId}</p>
                          )}
                          {order.payment.paidAt && (
                            <p><span className="text-gray-600">Paid At:</span> {formatDate(order.payment.paidAt)}</p>
                          )}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                        <div className="flex gap-2">
                          <select
                            defaultValue={order.status}
                            onChange={(e) => {
                              if (e.target.value !== order.status) {
                                updateOrderStatus(order._id, e.target.value);
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Picked">Item Picked</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Ready">Ready</option>
                            <option value="Out For Delivery">Out for Delivery</option>
                            <option value="Completed">Completed</option>
                          </select>
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

export default AdminOrdersManagment;