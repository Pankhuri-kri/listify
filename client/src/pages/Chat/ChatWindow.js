import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { SetLoader } from '../../redux/LoadersSlice';
import { GetChatById, SendMessage } from '../../Apicalls/chats';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080');

const ChatWindow = () => {
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { chatId } = useParams();

    const [chat, setChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChat = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetChatById(chatId);
            dispatch(SetLoader(false));
            if (response.success) {
                setChat(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    useEffect(() => {
        loadChat();
        socket.emit('join-chat', chatId);

        socket.on('receive-message', (incomingMessage) => {
            setChat((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, incomingMessage],
                };
            });
        });

        return () => {
            socket.off('receive-message');
        };
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            const response = await SendMessage(chatId, newMessage.trim());
            if (response.success) {
                const sentMsg = response.data.messages[response.data.messages.length - 1];
                // Emit to other user via socket
                socket.emit('send-message', { chatId, message: sentMsg });
                setChat(response.data);
                setNewMessage('');
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
        setSending(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getOtherUser = () => {
        if (!chat || !user) return null;
        return chat.buyer?._id === user._id || chat.buyer?._id?.toString() === user._id?.toString()
            ? chat.seller
            : chat.buyer;
    };

    const otherUser = getOtherUser();
    const isMine = (msg) => {
        const senderId = msg.sender?._id || msg.sender;
        return senderId?.toString() === user?._id?.toString();
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm border-b border-gray-200">
                <button
                    onClick={() => navigate('/chats')}
                    className="text-gray-500 hover:text-gray-800 transition-colors p-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {otherUser?.profilePicture ? (
                        <img src={otherUser.profilePicture} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        otherUser?.name?.charAt(0)?.toUpperCase()
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 leading-tight">{otherUser?.name}</p>
                    {chat?.product && (
                        <p className="text-xs text-gray-400 truncate">{chat.product.name}</p>
                    )}
                </div>

                {chat?.product?.images?.[0] && (
                    <img
                        src={chat.product.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                        onClick={() => navigate(`/product/${chat.product._id}`)}
                    />
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                {chat?.messages?.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>Start the conversation!</p>
                        <p className="text-sm mt-1">Say hello to {otherUser?.name}</p>
                    </div>
                )}

                {chat?.messages?.map((msg, idx) => {
                    const mine = isMine(msg);
                    return (
                        <div key={msg._id || idx} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${mine
                                ? 'bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-br-sm'
                                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p className={`text-xs mt-1 ${mine ? 'text-teal-100' : 'text-gray-400'} text-right`}>
                                    {moment(msg.createdAt).format('hh:mm A')}
                                    {mine && (
                                        <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-3 items-center">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                    style={{ maxHeight: '80px', overflowY: 'auto' }}
                />
                <button
                    onClick={handleSend}
                    disabled={sending || !newMessage.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                        background: newMessage.trim() ? 'linear-gradient(135deg, #0F9B8E, #1A659E)' : '#e5e7eb',
                        color: newMessage.trim() ? 'white' : '#9ca3af',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
