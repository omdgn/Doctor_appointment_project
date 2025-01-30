import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    // Logout function
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        navigate("/admin-login");
    }

    // Fetch unapproved doctors when the page loads
    useEffect(() => {
        const role = localStorage.getItem("role");

        // Redirect non-admins
        if (role !== "admin") {
            alert("Access Denied. Admins only.");
            navigate("/admin-login");
            return;
        }

        async function fetchUnapprovedDoctors() {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3000/doctor/unapproved", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setDoctors(data);
            } else {
                console.error("Failed to fetch unapproved doctors", data.error);
            }
        }

        fetchUnapprovedDoctors();
    }, [navigate]);

    // Approve doctor function
    function approveDoctor(doctorId) {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:3000/admin/approve/${doctorId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert("Doctor Approved!");
                    setDoctors(doctors.filter(doctor => doctor._id !== doctorId)); // Remove from the list
                } else {
                    alert("Failed to approve doctor");
                }
            })
            .catch(error => console.error("Error:", error));
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>

            <h2>Unapproved Doctors</h2>
            {doctors.length === 0 ? (
                <p>No unapproved doctors found.</p>
            ) : (
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor._id}>
                            {doctor.fullname}
                            <button onClick={() => approveDoctor(doctor._id)}>Approve</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminDashboard;
