import React, { useEffect, useState } from "react";
import { approveDoctor, getApprovedDoctors } from "../api";

const AdminDashboard = ({ token }) => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const { data } = await getApprovedDoctors(token);
            setDoctors(data);
        };
        fetchDoctors();
    }, [token]);

    const handleApprove = async (doctorId) => {
        await approveDoctor(doctorId, token);
        setDoctors(doctors.map(doc => doc._id === doctorId ? { ...doc, isApproved: true } : doc));
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {doctors.map((doctor) => (
                <div key={doctor._id}>
                    <p>{doctor.fullname} - {doctor.isApproved ? "Approved" : "Pending"}</p>
                    {!doctor.isApproved && <button onClick={() => handleApprove(doctor._id)}>Approve</button>}
                </div>
            ))}
        </div>
    );
};

export default AdminDashboard;
