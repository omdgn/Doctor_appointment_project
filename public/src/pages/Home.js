import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const user = token ? jwtDecode(token) : null;

    // Handle OAuth Redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromURL = urlParams.get("token");
        const idFromURL = urlParams.get("id");

        if (tokenFromURL) {
            localStorage.setItem("token", tokenFromURL);
            localStorage.setItem("id", idFromURL);
            setToken(tokenFromURL);
            navigate("/dashboard"); // Redirect after storing token
        }
    }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-blue-500 mb-4">
          Doctor Appointment System
        </h1>
        {!token ? (
          <>
            <p className="text-gray-700 text-center mb-4">
              Please log in to continue.
            </p>
            <div className="flex flex-col space-y-3">
              <a
                href="http://localhost:3000/auth/google/doctor"
                className="block w-full text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Login as Doctor
              </a>
              <a
                href="http://localhost:3000/auth/google/patient"
                className="block w-full text-center bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
              >
                Login as Patient
              </a>
              <button
                onClick={() => navigate("/admin-login")}
                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
              >
                Admin Login
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Welcome back,{" "}
              <span className="font-medium text-blue-500">{user.email}</span>!
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
