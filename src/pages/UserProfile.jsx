import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, User, Mail, Phone, MapPin, Home, Camera, CheckCircle, AlertCircle, MoreVertical, Trash2, Plus } from 'lucide-react';
import axiosInstance from '../utils/AxiosInstance';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState(null);
  const [originalProfileData, setOriginalProfileData] = useState(null);
  const [isPersonalEditing, setIsPersonalEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    type: 'HOME'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/userprofile');
      const { user } = res.data;
      setProfileData(user);
      setOriginalProfileData(JSON.parse(JSON.stringify(user)));
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      showNotification('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => 
        i === index ? { ...addr, [field]: value } : addr
      ),
    }));
  };

  const handleNewAddressChange = (field, value) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const savePersonalInfo = async () => {
    try {
      setSaving(true);
      const updateData = {
        name: profileData.name,
        mobile: profileData.mobile,
      };
      
      await axiosInstance.put('/updateprofile', updateData);
      setOriginalProfileData(prev => ({ ...prev, ...updateData }));
      setIsPersonalEditing(false);
      showNotification('Personal information updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      showNotification('Failed to update personal information', 'error');
      setProfileData(prev => ({
        ...prev,
        name: originalProfileData.name,
        mobile: originalProfileData.mobile,
      }));
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async (index) => {
    try {
      setSaving(true);
      const addressData = profileData.addresses[index];
      
      if (addressData._id) {
        await axiosInstance.put(`/updateaddress/${addressData._id}`, addressData);
        showNotification('Address updated successfully!');
      }
      
      setOriginalProfileData(JSON.parse(JSON.stringify(profileData)));
      setEditingAddressId(null);
    } catch (err) {
      console.error('Failed to update address', err);
      showNotification('Failed to update address', 'error');
      setProfileData(originalProfileData);
    } finally {
      setSaving(false);
    }
  };

  const addNewAddress = async () => {
    try {
      setSaving(true);
      const res = await axiosInstance.post("/addresses/add", newAddress);
      fetchUserProfile()
      setProfileData(prev => ({
        ...prev,
        addresses: [...(prev.addresses || []), res.data.address]
      }));
      
      setOriginalProfileData(prev => ({
        ...prev,
        addresses: [...(prev.addresses || []), res.data.address]
      }));
      
      setIsAddingNew(false);
      setNewAddress({
        name: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        type: 'home'
      });
      showNotification('Address added successfully!');
    } catch (err) {
      console.error('Failed to add address', err);
      showNotification('Failed to add address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (addressId, index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      setSaving(true);
      await axiosInstance.delete("/addresses/delete", {
  data: { addressId: addressId }
});

      
      setProfileData(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }));
      
      setOriginalProfileData(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }));
      
      showNotification('Address deleted successfully!');
      setOpenMenuId(null);
    } catch (err) {
      console.error('Failed to delete address', err);
      showNotification('Failed to delete address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cancelPersonalEdit = () => {
    setProfileData(prev => ({
      ...prev,
      name: originalProfileData.name,
      mobile: originalProfileData.mobile,
    }));
    setIsPersonalEditing(false);
  };

  const cancelAddressEdit = (index) => {
    setProfileData(prev => ({
      ...prev,
      addresses: originalProfileData.addresses
    }));
    setEditingAddressId(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile data</p>
          <button 
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <h1 className="mt-6 text-3xl font-bold mb-8 text-gray-800">Profile</h1>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 overflow-hidden shadow-lg">
                <img
                  src="https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo="
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileData.name}</h2>
              <div className="flex items-center text-gray-600 mb-1">
                <Mail className="w-4 h-4 mr-2" />
                <span>{profileData.email}</span>
              </div>
              {profileData.mobile && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{profileData.mobile}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Active Account
            </div>
            <p className="text-sm text-gray-600">
              Member since {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <User className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
          </div>
          
          {!isPersonalEditing ? (
            <button
              onClick={() => setIsPersonalEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={cancelPersonalEdit}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={savePersonalInfo}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isPersonalEditing ? (
              <input
                type="text"
                value={profileData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-800">{profileData.name || '—'}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            {isPersonalEditing ? (
              <input
                type="tel"
                value={profileData.mobile || ''}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your mobile number"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-800">{profileData.mobile || '—'}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">{profileData.email}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Verified
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Email address cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Address Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Saved Addresses</h3>
          </div>
          
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>

        {/* Address List */}
        {!profileData.addresses || profileData.addresses.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No Address Added</h4>
            <p className="text-gray-500 mb-6">Add your address for delivery purposes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.addresses?.map((address, index) => (
              <div key={address?._id || index} className="border border-gray-200 rounded-lg p-4 relative">
                {/* 3-dot menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === address._id ? null : address._id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {openMenuId === address?._id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setEditingAddressId(address._id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                      >
                        <Edit3 className="w-3 h-3 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAddress(address._id, index)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingAddressId === address?._id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={address.name || ''}
                      onChange={(e) => handleAddressChange(index, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="tel"
                      value={address.phone || ''}
                      onChange={(e) => handleAddressChange(index, 'phone', e.target.value)}
                      placeholder="Phone"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={address.line1 || ''}
                      onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
                      placeholder="Address Line 1"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={address.line2 || ''}
                      onChange={(e) => handleAddressChange(index, 'line2', e.target.value)}
                      placeholder="Address Line 2"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={address.city || ''}
                        onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                        placeholder="City"
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={address.state || ''}
                        onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                        placeholder="State"
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={address.zip || ''}
                        onChange={(e) => handleAddressChange(index, 'zip', e.target.value)}
                        placeholder="ZIP"
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <select
                        value={address.type || 'home'}
                        onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => cancelAddressEdit(index)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveAddress(index)}
                        disabled={saving}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="pr-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{address?.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded capitalize">
                        {address?.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{address?.phone}</p>
                    <p className="text-sm text-gray-700">{address?.line1}</p>
                    {address?.line2 && <p className="text-sm text-gray-700">{address?.line2}</p>}
                    <p className="text-sm text-gray-700">
                      {address?.city}, {address?.state} - {address?.zip}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Address Form */}
        {isAddingNew && (
          <div className="mt-6 border-t pt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Add New Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newAddress.name}
                onChange={(e) => handleNewAddressChange('name', e.target.value)}
                placeholder="Contact Name"
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="tel"
                value={newAddress.phone}
                onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                placeholder="Phone Number"
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={newAddress.line1}
                onChange={(e) => handleNewAddressChange('line1', e.target.value)}
                placeholder="Address Line 1"
                className="md:col-span-2 border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={newAddress.line2}
                onChange={(e) => handleNewAddressChange('line2', e.target.value)}
                placeholder="Address Line 2"
                className="md:col-span-2 border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => handleNewAddressChange('city', e.target.value)}
                placeholder="City"
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={newAddress.state}
                onChange={(e) => handleNewAddressChange('state', e.target.value)}
                placeholder="State"
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                value={newAddress.zip}
                onChange={(e) => handleNewAddressChange('zip', e.target.value)}
                placeholder="ZIP Code"
                className="border rounded-lg px-4 py-2"
              />
              <select
                value={newAddress.type}
                onChange={(e) => handleNewAddressChange('type', e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewAddress({
                    name: '',
                    phone: '',
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    zip: '',
                    type: 'home'
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewAddress}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Address'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;