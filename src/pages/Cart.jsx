import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartBox = ({ cart, onRemove, onUpdateQuantity, onClearCart, loading }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate=useNavigate()

  const toggleExpand = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  // If cart is null or empty, show empty cart message
  if (!cart || !cart.categories || cart.categories.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4 w-full sm:w-80 sticky top-20 h-fit">
        <h2 className="text-xl font-bold mb-4 text-blue-700">🛒 Cart</h2>
        <p className="text-gray-500">No items added.</p>
      </div>
    );
  }

  function onCheckout(){
    navigate("/address")
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full sm:w-80 sticky top-20 h-fit">
      <h2 className="text-xl font-bold mb-4 text-blue-700">🛒 Cart</h2>

      <div className="space-y-4 mb-4">
        {cart.categories.map((category) => {
          const totalQuantity = category.products.reduce(
            (sum, product) => sum + product.quantity,
            0
          );

          return (
            <div key={category.categoryName} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-700 capitalize">
                  {category.categoryName} ({totalQuantity})
                </span>
                <button
                  onClick={() => toggleExpand(category.categoryName)}
                  className="text-sm text-gray-600 underline"
                >
                  {expandedCategory === category.categoryName ? "Hide" : "Show"} Details
                </button>
              </div>

              {expandedCategory === category.categoryName && (
                <div className="mt-2 text-sm bg-gray-50 p-2 rounded space-y-2">
                  {category.products.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col gap-2 p-2 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          ₹{product.price}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() =>
                              onUpdateQuantity(product._id, product.quantity - 1)
                            }
                            disabled={product.quantity === 1 || loading}
                            className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="text-xs">{product.quantity}</span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(product._id, product.quantity + 1)
                            }
                            disabled={loading}
                            className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => onRemove(product._id)}
                          disabled={loading}
                          className="text-xs text-red-500 hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        Subtotal: ₹{(product.price * product.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="font-medium text-gray-800 mb-2">
        Total: ₹{cart.totalPrice.toFixed(2)}
      </div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={onCheckout}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Checkout"}
      
        </button>
        
        <button
          onClick={onClearCart}
          disabled={loading}
          className="px-3 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
          title="Clear Cart"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartBox;
