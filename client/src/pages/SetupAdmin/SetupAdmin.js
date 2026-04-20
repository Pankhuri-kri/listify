import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../Apicalls/axiosinstance";
import { message } from "antd";

const SetupAdmin = () => {
  const { user } = useSelector(state => state.users);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const makeAdmin = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(`/api/users/make-admin/${user._id}`);
      setLoading(false);
      if (res.data.success) {
        setDone(true);
        message.success("You are now an admin! Please log out and log back in.");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      setLoading(false);
      message.error(err.message);
    }
  };

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "40px 36px",
        maxWidth: 460, width: "100%", textAlign: "center",
        boxShadow: "0 8px 32px rgba(79,70,229,0.12)",
        border: "1px solid #EEF0FF"
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🛡️</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1F2937", marginBottom: 8 }}>
          Admin Setup
        </h1>

        {done ? (
          <>
            <p style={{ color: "#16A34A", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
              ✅ You are now an admin!
            </p>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
              Log out and log back in to activate your admin privileges.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              style={{
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "12px 28px", fontWeight: 700, fontSize: 15,
                cursor: "pointer", width: "100%"
              }}
            >
              Log out now
            </button>
          </>
        ) : (
          <>
            {user?.role === "admin" ? (
              <>
                <p style={{ color: "#16A34A", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                  ✅ You already have admin privileges!
                </p>
                <button
                  onClick={() => navigate("/admin")}
                  style={{
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "#fff", border: "none", borderRadius: 10,
                    padding: "12px 28px", fontWeight: 700, fontSize: 15,
                    cursor: "pointer", width: "100%"
                  }}
                >
                  Go to Admin Dashboard →
                </button>
              </>
            ) : (
              <>
                <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
                  Logged in as <strong style={{ color: "#1F2937" }}>{user?.name}</strong> ({user?.email})
                </p>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
                  Click the button below to grant yourself admin access. You will be able to manage products, users, and broadcast announcements.
                </p>
                <div style={{
                  background: "#FFFBEB", border: "1px solid #FDE68A",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 24,
                  fontSize: 13, color: "#92400E", textAlign: "left"
                }}>
                  ⚠️ <strong>Note:</strong> This page is for initial setup only. Remove the /setup-admin route from your code once your admin account is created.
                </div>
                <button
                  onClick={makeAdmin}
                  disabled={loading}
                  style={{
                    background: loading ? "#E5E7EB" : "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: loading ? "#9CA3AF" : "#fff",
                    border: "none", borderRadius: 10,
                    padding: "12px 28px", fontWeight: 700, fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    width: "100%", transition: "all 0.2s"
                  }}
                >
                  {loading ? "Processing..." : "Make me Admin 🛡️"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SetupAdmin;
