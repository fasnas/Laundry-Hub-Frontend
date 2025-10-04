import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../utils/AxiosInstance';

const LaundryChat = () => {
  const [socket, setSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  console.log(selectedRoom)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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

    // Fetch all chat rooms
    fetchChatRooms();

    return () => newSocket.close();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const res = await axiosInstance.get('/laundrychats');
      setChatRooms(res.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleRoomClick = async (room) => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Leave previous room
      if (selectedRoom && socket) {
        socket.emit('leaveRoom', selectedRoom._id);
      }

      setSelectedRoom(room);

      // Join room via socket
      if (socket) {
        socket.emit('joinRoom', room._id);
      }

      // Fetch messages for this room
      const messagesRes = await axiosInstance.get(`/messages/${room._id}`);
      setMessages(messagesRes.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error opening chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const messageData = {
      chatRoomId: selectedRoom._id,
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

  const getChatTitle = (room) => {
    // Display user name and laundry name
    const userName = room?.username|| 'User';
    const laundryName ='Admin';
    return `${userName} ↔ ${laundryName}`;
  };

  const getChatSubtitle = (room) => {
    return `${room.userId?.email || ''} • ${room.laundryId?.email || ''}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with All Chat Rooms */}
      <div className={`${selectedRoom ? 'hidden lg:block' : 'block'} w-full lg:w-96 bg-white border-r flex flex-col`}>
        <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-600">
          <h1 className="text-xl font-bold text-white mt-2">Admin Chat Panel</h1>
          <p className="text-sm text-purple-100 mt-1">Monitor all conversations</p>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* All Chat Rooms List */}
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No active chats yet</p>
              <p className="text-sm mt-2">Chats will appear here when users start conversations</p>
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room._id}
                onClick={() => handleRoomClick(room)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedRoom?._id === room._id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex -space-x-2">
                    {/* User Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
                      {room.userId?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {/* Laundry Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
                      {room.laundryId?.name?.charAt(0).toUpperCase() || 'L'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{getChatTitle(room)}</h3>
                    <p className="text-xs text-gray-500 truncate">{getChatSubtitle(room)}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {room.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b p-4 flex items-center space-x-3 shadow-sm">
            <button
              onClick={handleBackClick}
              className="lg:hidden hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex -space-x-2">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {selectedRoom.userId?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {/* Laundry Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {selectedRoom.laundryId?.name?.charAt(0).toUpperCase() || 'L'}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">{getChatTitle(selectedRoom)}</h2>
              <p className="text-xs text-gray-500">{getChatSubtitle(selectedRoom)}</p>
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
              Admin View
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-400">No messages in this conversation</p>
                  <p className="text-sm text-gray-300 mt-1">Messages will appear here</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.senderType === 'user';
                const isLaundry = msg.senderType === 'laundry';
                const isAdmin = msg.senderType === 'admin';
                
                return (
                  <div key={msg._id} className={`flex ${isAdmin ? 'justify-center' : isUser ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex flex-col max-w-xs">
                      {/* Sender Label */}
                      {!isAdmin && (
                        <span className={`text-xs font-medium mb-1 ${
                          isUser ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {isUser ? selectedRoom.userId?.name || 'User' : selectedRoom.laundryId?.name || 'Laundry'}
                        </span>
                      )}
                      <div className={`px-4 py-2 rounded-lg shadow-sm ${
                        isAdmin
                          ? 'bg-purple-500 text-white rounded-lg'
                          : isUser 
                            ? 'bg-blue-500 text-white rounded-bl-none' 
                            : 'bg-green-500 text-white rounded-br-none'
                      }`}>
                        <p className="break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          isAdmin ? 'text-purple-100' : isUser ? 'text-blue-100' : 'text-green-100'
                        }`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t p-4 shadow-lg">
            <div className="mb-2 text-xs text-purple-600 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Sending as Admin
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message as admin..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-12 h-12 text-purple-500" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Select a conversation to monitor</p>
            <p className="text-gray-400 text-sm mt-2">View and participate in user-laundry chats</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryChat;