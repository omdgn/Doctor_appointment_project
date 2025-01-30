import React, { useState, useEffect } from "react";
import { registerDoctor, checkApprovalStatus } from "../api"; // Add checkApprovalStatus API call
import { Autocomplete, TextField, Button, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// List of medical specialties
const specialties = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
    "Hematology", "Infectious Disease", "Neurology", "Nephrology",
    "Oncology", "Ophthalmology", "Orthopedics", "Otolaryngology",
    "Pediatrics", "Psychiatry", "Pulmonology", "Radiology",
    "Rheumatology", "Surgery", "Urology", "Anesthesiology",
];

// Days of the week for availability selection
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorRegistration = ({ token }) => {
    const [form, setForm] = useState({
        userId: localStorage.getItem("id"),
        fullname: "",
        areaOfInterest: [],
        availableDays: [],
        availableHours: { from: null, to: null },
        address: "",
        city: "",
        town: "",
    });

    const [isWaiting, setIsWaiting] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [doctorInfo, setDoctorInfo] = useState(null);

    useEffect(() => {
        // Check approval status every 5 seconds if waiting
        
        let interval = setInterval(async () => {
            try {
                const response = await checkApprovalStatus(form.userId, token);
        
                if (response.isApproved) {
                    setIsApproved(true);
                    setDoctorInfo(response);
                    setIsWaiting(false);
                    clearInterval(interval);
                } else {
                    if(!response.error) {
                        setIsWaiting(true);
                    }
                }
            } catch (error) {
                console.error("Error checking approval status:", error);
                return; // Stop execution to prevent entering the else block
            }
        }, 5000);
        

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [isWaiting, form.userId, token]);

    const handleDayChange = (event) => {
        const { value, checked } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            availableDays: checked
                ? [...prevForm.availableDays, value]  // Add selected day
                : prevForm.availableDays.filter((day) => day !== value),  // Remove deselected day
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerDoctor(form, token);
            setIsWaiting(true);
        } catch (error) {
            alert("Error registering doctor");
        }
    };

    return (
        <div>
            {!isApproved && !isWaiting && (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
                    <TextField label="Full Name" variant="outlined" 
                        onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
                    
                    {/* Medical Specialties - Autocomplete */}
                    <Autocomplete
                        multiple
                        options={specialties}
                        onChange={(event, newValue) => setForm({ ...form, areaOfInterest: newValue })}
                        renderInput={(params) => <TextField {...params} label="Area of Interest" variant="outlined" />}
                    />

                    {/* Available Days Selection */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Available Days</FormLabel>
                        <FormGroup row>
                            {daysOfWeek.map((day) => (
                                <FormControlLabel
                                    key={day}
                                    control={
                                        <Checkbox
                                            value={day}
                                            checked={form.availableDays.includes(day)}
                                            onChange={handleDayChange}
                                        />
                                    }
                                    label={day}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>

                    {/* Available Hours Selection with react-datepicker */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Available Hours</FormLabel>
                        <FormGroup row style={{ display: "flex", gap: "10px" }}>
                            <DatePicker
                                selected={form.availableHours.from}
                                onChange={(date) => setForm((prevForm) => ({
                                    ...prevForm,
                                    availableHours: { ...prevForm.availableHours, from: date }
                                }))}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="Start Time"
                                dateFormat="h:mm aa"
                                placeholderText="From"
                                className="time-picker"
                            />
                            <DatePicker
                                selected={form.availableHours.to}
                                onChange={(date) => setForm((prevForm) => ({
                                    ...prevForm,
                                    availableHours: { ...prevForm.availableHours, to: date }
                                }))}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="End Time"
                                dateFormat="h:mm aa"
                                placeholderText="To"
                                className="time-picker"
                            />
                        </FormGroup>
                    </FormControl>

                    <TextField label="Address" variant="outlined"
                        onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    
                    <TextField label="City" variant="outlined"
                        onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    
                    <TextField label="Town" variant="outlined"
                        onChange={(e) => setForm({ ...form, town: e.target.value })} />
                    
                    <Button type="submit" variant="contained" color="primary">Register</Button>
                </form>
            )}

            {isWaiting && (
                <div>
                    <h2>Waiting for Admin Approval...</h2>
                    <p>Your registration request has been sent. Please wait for admin approval.</p>
                </div>
            )}

            {isApproved && doctorInfo && (
                <div>
                    <h2>Doctor Approved</h2>
                    <p><strong>Name:</strong> {doctorInfo.fullname}</p>
                    <p><strong>Specialties:</strong> {doctorInfo.areaOfInterest.join(", ")}</p>
                    <p><strong>Available Days:</strong> {doctorInfo.availableDays.join(", ")}</p>
                    <p><strong>Available Hours:</strong> {doctorInfo.availableHours.from} - {doctorInfo.availableHours.to}</p>
                    <p><strong>Address:</strong> {doctorInfo.address}, {doctorInfo.city}, {doctorInfo.town}</p>
                </div>
            )}
        </div>
    );
};

export default DoctorRegistration;
