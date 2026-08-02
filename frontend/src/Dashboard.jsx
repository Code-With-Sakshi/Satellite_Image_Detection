import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  // =====================================================
  // USER DATA
  // =====================================================

  const username =
    localStorage.getItem("username") || "User";

  const userId =
    localStorage.getItem("user_id");


  // =====================================================
  // UPLOADED IMAGES
  // =====================================================

  const [beforeImage, setBeforeImage] = useState(null);

  const [afterImage, setAfterImage] = useState(null);


  // =====================================================
  // IMAGE PREVIEW URLS
  // =====================================================

  const [beforePreview, setBeforePreview] = useState("");

  const [afterPreview, setAfterPreview] = useState("");


  // =====================================================
  // DETECTION RESULTS
  // =====================================================

  const [detectionResult, setDetectionResult] =
    useState(null);


  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // ERROR STATE
  // =====================================================

  const [error, setError] =
    useState("");


  // =====================================================
  // CHECK USER LOGIN
  // =====================================================

  useEffect(() => {

    if (!userId) {

      setError(
        "User session not found. Please login again."
      );

      navigate("/login");

    }

  }, [userId, navigate]);


  // =====================================================
  // BEFORE IMAGE
  // =====================================================

  const handleBeforeImage = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setBeforeImage(file);

      setBeforePreview(
        URL.createObjectURL(file)
      );

      // Clear previous result
      setDetectionResult(null);

      setError("");

    }

  };


  // =====================================================
  // AFTER IMAGE
  // =====================================================

  const handleAfterImage = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setAfterImage(file);

      setAfterPreview(
        URL.createObjectURL(file)
      );

      // Clear previous result
      setDetectionResult(null);

      setError("");

    }

  };


  // =====================================================
  // DETECT CHANGES
  // =====================================================

  const handleDetectChanges = async () => {

    // ===================================================
    // CHECK USER ID
    // ===================================================

    const currentUserId =
      localStorage.getItem("user_id");


    if (!currentUserId) {

      setError(
        "User ID not found. Please login again."
      );

      navigate("/login");

      return;

    }


    // ===================================================
    // CHECK BOTH IMAGES
    // ===================================================

    if (!beforeImage || !afterImage) {

      setError(
        "Please upload both Before and After images."
      );

      return;

    }


    // ===================================================
    // START LOADING
    // ===================================================

    setLoading(true);

    setError("");

    setDetectionResult(null);


    try {

      // =================================================
      // CREATE FORM DATA
      // =================================================

      const formData =
        new FormData();


      // =================================================
      // ADD USER ID
      // =================================================

      formData.append(
        "user_id",
        currentUserId
      );


      // =================================================
      // ADD BEFORE IMAGE
      // =================================================

      formData.append(
        "before_image",
        beforeImage
      );


      // =================================================
      // ADD AFTER IMAGE
      // =================================================

      formData.append(
        "after_image",
        afterImage
      );


      // =================================================
      // SEND REQUEST TO FLASK
      // =================================================

      const response =
       await fetch(
 "https://satelliteimagedetection-production.up.railway.app/detect",
  {
    method: "POST",
    body: formData
  }
);


      // =================================================
      // GET BACKEND RESPONSE
      // =================================================

      const data =
        await response.json();


      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.error ||
          "Detection failed."
        );

      }


      // =================================================
      // SAVE DETECTION RESULT
      // =================================================

      setDetectionResult(
        data
      );


    } catch (error) {

      console.error(
        "Detection Error:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to the backend."
      );

    } finally {

      // =================================================
      // STOP LOADING
      // =================================================

      setLoading(false);

    }

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    // Remove user data
    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "user_id"
    );


    // Clear dashboard data
    setBeforeImage(null);

    setAfterImage(null);

    setBeforePreview("");

    setAfterPreview("");

    setDetectionResult(null);


    // Navigate to login
    navigate("/login");

  };


  // =====================================================
  // IMAGE URL
  // =====================================================

 const getImageUrl = (url) => {

  if (!url) {
    return "";
  }

  return `https://satellite-image-detection.onrender.com${url}`;
};


  // =====================================================
  // DOWNLOAD IMAGE
  // =====================================================

  const handleDownload = async (
    url,
    filename
  ) => {

    try {

      const response =
        await fetch(
          getImageUrl(url)
        );


      if (!response.ok) {

        throw new Error(
          "Failed to download image."
        );

      }


      const blob =
        await response.blob();


      const downloadUrl =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement("a");


      link.href =
        downloadUrl;


      link.download =
        filename;


      document.body.appendChild(
        link
      );


      link.click();


      link.remove();


      window.URL.revokeObjectURL(
        downloadUrl
      );


    } catch (error) {

      console.error(
        "Download error:",
        error
      );

      setError(
        "Unable to download the image."
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="dashboard-page">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="dashboard-navbar">

        <div className="dashboard-logo-section">

          <div className="logo-icon">
            ✣
          </div>


          <div className="logo-text">

            SatChange

            <span className="logo-ai">
              {" "}AI
            </span>

          </div>

        </div>


        {/* USER SECTION */}

        <div className="dashboard-user">

          <span>
            Signed in as {username}
          </span>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            ⇥ Logout
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-container">


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="dashboard-label">
          ✣ CHANGE DETECTION WORKSPACE
        </div>


        <h1>
          Satellite Change Detection
        </h1>


        <p className="dashboard-description">

          Upload two satellite images of the same geographical
          location captured at different times.

          <br />

          The AI model will analyze the images and highlight
          the detected changes.

        </p>


        {/* =================================================
            SECTION 1
            UPLOAD IMAGES
        ================================================= */}

        <section className="upload-section">

          <h2>
            1. Upload Images
          </h2>


          <div className="upload-grid">


            {/* =============================================
                BEFORE IMAGE
            ============================================= */}

            <div className="upload-card">

              <div className="upload-card-title">
                ▧ Before Image
              </div>


              <p>
                Upload the earlier satellite image
              </p>


              <label className="upload-box">

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={
                    handleBeforeImage
                  }
                  hidden
                />


                <div className="upload-icon">
                  ⇧
                </div>


                <div>

                  {beforeImage

                    ? beforeImage.name

                    : "Drop image here or click to browse"

                  }

                </div>


                <span>
                  JPG · JPEG · PNG
                </span>

              </label>

            </div>


            {/* =============================================
                AFTER IMAGE
            ============================================= */}

            <div className="upload-card">

              <div className="upload-card-title">
                ▧ After Image
              </div>


              <p>
                Upload the later satellite image
              </p>


              <label className="upload-box">

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={
                    handleAfterImage
                  }
                  hidden
                />


                <div className="upload-icon">
                  ⇧
                </div>


                <div>

                  {afterImage

                    ? afterImage.name

                    : "Drop image here or click to browse"

                  }

                </div>


                <span>
                  JPG · JPEG · PNG
                </span>

              </label>

            </div>

          </div>


          {/* =============================================
              DETECT BUTTON
          ============================================= */}

          <div className="detect-section">

            <button
              className="detect-btn"
              disabled={
                !beforeImage ||
                !afterImage ||
                loading
              }
              onClick={
                handleDetectChanges
              }
            >

              {loading

                ? "Analyzing Images..."

                : "⌕ Detect Changes"

              }

            </button>


            {/* STATUS MESSAGE */}

            {!beforeImage ||
            !afterImage ? (

              <p>
                Upload both Before and After images
                to enable detection.
              </p>

            ) : loading ? (

              <p>
                AI model is analyzing your images...
              </p>

            ) : (

              <p>
                Both images uploaded. Ready for detection.
              </p>

            )}

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <div className="error-message">

              {error}

            </div>

          )}

        </section>


        {/* =================================================
            SECTION 2
            IMAGE DETECTION
        ================================================= */}

        {detectionResult && (

          <section className="detection-section">


            <h2>
              2. Image Detection
            </h2>


            {/* =============================================
                DETECTION SUMMARY
            ============================================= */}

            <div className="summary-grid">


              {/* CHANGED PIXELS */}

              <div className="summary-card">

                <span>
                  CHANGED PIXELS
                </span>


                <strong>
                  {
                    detectionResult.changed_pixels
                  }
                </strong>

              </div>


              {/* CHANGE PERCENTAGE */}

              <div className="summary-card">

                <span>
                  CHANGE PERCENTAGE
                </span>


                <strong>
                  {
                    detectionResult.change_percentage
                  }%
                </strong>

              </div>


              {/* DETECTION STATUS */}

              <div className="summary-card">

                <span>
                  DETECTION STATUS
                </span>


                <strong
                  className={
                    detectionResult.detection_status ===
                    "Change Detected"

                    ? "status-detected"

                    : "status-no-change"
                  }
                >

                  {
                    detectionResult.detection_status
                  }

                </strong>

              </div>

            </div>


            {/* =============================================
                VISUAL CHANGE ANALYSIS
            ============================================= */}

            <div className="visual-analysis">

              <h3>
                Visual Change Analysis
              </h3>


              <div className="results-grid">


                {/* =========================================
                    BEFORE IMAGE
                ========================================= */}

                <div className="result-card">

                  <h4>
                    Before Image
                  </h4>


                  {beforePreview && (

                    <img
                      src={beforePreview}
                      alt="Before satellite"
                    />

                  )}

                </div>


                {/* =========================================
                    AFTER IMAGE
                ========================================= */}

                <div className="result-card">

                  <h4>
                    After Image
                  </h4>


                  {afterPreview && (

                    <img
                      src={afterPreview}
                      alt="After satellite"
                    />

                  )}

                </div>


                {/* =========================================
                    MASK
                ========================================= */}

                <div className="result-card">

                  <h4>
                    Predicted Change Mask
                  </h4>


                  <img
                    src={
                      getImageUrl(
                        detectionResult.mask_url
                      )
                    }
                    alt="Predicted change mask"
                  />

                </div>


                {/* =========================================
                    OVERLAY
                ========================================= */}

                <div className="result-card">

                  <h4>
                    Change Overlay
                  </h4>


                  <img
                    src={
                      getImageUrl(
                        detectionResult.overlay_url
                      )
                    }
                    alt="Change overlay"
                  />

                </div>

              </div>

            </div>


            {/* =============================================
                DOWNLOAD RESULTS
            ============================================= */}

            <div className="download-section">

              <h3>
                Download Results
              </h3>


              <div className="download-buttons">


                {/* DOWNLOAD MASK */}

                <button
                  onClick={() =>
                    handleDownload(
                      detectionResult.mask_url,
                      "change_mask.png"
                    )
                  }
                >
                  ↓ Download Mask
                </button>


                {/* DOWNLOAD OVERLAY */}

                <button
                  onClick={() =>
                    handleDownload(
                      detectionResult.overlay_url,
                      "change_overlay.png"
                    )
                  }
                >
                  ↓ Download Overlay
                </button>

              </div>

            </div>


          </section>

        )}

      </main>

    </div>

  );

}


export default Dashboard;
