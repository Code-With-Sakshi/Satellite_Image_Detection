# 🛰️ SatChange AI - Satellite Image Change Detection System

<p align="center">
AI-powered satellite image change detection using Deep Learning, Computer Vision, and Web Technologies.
</p>
---

# 🌍 Overview

**SatChange AI** is an AI-based satellite image change detection system that identifies changes between two satellite images captured at different time periods.

The system uses a **Deep Learning U-Net segmentation model** to compare "Before" and "After" satellite images and automatically generates:

- Change detection mask
- Change overlay visualization
- Changed pixel count
- Percentage of detected changes
- Detection status

The project combines **Artificial Intelligence, Remote Sensing, Computer Vision, Full Stack Development, and Cloud Deployment** into a complete end-to-end application.

---

# 🎯 Problem Statement

Satellite imagery is widely used for monitoring changes on Earth's surface.

Traditional manual comparison of satellite images is:

- Time-consuming
- Labor-intensive
- Difficult for large-scale monitoring

SatChange AI automates satellite image comparison using Deep Learning to detect meaningful surface changes.

Applications include:

- Urban expansion monitoring
- Disaster damage assessment
- Environmental monitoring
- Land-use change analysis
- Infrastructure development tracking

---

# ✨ Features

## 👤 User Authentication

- User registration
- User login
- Secure user session handling
- MySQL database integration


## 🛰️ AI-Based Change Detection

- Upload Before satellite image
- Upload After satellite image
- Deep Learning based image analysis
- Automatic change mask generation


## 📊 Detection Results

The system provides:

- Number of changed pixels
- Change percentage
- Detection status
- Predicted binary mask
- Change overlay visualization


## ☁️ Cloud Deployment

The complete application is deployed using:

Frontend:
- Vercel

Backend:
- Railway

Database:
- Railway MySQL

---

# 🏗️ System Architecture


```text
                         User
                           |
                           |
              React Frontend Application
                      (Vercel)
                           |
                           |
                    REST API Request
                           |
                           |
              Flask Backend Application
                      (Railway)
                           |
              ---------------------------
              |                         |
              |                         |
      TensorFlow U-Net Model       MySQL Database
   Satellite Change Detection    User & Detection Data
              |
              |
      Before + After Images
              |
              |
       Image Preprocessing
     (Resize + Normalize)
              |
              |
       U-Net Model Prediction
              |
              |
      Binary Change Mask
              |
              |
    Change Overlay Visualization
              |
              |
       Detection Results
```

# 🧠 Deep Learning Model

## Model Architecture

The project uses a **U-Net based Semantic Segmentation Model** for satellite image change detection.

U-Net is widely used for image segmentation tasks because of its ability to capture both:

- Global context
- Detailed spatial information


---

## Model Input

Two satellite images are used:


Before Image
RGB Channels → 3

After Image
RGB Channels → 3


Combined input:


3 + 3 = 6 Channels


Input shape:


(256, 256, 6)


---

## Model Output

The model produces a binary change map:

Output shape:


(256,256,1)


Pixel values:


0 → No Change

1 → Change Detected


---

## Loss Function

The model uses:


Dice Loss


which helps improve segmentation performance, especially when changed regions occupy a smaller portion of the image.

---

## Prediction Process

1. Resize images to:


256 × 256


2. Normalize pixel values:


0 - 255 → 0 - 1


3. Concatenate:


Before Image + After Image


4. Pass through U-Net model

5. Apply threshold:


Prediction > 0.5


6. Generate binary change mask

---

# 📚 Dataset

## LEVIR-CD Dataset

The model is trained using the:

**LEVIR-CD (Change Detection Dataset)**

Dataset contains:

- Before satellite images
- After satellite images
- Ground truth change masks


Dataset format:

Before Satellite Image
          +
After Satellite Image
          |
          ↓
   U-Net Change Detection Model
          |
          ↓
 Predicted Change Mask

Training Only:
Predicted Mask compared with Ground Truth Mask



---

# 🛠️ Technology Stack


## Artificial Intelligence & Machine Learning

- Python
- TensorFlow
- Keras
- NumPy
- OpenCV
- PIL


## Backend

- Flask
- Gunicorn
- REST API


## Frontend

- React.js
- Vite
- JavaScript
- CSS


## Database

- MySQL


## Deployment

- Railway
- Vercel


---

# 📂 Project Structure

Satellite_Image_Detection/

│
├── backend/
│   ├── app.py
│   ├── best_model.keras
│   ├── outputs/
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── requirements.txt
├── runtime.txt
└── README.md

---

# ⚙️ Installation and Setup


## Clone Repository


```bash
git clone <repository-url>

cd Satellite_Image_Detection

Backend Setup

Navigate to backend:

cd backend

Install dependencies:

pip install -r requirements.txt

Create .env file:

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

Run Flask backend:

python app.py

Backend runs at:

http://localhost:5000
Frontend Setup

Navigate to frontend:

cd frontend

Install packages:

npm install

Run React application:

npm run dev

Frontend runs at:

http://localhost:5173
🔌 API Documentation

Base URL:

https://satelliteimagedetection-production.up.railway.app
1. User Signup

Endpoint:

POST /signup

Request:

{
    "full_name":"User",
    "email":"user@gmail.com",
    "password":"password"
}
2. User Login

Endpoint:

POST /login

Request:

{
    "email":"user@gmail.com",
    "password":"password"
}
3. Satellite Change Detection

Endpoint:

POST /detect

Request Type:

multipart/form-data

Parameters:

user_id

before_image

after_image

Response:

{
    "success":true,
    "changed_pixels":26087,
    "change_percentage":39.81,
    "detection_status":"Change Detected",
    "mask_url":"/outputs/mask/image.png",
    "overlay_url":"/outputs/overlay/image.png"
}
🌐 Deployment
Frontend

Hosted on:

Vercel

URL:

https://satellite-image-detection.vercel.app/

Backend

Hosted on:

Railway

URL:

https://satelliteimagedetection-production.up.railway.app
Database

Hosted on:

Railway MySQL

🚀 Future Improvements

Future enhancements:

Improve model accuracy using advanced architectures
Transformer-based change detection models
Real-time satellite monitoring
Cloud image storage integration
Multi-class change detection
Historical detection dashboard
Automatic satellite image acquisition using APIs

📄 License

This project is developed for academic and research purposes.
