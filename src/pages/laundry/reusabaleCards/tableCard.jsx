import React from "react";

// Badge component
// const Badge: React.FC<{ status: "Delivered" | "Pending" | "Canceled" }> = ({ status }) => {
//   let colorClass = "bg-green-100 text-green-800";
//   if (status === "Pending") colorClass = "bg-yellow-100 text-yellow-800";
//   if (status === "Canceled") colorClass = "bg-red-100 text-red-800";

//   return (
//     <span className={`px-3 py-1 rounded-full font-medium text-sm ${colorClass}`}>
//       {status}
//     </span>
//   );
// };

// Sample order data
const orders = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    category: "Laptop",
    price: "$2399.00",
    status: "Delivered",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: "1 Variant",
    category: "Watch",
    price: "$879.00",
    status: "Pending",
    image: "/images/product/product-02.jpg",
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    category: "SmartPhone",
    price: "$1869.00",
    status: "Delivered",
    image: "/images/product/product-03.jpg",
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    category: "Electronics",
    price: "$1699.00",
    status: "Canceled",
    image: "/images/product/product-04.jpg",
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    category: "Accessories",
    price: "$240.00",
    status: "Delivered",
    image: "/images/product/product-05.jpg",
  },
];

export default function RecentOrdersCard() {
  return (
    <div className=" flex-1/2 w-[80vh] mx-auto p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Filter
          </button>
          <button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            See all
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4">
              <img
                src={order.image}
                alt={order.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{order.name}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400">{order.variants}</p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">{order.price}</p>
            <p className="text-gray-700 dark:text-gray-300">{order.category}</p>
            {/* <Badge status={order.status as "Delivered" | "Pending" | "Canceled"} /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
