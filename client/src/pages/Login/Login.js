import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../Apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/LoadersSlice";

const rules = [{ required: true, message: "Required" }];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinished = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await LoginUser(values);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.data);
        window.location.href = '/';
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) navigate("/");
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "fixed", top: -80, right: -80,
        width: 300, height: 300,
        background: "rgba(255,255,255,0.05)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: -100, left: -100,
        width: 400, height: 400,
        background: "rgba(255,255,255,0.05)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            borderRadius: 16,
            marginBottom: 12,
            fontSize: 26,
            fontWeight: 900,
            color: "#fff",
          }}>L</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#1F2937" }}>
            Listify
          </h1>
          <p style={{ margin: "6px 0 0", color: "#9CA3AF", fontSize: 14 }}>
            Welcome back! Sign in to your account
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinished}>
          <FormItem
            label={<span style={{ fontWeight: 600, color: "#374151" }}>Email</span>}
            name="email"
            rules={rules}
          >
            <Input
              placeholder="you@example.com"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </FormItem>

          <FormItem
            label={<span style={{ fontWeight: 600, color: "#374151" }}>Password</span>}
            name="password"
            rules={rules}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </FormItem>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{
              marginTop: 8,
              borderRadius: 10,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              border: "none",
              height: 46,
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)"
            }}
          >
            Sign In
          </Button>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <span style={{ color: "#6B7280", fontSize: 14 }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#4F46E5", fontWeight: 700 }}>
                Create one
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
