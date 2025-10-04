import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

const LaundryItemForm = () => {
  const [item, setItem] = useState({ category: '', name: '', price: '' });
  const [itemsList, setItemsList] = useState([]);
  const [existingItems, setExistingItems] = useState({});
  const [showForm, setShowForm] = useState(false);

  const categories = ['wash+fold', 'wash+iron', 'steamiron', 'dryclean', 'shoeclean'];

  const groupByCategory = (items) => {
    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    if (!item.category || !item.name || !item.price) {
      toast.warning('All fields are required');
      return;
    }
    setItemsList((prev) => [...prev, item]);
    setItem({ category: '', name: '', price: '' });
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/itemupdate', { items: itemsList });
      toast.success('Items added successfully!');
      setItemsList([]);
      await fetchExistingItems();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error('Failed to update items');
    }
  };

  const fetchExistingItems = async () => {
    try {
      const res = await axiosInstance.get('/getitems');
      const grouped = groupByCategory(res.data.items || []);
      setExistingItems(grouped);
    } catch (err) {
      console.error('Error fetching existing items:', err);
    }
  };

  useEffect(() => {
    fetchExistingItems();
  }, []);


  const deleteProduct = async (id) => {
    try {
      await axiosInstance.delete("/deleteitems", {
        data: { deleteid: id },
      });
      fetchExistingItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };


  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medium text-black-400">Laundry Service Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add New Item
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select
                  name="category"
                  value={item.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="e.g. Shirt"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddItem}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                ✅ Add to List
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pending Items List */}
        {itemsList.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📝 Items to Submit</h2>
            <ul className="space-y-2">
              {itemsList.map((it, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 border-b last:border-none"
                >
                  <span className="text-gray-700">
                    {it.name} — <span className="capitalize">{it.category}</span> — ₹{it.price}
                  </span>

                  <button
                    onClick={() =>
                      setItemsList(prev => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}

            </ul>
            <button

              onClick={handleSubmit}
              className="mt-4 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
            >
              📤 Submit All Items
            </button>
          </div>
        )}

        {/* Existing Items Display */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(existingItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow p-5">
              <h3 className="text-xl font-bold text-gray-700 capitalize mb-4">
                📦 {category}
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded hover:shadow transition"
                  >
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-blue-600 font-semibold">₹{item.price}</span>
                    <button onClick={() => deleteProduct(item._id)}><FaTrash size={10} /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaundryItemForm;
