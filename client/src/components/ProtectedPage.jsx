import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../Apicalls/users";
import { Avatar, Badge, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FiUserCheck } from 'react-icons/fi';
import { TbLogout } from 'react-icons/tb';
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/LoadersSlice";
import { SetUser } from "../redux/usersSlice";
import { MdNotificationsActive } from 'react-icons/md';
import { IoChatbubblesOutline } from 'react-icons/io5';
import Notification from "./Notification";
import { getAllNotifications, readAllNotifications } from "../Apicalls/notification";
import { GetUnreadCount } from "../Apicalls/chats";

const ProtectedPage = ({ children }) => {
  const [notification, setnotification] = useState(null);
  const [showNotifications, setshowNotifications] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const { user } = useSelector(state => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      message.error(error.message);
    }
  };

  const getnotification = async () => {
    try {
      const response = await getAllNotifications();
      if (response.success) {
        setnotification(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const readNotification = async () => {
    try {
      const response = await readAllNotifications();
      if (response.success) {
        getnotification();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetchUnreadChats = async () => {
    try {
      const response = await GetUnreadCount();
      if (response.success) {
        setUnreadChats(response.data);
      }
    } catch (error) {
      // silently ignore
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getnotification();
      fetchUnreadChats();
      const interval = setInterval(fetchUnreadChats, 15000);
      return () => clearInterval(interval);
    } else {
      navigate("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    user && (
      <div style={{ minHeight: "100vh", backgroundColor: "#F0F4FF" }}>
        {/* Navbar */}
        <div style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 12px rgba(79,70,229,0.25)"
        }}>
          {/* Logo */}
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/')}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 20,
              color: "#fff",
              letterSpacing: -1
            }}>L</div>
            <span style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px"
            }}>
              Listify
            </span>
          </div>

            {user.role === 'admin' && (
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff", fontSize: 12,
                  fontWeight: 700, padding: "4px 12px",
                  borderRadius: 20, cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.4)",
                  letterSpacing: 0.3
                }}
                onClick={() => navigate('/admin')}
              >
                🛡️ Admin
              </span>
            )}

            {/* Right section */}
            <div style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: 40,
            padding: "6px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(255,255,255,0.25)"
          }}>
            <FiUserCheck size={18} color="#fff" />
            <span
              className="cursor-pointer"
              style={{ color: "#fff", fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}
              onClick={() => {
                if (user.role === 'user') {
                  navigate('/profile');
                } else {
                  navigate('/admin');
                }
              }}
            >
              {user.name}
            </span>

            {user.role === 'admin' && (
              <span style={{
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                letterSpacing: 0.5
              }}>ADMIN</span>
            )}

            <Badge count={unreadChats} className="cursor-pointer" onClick={() => navigate('/chats')}>
              <Avatar
                shape="circle"
                size="small"
                style={{ background: "rgba(255,255,255,0.2)", cursor: "pointer" }}
                icon={<IoChatbubblesOutline size={16} style={{ color: "#fff" }} />}
              />
            </Badge>

            <Badge
              count={notification?.filter((n) => !n.read).length}
              onClick={() => {
                readNotification();
                setshowNotifications(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                size="small"
                style={{ background: "rgba(255,255,255,0.2)", cursor: "pointer" }}
                icon={<MdNotificationsActive size={16} style={{ color: "#fff" }} />}
              />
            </Badge>

            <TbLogout
              size={18}
              style={{ color: "#fff", cursor: "pointer", opacity: 0.85 }}
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            />
          </div>
        </div>

        <div className="p-5">{children}</div>

        <Notification
          notification={notification}
          reloadNotifications={getnotification}
          showNotifications={showNotifications}
          setshowNotifications={setshowNotifications}
        />
      </div>
    )
  );
};

export default ProtectedPage;
