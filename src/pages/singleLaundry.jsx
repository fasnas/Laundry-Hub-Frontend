import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import Loader from "../components/Loader";
import CartBox from "./Cart";
import { toast } from "sonner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChildDress, faShirt, faHatCowboy, faTShirt,  faShoePrints, faHorse,faArchway, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const LaundryDetail = () => {
  const { id } = useParams(); // this is laundryId
  const [laundry, setLaundry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(null);


  // Map lowercase item names (or categories) to icons
  const iconMap = {
    dress: faChildDress,
    shirt: faShirt,
    hat: faHatCowboy,
    tshirt:faTShirt,
    sneakers:faShoePrints,
    boots:faHorse,
    pant:faArchway,
    
    // add more if needed
  };


  const token = localStorage.getItem("token");

  // 🔹 Fetch laundry info
  useEffect(() => {
    const fetchLaundryInfo = async () => {
      try {
        const res = await axiosInstance.get(`/getsinglelaundry/${id}`);
        setLaundry(res.data.laundry);

        const uniqueCategories = [
          ...new Set(res.data.laundry.items.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load laundry info:", err);
        setLoading(false);
      }
    };
    fetchLaundryInfo();
  }, [id]);

  // 🔹 Fetch cart (specific to laundryId)
  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get(`/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    fetchCart();
  }, [id, token]);

  // 🔹 Fetch items by selected category
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchCategoryItems = async () => {
      try {
        setCategoryLoading(true);
        const res = await axiosInstance.get(
          `/getsinglelaundry/${id}?category=${encodeURIComponent(
            selectedCategory
          )}`
        );
        setItems(res.data.items);
      } catch (err) {
        console.error("Error loading category items:", err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategoryItems();
  }, [id, selectedCategory]);

  // 🔹 Add item to cart
  const handleAddToCart = async (item) => {
    if (!token) {
      toast.warning("Please login to add items to cart");
      return;
    }
    try {
      setCartLoading(true);
      const res = await axiosInstance.post(
        `/cart/${id}/add`,
        {
          itemId: item._id,
          itemName: item.name,
          itemPrice: item.price,
          itemCategory: item.category,
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding item to cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // 🔹 Remove item from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      setCartLoading(true);
      const res = await axiosInstance.delete(
        `/cart/${id}/remove`,
        {
          data: { productId }, // delete requests send body like this
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Error removing item from cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // 🔹 Update quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      setCartLoading(true);
      const res = await axiosInstance.patch(
        `/cart/${id}/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Error updating quantity. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // 🔹 Checkout
  const handleCheckout = async () => {
    try {
      setCartLoading(true);
      const res = await axiosInstance.post(
        `/cart/${id}/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Checkout successful! Total: ₹${res.data.totalAmount}`);
      setCart(null);
    } catch (err) {
      console.error("Error during checkout:", err);
      toast.error("Error during checkout. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // 🔹 Clear cart
  const handleClearCart = async () => {
    if (toast.warning("Are you sure you want to clear your cart?")) {
      try {
        setCartLoading(true);
        await axiosInstance.delete(`/cart/${id}/clear`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(null);
        toast.success("Cart cleared successfully!");
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error("Error clearing cart. Please try again.");
      } finally {
        setCartLoading(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (!laundry)
    return (
      <div className="text-center mt-20 text-red-500">
        Laundry not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <img
          src={laundry.profileImage}
          alt={laundry.name}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
        <h1 className="text-4xl font-bold mt-6 text-blue-800">{laundry.name}</h1>
        <p className="mt-4 text-gray-700 text-lg">{laundry.description}</p>

        {/* Categories */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            🧺 Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                  } transition`}
              >
                {category}
              </button>
            ))}
          </div>

          {categoryLoading ? (
            <Loader />
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="relative p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <button
                    title="Add to Cart"
                    onClick={() => handleAddToCart(item)}
                    disabled={cartLoading || !token}
                    className="absolute top-2 right-2 text-blue-900 hover:text-blue-700 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <h3 className="text-lg font-bold text-blue-700">{item.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    Category: {item.category}
                  </p>
                  <p className="text-sm text-gray-800 font-medium mt-1">
                    Price: ₹{item.price}
                  </p>
                  <FontAwesomeIcon
                    icon={iconMap[item.name?.toLowerCase()] || faQuestionCircle} // fallback icon
                    className="absolute bottom-2 right-2 text-blue-900 hover:text-blue-700 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in this category.</p>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartBox
        cart={cart}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        loading={cartLoading}
      />
    </div>
  );
};

export default LaundryDetail;
