import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, ArrowLeft, Sparkle, MessageCircle } from 'lucide-react';
import axiosInstance from '../utils/AxiosInstance';

const UserChat = () => {
  const [socket, setSocket] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  console.log(selectedRoom)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [laundrys, setLaundrys] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Fetch all laundries
    fetchLaundrys();

    return () => newSocket.close();
  }, []);

  const fetchLaundrys = async () => {
    try {
      const res = await axiosInstance.get("/getall-laundry");
      setLaundrys(res.data.laundries);
    } catch (error) {
      console.error('Error fetching laundries:', error);
    }
  };

  const handleLaundryClick = async (laundry) => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Create or get chat room
      const res = await axiosInstance.post('/createroom', {
        laundryId: laundry._id
      });

      const room = res.data._id;
      setSelectedRoom(room);

      // Join room via socket
      if (socket) {
        socket.emit('joinRoom', room);
      }

      // Fetch messages for this room
      const messagesRes = await axiosInstance.get(`/messages/${room}`);
      setMessages(messagesRes.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error creating/opening chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const messageData = {
      chatRoomId: selectedRoom,
      message: newMessage.trim()
    };

    try {
      const res = await axiosInstance.post('/sendmessage', messageData);

      // Emit via socket
      if (socket) {
        socket.emit('sendMessage', res.data);
      }

      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBackClick = () => {
    // Leave room via socket
    if (selectedRoom && socket) {
      socket.emit('leaveRoom', selectedRoom._id);
    }
    setSelectedRoom(null);
    setMessages([]);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  console.log(selectedRoom,"mama")
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with All Laundries */}
      <div className={`${selectedRoom ? 'hidden lg:block' : 'block'} w-full lg:w-80 bg-white border-r flex flex-col`}>
        <div className="p-4 border-b bg-gradient-to-r from-white to-gray-700">
          <h1 className="text-xl font-bold mt-5">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Select a laundry to start chatting</p>
        </div>

        <div className="overflow-y-auto flex-1" >
          {/* All Laundries List */}
          {laundrys.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Loading laundries...</div>
          ) : (
            laundrys.map((laundry) => (
              <div
                key={laundry._id}
                onClick={() => handleLaundryClick(laundry)}
                className="p-4 border-b cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-blue-100 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {laundry.name?.charAt(0).toUpperCase() || 'L'}
                  </div>
                  <div  className="flex-1">
                    <h3 className="font-semibold text-gray-800">{laundry.name}</h3>
                    <p className="text-sm text-gray-500">{laundry.email || 'Tap to start chat'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col mt-8 ">
          {/* Header */}
          <div className="bg-[#4F7C82]  p-4 flex items-center space-x-3 shadow-sm ">
            <button
              onClick={handleBackClick}
              className="lg:hidden hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold ">
              {selectedRoom.laundryId?.name?.charAt(0).toUpperCase() || 'L'}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{selectedRoom.laundryId?.name || 'Laundry'}</h2>
              <p className="text-sm text-gray-500">{selectedRoom.laundryId?.email}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderType === 'user';
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                      isMe 
                        ? 'bg-green-500 text-white rounded-br-none' 
                        : 'bg-blue-500 text-white rounded-bl-none'
                    }`}>
                      <p className="break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-white' : 'text-white'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t p-4 shadow-lg ">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <MessageCircle className="w-16 h-16 text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <Sparkle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-700 text-2xl font-bold mb-2">Welcome to Messages</h3>
            <p className="text-gray-500 text-lg font-medium mb-1">Select a laundry to start messaging</p>
            <p className="text-gray-400 text-sm">Your conversations will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChat;