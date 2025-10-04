import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">ERROR</h1>
      <div className="flex items-center text-blue-600 text-[120px] font-extrabold mb-6">
        <span>4</span>
        <span className="mx-4 flex flex-col items-center justify-center border-4 border-blue-600 rounded-lg w-32 h-32 text-center">
          <span className="text-[50px] leading-[50px]">:-(</span>
        </span>
        <span>4</span>
      </div>
      <p className="text-gray-700 text-lg mb-6">
        We can’t seem to find the page you are looking for!
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 text-gray-800 font-semibold"
      >
        Back to Home Page
      </button>
    </div>
  );
}
