import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();
const handleLogin = async (e) => {

  e.preventDefault();

  // Get values from form
  const email =
    e.target.elements.email.value;

  const password =
    e.target.elements.password.value;


  try {

    // Send login request to Flask
const response = await fetch(
  "https://satelliteimagedetection-production.up.railway.app/login",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },
    
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );


    // Get response from Flask
    const data =
      await response.json();


    // ==================================================
    // CHECK LOGIN RESULT
    // ==================================================

    if (
      !response.ok ||
      !data.success
    ) {

      alert(
        data.error ||
        "Invalid email or password."
      );

      return;

    }


    // ==================================================
    // SAVE USER INFORMATION
    // ==================================================

    localStorage.setItem(
      "username",
      data.full_name
    );


    localStorage.setItem(
      "user_id",
      data.user_id
    );


    localStorage.setItem(
      "email",
      data.email
    );


    // ==================================================
    // LOGIN SUCCESS
    // ==================================================

    alert(
      "Login successful!"
    );


    navigate(
      "/dashboard"
    );


  } catch (error) {

    console.error(
      "Login Error:",
      error
    );

    alert(
      "Unable to connect to the backend."
    );

  }

};

  return (
    <div className="login-page">

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


      {/* LOGIN CONTENT */}

      <main className="auth-container">

        <h1>
          Welcome to SatChange AI
        </h1>

        <p className="auth-subtitle">
          Login or create an account to access satellite change
          <br />
          detection.
        </p>


        {/* LOGIN CARD */}

        <div className="auth-card">


          {/* LOGIN / SIGNUP TABS */}

          <div className="auth-tabs">

            <button className="active-tab">
              Login
            </button>

            {/* ONLY LINKING ADDED */}
            <Link to="/signup" className="tab-link">
              Sign Up
            </Link>

          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

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
                Password
              </label>

            <input
  type="password"
  name="password"
  required
/>

            </div>


            {/* ONLY LINKING ADDED */}

            <button
              type="submit"
              className="submit-btn"
            >
              Login
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Login;
