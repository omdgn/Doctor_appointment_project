import React from "react";
import { loginWithGoogle } from "../api";

const AuthButton = ({ role }) => {
    return (
        <button onClick={() => loginWithGoogle(role)} style={{ padding: "10px", fontSize: "16px" }}>
            Login as {role === "doctor" ? "Doctor" : "Patient"} with Google
        </button>
    );
};

export default AuthButton;
