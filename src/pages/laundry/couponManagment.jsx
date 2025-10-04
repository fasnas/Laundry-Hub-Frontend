import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { toast } from "sonner";

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [formData, setFormData] = useState({
        code: "",
        discountValue: "",
        minOrderAmount: "",
        totalQuantity: "",
        perUserLimit: "1",
        startsAt: "",
        expiresAt: "",
        isActive: true,
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/getcoupon");
            setCoupons(res.data.couponList || []);
        } catch (error) {
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(formData.expiresAt) <= new Date()) {
            return toast.error("Expiry date must be in the future");
        }

        try {
            const payload = {
                ...formData,
                code: formData.code.toUpperCase(),
                discountValue: Number(formData.discountValue),
                minOrderAmount: Number(formData.minOrderAmount) || 0,
                totalQuantity: Number(formData.totalQuantity),
                perUserLimit: Number(formData.perUserLimit),
            };

            if (editingCoupon) {
                await axiosInstance.put(`/updatecoupon/${editingCoupon._id}`, payload);
                toast.success("Coupon updated successfully!");
            } else {
                await axiosInstance.post("/addcoupon", payload);
                toast.success("Coupon created successfully!");
            }

            resetForm();
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save coupon");
        }
    };

    const resetForm = () => {
        setFormData({
            code: "",
            discountValue: "",
            minOrderAmount: "",
            totalQuantity: "",
            perUserLimit: "1",
            startsAt: "",
            expiresAt: "",
            isActive: true,
        });
        setShowForm(false);
        setEditingCoupon(null);
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountValue: coupon.discountValue.toString(),
            minOrderAmount: coupon.minOrderAmount.toString(),
            totalQuantity: coupon.totalQuantity.toString(),
            perUserLimit: coupon.perUserLimit.toString(),
            startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : "",
            expiresAt: new Date(coupon.expiresAt).toISOString().slice(0, 16),
            isActive: coupon.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (couponId) => {
     {
            try {
                await axiosInstance.delete("/deletecoupon", {
                    data: { couponId }
                });
                toast.success("Coupon deleted successfully!");
                fetchCoupons();
            } catch (error) {
                toast.error("Failed to delete coupon");
            }
        }
    };

    const toggleStatus = async (couponId, currentStatus) => {
        try {
            await axiosInstance.patch("/togglecoupon", {   
                couponId,                                     
                isActive: !currentStatus,
            });
            toast.success(`Coupon ${!currentStatus ? "enabled" : "disabled"}!`);
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to update coupon status");
        }
    };


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const getStatusBadge = (coupon) => {
        const now = new Date();
        const expiryDate = new Date(coupon.expiresAt);

        if (!coupon.isActive) {
            return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Disabled</span>;
        }
        if (expiryDate < now) {
            return <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-700">Expired</span>;
        }
        if (coupon.usedCount >= coupon.totalQuantity) {
            return <span className="px-2 py-1 text-xs rounded-full bg-orange-200 text-orange-700">Used Up</span>;
        }
        return <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-700">Active</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-lg">Loading coupons...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
                            <p className="text-gray-600">Create and manage discount coupons</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {showForm ? "Cancel" : "Add Coupon"}
                        </button>
                    </div>
                </div>

                {/* Coupon Form */}
                {showForm && (
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coupon Code *
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    placeholder="e.g., SAVE20"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 uppercase"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Value (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleInputChange}
                                    placeholder="50"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Order Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="minOrderAmount"
                                    value={formData.minOrderAmount}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="totalQuantity"
                                    value={formData.totalQuantity}
                                    onChange={handleInputChange}
                                    placeholder="100"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Per User Limit *
                                </label>
                                <input
                                    type="number"
                                    name="perUserLimit"
                                    value={formData.perUserLimit}
                                    onChange={handleInputChange}
                                    placeholder="1"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startsAt"
                                    value={formData.startsAt}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="expiresAt"
                                    value={formData.expiresAt}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Active
                                </label>
                            </div>

                            <div className="lg:col-span-3 flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                >
                                    {editingCoupon ? "Update Coupon" : "Create Coupon"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Coupons List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">
                            Coupons ({coupons.length})
                        </h2>
                    </div>

                    {coupons.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl text-gray-400 mb-4">🎟️</div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No coupons found</h3>
                            <p className="text-gray-500">Create your first coupon to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                                                {coupon.minOrderAmount > 0 && (
                                                    <div className="text-xs text-gray-500">Min: ₹{coupon.minOrderAmount}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">₹{coupon.discountValue}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {coupon.usedCount} / {coupon.totalQuantity}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Limit: {coupon.perUserLimit} per user
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500">
                                                    {coupon.startsAt && (
                                                        <div>Start: {new Date(coupon.startsAt).toLocaleDateString()}</div>
                                                    )}
                                                    <div>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(coupon)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(coupon)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                                                        className={`text-sm ${coupon.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                                                            }`}
                                                    >
                                                        {coupon.isActive ? "Disable" : "Enable"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon._id)}
                                                        className="text-red-600 hover:text-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponManagement;