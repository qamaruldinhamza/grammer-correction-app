import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.sessionExpired) {
      setShowToast(true); 
    }
  }, [location.state]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_FIXED_TOKEN}`,
        },
      });
      localStorage.setItem("token", response.data.token); 
      navigate("/main"); 
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      {/* Bootstrap Toast */}
      <div
        className={`toast-container position-fixed top-0 end-0 p-3`}
        style={{ zIndex: 1050 }}
      >
        <div
          className={`toast align-items-center text-white bg-danger border-0 ${
            showToast ? "show" : "hide"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">Session has expired.</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid">
                <button className="btn btn-primary" onClick={handleLogin}>
                  Login
                </button>
              </div>
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <a href="/register" className="text-decoration-none">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;