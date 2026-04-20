import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { SetLoader } from '../../redux/LoadersSlice';
import { GetMyChats } from '../../Apicalls/chats';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Chats = () => {
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);

    const loadChats = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetMyChats();
            dispatch(SetLoader(false));
            if (response.success) {
                setChats(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    const getOtherUser = (chat) => {
        if (chat.buyer._id === user._id || chat.buyer._id?.toString() === user._id?.toString()) {
            return chat.seller;
        }
        return chat.buyer;
    };

    const getUnreadCount = (chat) => {
        return chat.messages?.filter(
            (msg) => msg.sender !== user._id && msg.sender?._id !== user._id && !msg.read
        ).length || 0;
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6" style={{ color: '#203A43' }}>
                My Chats
            </h1>

            {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg">No chats yet</p>
                    <p className="text-sm mt-1">Start a chat from any product page</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {chats.map((chat) => {
                        const other = getOtherUser(chat);
                        const unread = getUnreadCount(chat);
                        return (
                            <div
                                key={chat._id}
                                onClick={() => navigate(`/chat/${chat._id}`)}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {other?.profilePicture ? (
                                        <img src={other.profilePicture} alt={other.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        other?.name?.charAt(0)?.toUpperCase()
                                    )}
                                </div>

                                {/* Chat info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800 truncate">{other?.name}</span>
                                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                            {moment(chat.lastMessageAt).fromNow()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm text-gray-500 truncate">
                                            {chat.product?.name}
                                        </span>
                                        {unread > 0 && (
                                            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 truncate mt-0.5">
                                        {chat.lastMessage || 'No messages yet'}
                                    </p>
                                </div>

                                {/* Product image */}
                                {chat.product?.images?.[0] && (
                                    <img
                                        src={chat.product.images[0]}
                                        alt={chat.product.name}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Chats;
