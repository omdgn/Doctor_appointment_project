import React, { useEffect, useState } from "react";
import { getApprovedDoctors, bookAppointment, getPatientAppointments } from "../api";
import { TextField, Autocomplete, Card, CardContent, Typography, Button, Grid } from "@mui/material";

// List of medical specialties for filtering
const specialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
    "Hematology", "Infectious Disease", "Neurology", "Nephrology",
    "Oncology", "Ophthalmology", "Orthopedics", "Otolaryngology",
    "Pediatrics", "Psychiatry", "Pulmonology", "Radiology",
    "Rheumatology", "Surgery", "Urology", "Anesthesiology",
];

const ApprovedDoctors = ({ token }) => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [city, setCity] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [selections, setSelections] = useState({});
    const [appointments, setAppointments] = useState([]); // Store patient appointments
    const patientId = localStorage.getItem("id"); // Get patient ID from local storage

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await getApprovedDoctors(token);
                setDoctors(data);
                setFilteredDoctors(data); // Initialize with all approved doctors
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        const fetchAppointments = async () => {
            try {
                const data  = await getPatientAppointments(patientId, token);
                console.log("sago", data);
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching patient appointments:", error);
            }
        };

        fetchDoctors();
        fetchAppointments();
    }, [token, patientId]);

    // Filter function
    useEffect(() => {
        let filtered = doctors.filter(doctor =>
            doctor.city.toLowerCase().includes(city.toLowerCase()) &&
            (selectedSpecialties?.length === 0 || 
             selectedSpecialties.some(specialty => doctor.areaOfInterest.includes(specialty)))
        );
        setFilteredDoctors(filtered);
    }, [city, selectedSpecialties, doctors]);

    // Function to generate half-hour intervals
    const generateTimeSlots = (from, to) => {
        if (!from || !to) return [];
        const slots = [];
        let startTime = new Date(from);
        const endTime = new Date(to);

        while (startTime < endTime) {
            slots.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            startTime.setMinutes(startTime.getMinutes() + 30);
        }

        return slots;
    };

    // Handle Appointment Booking
    const handleBookAppointment = async (doctorId, selectedDay, selectedTime) => {
        if (!selectedDay || !selectedTime) {
            alert("Please select a day and time before booking.");
            return;
        }

        try {
            const response = await bookAppointment(doctorId, patientId, selectedDay, selectedTime, token);
            console.log(response);
            alert(response.message);
            const fetchAppointments = async () => {
                try {
                    const data  = await getPatientAppointments(patientId, token);
                    console.log("sago", data);
                    setAppointments(data);
                } catch (error) {
                    console.error("Error fetching patient appointments:", error);
                }
            };
            fetchAppointments();
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const updateSelection = (doctorId, type, value) => {
        setSelections(prev => ({
            ...prev,
            [doctorId]: {
                ...prev[doctorId],
                [type]: value
            }
        }));
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h2>Find a Doctor</h2>

            {/* City Filter */}
            <TextField
                label="Search by City"
                variant="outlined"
                fullWidth
                margin="normal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />

            {/* Specialty Filter */}
            <Autocomplete
                multiple
                options={specialties}
                onChange={(event, newValue) => setSelectedSpecialties(newValue)}
                renderInput={(params) => <TextField {...params} label="Filter by Specialty" variant="outlined" />}
            />

            {/* Display Filtered Doctors */}
            <div>
                {(filteredDoctors?.length || 0) > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <Card key={doctor._id} variant="outlined" style={{ margin: "10px", padding: "10px" }}>
                            <CardContent>
                                <Typography variant="h6">{doctor.fullname}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {doctor.areaOfInterest.join(", ")}
                                </Typography>
                                <Typography variant="body2">📍 {doctor.city}, {doctor.town}</Typography>

                                {/* Available Days as Buttons */}
                                <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                                    Select a Day:
                                </Typography>
                                <Grid container spacing={1} justifyContent="center">
                                    {doctor.availableDays.map((day, index) => (
                                        <Grid item key={index}>
                                            <Button 
                                                variant={selections[doctor._id]?.day === day ? "contained" : "outlined"} 
                                                onClick={() => updateSelection(doctor._id, 'day', day)}
                                            >
                                                {day}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Available Hours as Buttons */}
                                <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                                    Select a Time:
                                </Typography>
                                <Grid container spacing={1} justifyContent="center">
                                    {generateTimeSlots(doctor.availableHours?.from, doctor.availableHours?.to).map((slot, index) => (
                                        <Grid item key={index}>
                                            <Button 
                                                variant={selections[doctor._id]?.time === slot ? "contained" : "outlined"} 
                                                onClick={() => updateSelection(doctor._id, 'time', slot)}
                                            >
                                                {slot}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    onClick={() => handleBookAppointment(
                                        doctor._id, 
                                        selections[doctor._id]?.day, 
                                        selections[doctor._id]?.time
                                    )}
                                    style={{ marginTop: "10px" }}
                                >
                                    Book Appointment
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No doctors found for the selected filters.</p>
                )}
            </div>

            {/* Display Patient's Appointments */}
{/* Display Patient's Appointments */}
<div style={{ marginTop: "30px" }}>
    <h2>My Appointments</h2>
    {appointments.length > 0 ? (
        appointments.map((appointment, index) => (
            <Card key={index} variant="outlined" style={{ margin: "10px", padding: "10px" }}>
                <CardContent>
                    <Typography variant="h6">{appointment?.doctorId?.fullname || "Unknown Doctor"}</Typography>
                    <Typography variant="body2">
                        {appointment?.doctorId?.areaOfInterest?.join(", ") || "Specialties not available"}
                    </Typography>
                    <Typography variant="body2">
                        📍 {appointment?.doctorId?.city || "Unknown City"}, {appointment?.doctorId?.town || "Unknown Town"}
                    </Typography>
                    <Typography variant="body2">📅 {appointment?.date || "No Date"}</Typography>
                    <Typography variant="body2">⏰ {appointment?.time || "No Time"}</Typography>
                </CardContent>
            </Card>
        ))
    ) : (
        <p>No upcoming appointments.</p>
    )}
</div>

        </div>
    );
};

export default ApprovedDoctors;
