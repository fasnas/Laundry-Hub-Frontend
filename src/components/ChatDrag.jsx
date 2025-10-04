import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { io } from 'socket.io-client';


export default function DraggableChatButton() {
  const [pos, setPos] = useState({ x: 1170, y: 520 });
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
   
  ]);


useEffect(()=>{
   io('http://localhost:5000');
},[])
 


const dragRef = useRef(null);
const dragging = useRef(false);
const offset = useRef({ x: 0, y: 0 });

useEffect(() => {
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };
  const onMouseUp = () => (dragging.current = false);

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}, []);

const startDrag = (e) => {
  dragging.current = true;
  const rect = dragRef.current.getBoundingClientRect();
  offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const markAllAsRead = () => {
  setNotifications([]); // clear all
  setOpen(false); // optional: close modal after clearing
};

return (
  <>
    {/* Floating draggable button */}
    <div
      ref={dragRef}
      onMouseDown={startDrag}
      onClick={() => setOpen(true)}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        cursor: "grab",
        zIndex: 1000,
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center relative"
    >
      <MessageCircle size={24} />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
          {notifications.length}
        </span>
      )}
    </div>

    {/* Notification Modal */}
    {open && (
      <div className="fixed bottom-20 right-10 bg-white shadow-xl rounded-lg p-4 w-72 border border-gray-300 z-[2000]">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h2 className="font-semibold text-gray-700">Notifications</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-2 text-sm text-gray-600 max-h-48 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n, idx) => <p key={idx}>{n}</p>)
          ) : (
            <p className="text-gray-400 italic">No notifications</p>
          )}
        </div>

        {/* Mark All As Read */}
        {notifications.length > 0 && (
          <div className="border-t mt-3 pt-2 text-right">
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    )}
  </>
);
}
