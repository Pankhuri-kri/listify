import { Button, Tabs, message } from "antd";
import React from "react";
import Products from "./Products/Products";
import UserBids from "./UserBids";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { axiosInstance } from "../../Apicalls/axiosinstance";
import { SetLoader } from "../../redux/LoadersSlice";
import { SetUser } from "../../redux/usersSlice";
import { GetCurrentUser } from "../../Apicalls/users";

const Profile = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const makeAdmin = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await axiosInstance.put(`/api/users/make-admin/${user._id}`);
      dispatch(SetLoader(false));
      if (response.data.success) {
        message.success("You are now an Admin! Please log out and log back in.");
        // Refresh user data
        const updated = await GetCurrentUser();
        if (updated.success) dispatch(SetUser(updated.data));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Button
          onClick={() => navigate("/")}
          style={{ background: "#203A43", color: "white", border: "none" }}
        >
          ← Back to Home
        </Button>
      </div>

      <Tabs>
        <Tabs.TabPane tab="Products" key="1">
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
          <UserBids />
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
          <div className="flex flex-col w-1/3 gap-3">
            <span className="text-xl flex justify-between uppercase">
              Name : <span className="text-xl">{user.name}</span>
            </span>
            <span className="text-xl flex justify-between">
              Email : <span className="text-xl">{user.email}</span>
            </span>
            <span className="text-xl flex justify-between uppercase">
              Role : <span className="text-xl capitalize">{user.role}</span>
            </span>
            <span className="text-xl flex justify-between uppercase">
              Created :{" "}
              <span className="text-xl">
                {moment(user.createdAt).format("MMM D , YYYY hh:mm A")}
              </span>
            </span>

            {user.role !== "admin" && (
              <div className="mt-4 p-4 border border-dashed border-orange-400 rounded-lg bg-orange-50">
                <p className="text-sm text-orange-700 mb-2 font-semibold">
                  ⚙️ First Time Setup
                </p>
                <p className="text-xs text-orange-600 mb-3">
                  Make your account an Admin to approve/reject products and manage users.
                </p>
                <Button
                  danger
                  onClick={makeAdmin}
                  className="w-full"
                >
                  Make Me Admin
                </Button>
              </div>
            )}

            {user.role === "admin" && (
              <Button
                type="primary"
                onClick={() => navigate("/admin")}
                style={{ background: "#203A43", border: "none", marginTop: 16 }}
              >
                Go to Admin Panel →
              </Button>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
