import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DoctorRegistration from "../components/DoctorRegistration";
import AdminDashboard from "../components/AdminDashboard";
import ApprovedDoctors from "../components/ApprovedDoctors";

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
        return null;
    }

    const user = jwtDecode(token);
    console.log("user",user);
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("id"); localStorage.removeItem("role"); navigate("/"); }}>
                Logout
            </button>
            
            {user.role === "doctor" && <DoctorRegistration token={token} />}
            {user.role === "admin" && <AdminDashboard token={token} />}
            {user.role === "patient" && <ApprovedDoctors token={token} />}
        </div>
    );
};

export default Dashboard;
