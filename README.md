Doctor Appointment Project
This project provides an online appointment system for doctors and patients. Users can log in with their Google accounts,
book appointments, and interact with administrator-approved doctors.

You can access the working version of the project after running the commands "node server.js" in the server folder 
and "npm run start" in the public file in the terminal.

Server Folder
-The part where the backend coding of the project is done.

Public Folder
-The part where the frontend coding of the project is done.
-api.js file to which backend points are directed

Features
User Authentication: Users can log in securely with Google OAuth 2.0 integration.

Role-Based Access:
Patient: Can view doctors and book appointments.
Doctor: Can register and wait for administrator approval; can manage appointments once approved.
Administrator: Can approve doctor registrations and manage all appointments in the system.
Appointment Management: Patients can book appointments with available doctors; doctors and administrators can view and manage appointments.
Email Notifications: The system sends email notifications for appointment confirmations and reminders.

Usage
User Login:
Log in with your Google account as a patient or doctor.
Doctor Registration and Approval:
Doctors must wait for administrator approval after registering.
Book an Appointment:
Patients can book an appointment with approved doctors by selecting a convenient time slot.

Server Folder
models/: Contains database schemas.
routes/: Defines API endpoints.
services/: Contains services such as email sending and message queuing.
middleware/: Contains middleware such as authentication.
config/: Contains authentication configurations.
gateway/: For gateway operation.

Public Folder
AdminDashboard.js: Control panel component where administrators can view and approve doctors waiting for approval.
AdminLogin.js: Component that allows administrators to log in.
Dashboard.js: Control panel that manages the relevant components according to the role of users (doctor, patient, administrator).
Home.js: Home page of the application; allows users to log in and redirects according to the login status.
App.js: Main component of the application; defines redirects and page structure.
api.js: Helper functions that contain the necessary API requests to communicate with the server.


//There were some corruptions when the gateway process was exited from local.
//Also, we can see the notifications in the queue as a result of the activation of the rabbitmq service by running the rabbitmq erlang software in the background.
