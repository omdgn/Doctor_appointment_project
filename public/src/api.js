import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Update with your backend URL

/*
export async function fetchAppointments() {
    const response = await fetch(`${API_BASE_URL}/api/appointments`);
    return await response.json();
}
*/

export const loginWithGoogle = (role) => {
    window.location.href = `${API_BASE_URL}/auth/google/${role}`;
};

export const registerDoctor = async (doctorData, token) => {
    return axios.post(`${API_BASE_URL}/doctor/register`, doctorData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getApprovedDoctors = async (token) => {
    return axios.get(`${API_BASE_URL}/doctor/approved`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const approveDoctor = async (doctorId, token) => {
    return axios.put(`${API_BASE_URL}/admin/approve/${doctorId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export async function checkApprovalStatus(userId, token) {
    const response = await fetch(`http://localhost:3000/doctor/status/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return await response.json();
}

export const bookAppointment = async (doctorId, patientId, date, time, token) => {
    const response = await axios.post(
        `http://localhost:3000/appointments/book`,
        { doctorId, patientId, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getPatientAppointments = async (patientId, token) => {
    const response = await axios.get(
        `http://localhost:3000/appointments/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

