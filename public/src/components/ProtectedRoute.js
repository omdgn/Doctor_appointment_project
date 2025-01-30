import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
        alert("Access Denied. Please log in as an admin.");
        return <Navigate to="/admin-login" />;
    }

    return children;
}

export default ProtectedRoute;
