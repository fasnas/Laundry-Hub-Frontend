import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BackAlert() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // push one dummy entry so we can catch the first back press
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => setShowModal(true);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleStay = () => setShowModal(false);

  const handleLeave = () => {
    setShowModal(false);
    navigate(-2); // important: skip the dummy state
  };

  return (
    <div className="p-4">
      Your page content here
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Your savings are waiting…!
              <br />
              Grab your coupon from the Offer Page
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleStay}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Stay
              </button>
              <button
                onClick={handleLeave}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
