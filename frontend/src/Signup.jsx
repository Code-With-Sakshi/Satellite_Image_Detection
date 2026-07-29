import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {

  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();

  const fullName = e.target.elements.fullName.value;
  const email = e.target.elements.email.value;
  const password = e.target.elements.password.value;
  const confirmPassword = e.target.elements.confirmPassword.value;

  // Check passwords
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/signup",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "Signup failed.");
      return;
    }

    // Save username for Dashboard
    localStorage.setItem(
      "username",
      data.full_name
    );

    // Save user ID
    localStorage.setItem(
      "user_id",
      data.user_id
    );

    alert("Account created successfully!");

    navigate("/dashboard");

  } catch (error) {

    console.error(
      "Signup Error:",
      error
    );

    alert(
      "Unable to connect to the backend."
    );

  }
};
  return (
    <div className="signup-page">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="nav-container">

          <div className="logo-section">

            <div className="logo-icon">
              ✣
            </div>

            <div className="logo-text">
              SatChange
              <span className="logo-ai"> AI</span>
            </div>

          </div>


          <nav className="nav-links">

            {/* ONLY LINKING ADDED */}
            <Link to="/" className="home-btn">
              ⌂ Home
            </Link>

          </nav>

        </div>

      </header>


      {/* SIGNUP CONTENT */}

      <main className="auth-container">

        <h1>
          Welcome to SatChange AI
        </h1>

        <p className="auth-subtitle">
          Login or create an account to access satellite change
          <br />
          detection.
        </p>


        {/* SIGNUP CARD */}

        <div className="auth-card">


          {/* LOGIN / SIGNUP TABS */}

          <div className="auth-tabs">

            {/* ONLY LINKING ADDED */}
            <Link to="/login" className="tab-link">
              Login
            </Link>

            <button className="active-tab">
              Sign Up
            </button>

          </div>


          {/* SIGNUP FORM */}

          <form onSubmit={handleSignup}>

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Email
              </label>

              <input
  type="email"
  name="email"
  required
/>

            </div>


            <div className="form-group">

              <label>
                Create Password
              </label>

             <input
  type="password"
  name="password"
  required
/>

            </div>


            <div className="form-group">

              <label>
                Confirm Password
              </label>

             <input
  type="password"
  name="confirmPassword"
  required
/>

            </div>


            {/* ONLY LINKING ADDED */}

            <button
              type="submit"
              className="submit-btn"
            >
              Create Account
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Signup;