import { useState } from "react";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(event) {
        event.preventDefault(); // Prevent form reload

        try {
            const response = await fetch("http://localhost:3000/auth/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Store JWT token & user role in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                // ✅ Redirect admin to dashboard
                if (data.role === "admin") {
                    window.location.href = "/admin-dashboard";
                } else {
                    alert("You are not authorized as an admin!");
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
