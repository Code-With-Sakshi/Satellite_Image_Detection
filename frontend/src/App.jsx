import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";

function Home() {
  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="nav-container">

          {/* Logo */}
          <div className="logo-section">

            <div className="logo-icon">
              ✣
            </div>

            <div className="logo-text">
              SatChange
              <span className="logo-ai"> AI</span>
            </div>

          </div>


          {/* Navigation */}
          <nav className="nav-links">

            <a href="#home">
              Home
            </a>

            {/* ONLY LINKING ADDED */}
            <Link to="/login" className="login-btn">
              Login
            </Link>

          </nav>

        </div>
      </header>


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero-section" id="home">

        <div className="hero-container">

          {/* LEFT SIDE - HERO CONTENT */}

          <div className="hero-content">

            <h1>
              Satellite Image
              <br />
              <span>Change Detection</span>
            </h1>


            <p>
              An AI-powered remote sensing platform that detects and
              visualizes changes between satellite images captured at
              different points in time.
            </p>


            {/* Buttons */}

            <div className="hero-buttons">

              {/* ONLY LINKING ADDED */}
              <Link to="/login" className="primary-btn">
                <span>♧</span>
                Get Started
                <span>→</span>
              </Link>

              <button className="secondary-btn">
                Learn more
              </button>

            </div>


            {/* Statistics */}

            <div className="hero-stats">

              <div className="stat-item">

                <h3>
                  256<sup>2</sup>
                </h3>

                <p>
                  INPUT TILES
                </p>

              </div>


              <div className="stat-item">

                <h3>
                  6-ch
                </h3>

                <p>
                  BEFORE + AFTER
                </p>

              </div>


              <div className="stat-item">

                <h3>
                  U-Net
                </h3>

                <p>
                  ARCHITECTURE
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE - EARTH VISUAL */}

          <div className="hero-visual">

            <div className="earth-container">

              <img
                src="/img1.jpg"
                alt="Earth satellite visualization"
                className="earth-image"
              />


              {/* Detection Card */}

              <div className="detection-card">

                <div className="detection-left">

                  <span className="detection-label">
                    DETECTION STATUS
                  </span>

                  <div className="status">

                    <span className="status-dot"></span>

                    Change Detected

                  </div>

                </div>


                <div className="pixel-count">

                  <span className="detection-label">
                    Δ PIXELS
                  </span>

                  <strong>
                    28,312
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          ABOUT THE PROJECT
      ========================= */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-content">

            {/* LEFT SIDE */}

            <div className="about-title">

              <div className="section-label">
                ABOUT THE PROJECT
              </div>

              <h2>
                Pixel-level detection
                <br />
                powered by deep
                <br />
                learning.
              </h2>

            </div>


            {/* RIGHT SIDE */}

            <div className="about-text">

              <p>
                SatChange AI is an AI-powered satellite image change
                detection system designed to identify significant changes
                in geographical areas using Computer Vision and Deep Learning.
              </p>


              <p>
                A trained U-Net deep learning model analyzes paired satellite
                images captured at different points in time and generates a
                pixel-level change detection mask.
              </p>


              <p>
                The detected changes can help identify events such as new
                building construction, infrastructure development, land-use
                changes, and other significant modifications visible in
                satellite imagery. The project uses the LEVIR-CD Change
                Detection Dataset for model development and evaluation.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WORKFLOW SECTION
      ========================= */}

      <section className="workflow-section">

        <div className="workflow-container">

          {/* LEFT ALIGNED HEADING */}

          <div className="section-label">
            WORKFLOW
          </div>

          <h2 className="section-heading">
            How It Works
          </h2>


          {/* WORKFLOW CARDS */}

          <div className="workflow-grid">


            {/* CARD 1 */}

            <div className="workflow-card">

              <div className="card-top">

                <div className="workflow-icon">
                  ◉
                </div>

                <span className="step-number">
                  01
                </span>

              </div>


              <h3>
                Upload Images
              </h3>


              <p>
                Upload Before and After satellite images representing
                the same geographical area.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="workflow-card">

              <div className="card-top">

                <div className="workflow-icon">
                  ▣
                </div>

                <span className="step-number">
                  02
                </span>

              </div>


              <h3>
                AI Analysis
              </h3>


              <p>
                Our trained U-Net deep learning model analyzes the two
                images and identifies changed regions.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="workflow-card">

              <div className="card-top">

                <div className="workflow-icon">
                  ⌾
                </div>

                <span className="step-number">
                  03
                </span>

              </div>


              <h3>
                Visualize Changes
              </h3>


              <p>
                View the predicted change mask, highlighted overlay,
                and change statistics.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          TECHNOLOGY SECTION
      ========================= */}

      <section className="technology-section">

        <div className="technology-container">

          {/* LEFT ALIGNED HEADING */}

          <div className="section-label">
            TECHNOLOGY STACK
          </div>

          <h2 className="section-heading">
            Technology Used
          </h2>


          {/* TECHNOLOGY CARDS */}

          <div className="technology-grid">

            <TechnologyCard
              title="DEEP LEARNING"
              value="U-Net"
            />


            <TechnologyCard
              title="COMPUTER VISION"
              value="OpenCV"
            />


            <TechnologyCard
              title="DATASET"
              value="LEVIR-CD"
            />


            <TechnologyCard
              title="FRAMEWORK"
              value="TensorFlow / Keras"
            />


            <TechnologyCard
              title="BACKEND"
              value="Flask (Python)"
            />


            <TechnologyCard
              title="FRONTEND"
              value="React.js"
            />


            <TechnologyCard
              title="LANGUAGE"
              value="Python"
            />


            <TechnologyCard
              title="DATABASE"
              value="SQLite"
            />

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <p>
          © 2026 SatChange AI. Satellite Image Change Detection.
        </p>

      </footer>

    </div>
  );
}


/* =========================
   TECHNOLOGY CARD COMPONENT
========================= */

function TechnologyCard({ title, value }) {

  return (

    <div className="technology-card">

      <span className="technology-title">
        {title}
      </span>

      <span className="technology-value">
        {value}
      </span>

    </div>

  );

}


/* =========================
   ROUTES
========================= */

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME PAGE */}
        <Route path="/" element={<Home />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* SIGNUP PAGE */}
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD / UPLOAD PAGE */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
  );
}


export default App;