import os
import uuid

import numpy as np
import tensorflow as tf

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from PIL import Image

import mysql.connector
from mysql.connector import Error

from dotenv import load_dotenv


# ==========================================================
# BASE DIRECTORY
# ==========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ==========================================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================================

load_dotenv(
    os.path.join(
        BASE_DIR,
        ".env"
    )
)


# ==========================================================
# FLASK APP
# ==========================================================

app = Flask(__name__)

CORS(app)


# ==========================================================
# MYSQL DATABASE CONFIGURATION
# ==========================================================

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(
        os.getenv(
            "DB_PORT",
            "3306"
        )
    ),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}
# ==========================================================
# DATABASE CONNECTION
# ==========================================================

def get_db_connection():

    try:

        connection = mysql.connector.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"]
        )

        return connection

    except Error as e:

        print(
            "MySQL Connection Error:",
            e
        )

        return None


# ==========================================================
# BASE DIRECTORY
# ==========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ==========================================================
# MODEL PATH
# ==========================================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "best_model.keras"
)


# ==========================================================
# UPLOAD FOLDERS
# ==========================================================

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

BEFORE_FOLDER = os.path.join(
    UPLOAD_FOLDER,
    "before"
)

AFTER_FOLDER = os.path.join(
    UPLOAD_FOLDER,
    "after"
)


# ==========================================================
# OUTPUT FOLDERS
# ==========================================================

OUTPUT_FOLDER = os.path.join(
    BASE_DIR,
    "outputs"
)

MASK_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "masks"
)

OVERLAY_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "overlays"
)


# ==========================================================
# CREATE FOLDERS
# ==========================================================

os.makedirs(
    BEFORE_FOLDER,
    exist_ok=True
)

os.makedirs(
    AFTER_FOLDER,
    exist_ok=True
)

os.makedirs(
    MASK_FOLDER,
    exist_ok=True
)

os.makedirs(
    OVERLAY_FOLDER,
    exist_ok=True
)


# ==========================================================
# DICE LOSS
# ==========================================================

def dice_loss(
    y_true,
    y_pred
):

    smooth = 1e-6

    y_true = tf.cast(
        y_true,
        tf.float32
    )

    y_pred = tf.cast(
        y_pred,
        tf.float32
    )

    y_true_f = tf.reshape(
        y_true,
        [-1]
    )

    y_pred_f = tf.reshape(
        y_pred,
        [-1]
    )

    intersection = tf.reduce_sum(
        y_true_f * y_pred_f
    )

    dice = (

        (2.0 * intersection + smooth)

        /

        (
            tf.reduce_sum(y_true_f)
            +
            tf.reduce_sum(y_pred_f)
            +
            smooth
        )

    )

    return 1.0 - dice


# ==========================================================
# LOAD AI MODEL
# ==========================================================

print(
    "Loading model..."
)


model = tf.keras.models.load_model(

    MODEL_PATH,

    custom_objects={
        "dice_loss": dice_loss
    },

    compile=False

)


print(
    "Model loaded successfully!"
)


print(
    "Model input shape:",
    model.input_shape
)


print(
    "Model output shape:",
    model.output_shape
)


# ==========================================================
# PREPROCESS IMAGE
# ==========================================================

def preprocess_image(
    image,
    target_size=(256, 256)
):

    image = image.convert(
        "RGB"
    )

    image = image.resize(
        target_size
    )

    image = np.array(
        image
    )

    image = image.astype(
        np.float32
    ) / 255.0

    return image


# ==========================================================
# PREDICT CHANGE
# ==========================================================

def predict_change(
    before_image,
    after_image
):

    before = preprocess_image(
        before_image,
        target_size=(256, 256)
    )

    after = preprocess_image(
        after_image,
        target_size=(256, 256)
    )


    # Combine before + after
    # 3 channels + 3 channels = 6 channels

    combined = np.concatenate(

        [
            before,
            after
        ],

        axis=-1

    )


    # Add batch dimension

    input_data = np.expand_dims(

        combined,

        axis=0

    )


    # Model prediction

    prediction = model.predict(

        input_data,

        verbose=0

    )


    # Remove batch dimension

    prediction = prediction[0]


    # Remove output channel

    if prediction.shape[-1] == 1:

        prediction = prediction[
            :,
            :,
            0
        ]


    # Create binary mask

    mask = (

        prediction > 0.5

    ).astype(

        np.uint8

    )


    return mask


# ==========================================================
# CREATE CHANGE OVERLAY
# ==========================================================

def create_overlay(
    after_image,
    mask
):

    after = np.array(

        after_image
        .convert("RGB")
        .resize(
            (256, 256)
        )

    )


    overlay = after.copy()


    binary_mask = (

        mask > 0

    )


    red_color = np.zeros_like(
        after
    )


    red_color[
        :,
        :,
        0
    ] = 255


    overlay[
        binary_mask
    ] = (

        0.5
        *
        after[
            binary_mask
        ]

        +

        0.5
        *
        red_color[
            binary_mask
        ]

    )


    return overlay


# ==========================================================
# HOME ROUTE
# ==========================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify(

        {
            "message":
                "SatChange AI Flask Backend is running!",

            "status":
                "success"
        }

    )


# ==========================================================
# SIGNUP API
# ==========================================================

@app.route(
    "/signup",
    methods=["POST"]
)
def signup():

    connection = None

    cursor = None

    try:

        # Get JSON data

        data = request.get_json()


        if data is None:

            return jsonify(

                {
                    "success": False,
                    "error": "No data received."
                }

            ), 400


        # Get fields

        full_name = data.get(
            "full_name"
        )

        email = data.get(
            "email"
        )

        password = data.get(
            "password"
        )


        # Check fields

        if (

            not full_name
            or
            not email
            or
            not password

        ):

            return jsonify(

                {
                    "success": False,
                    "error":
                        "All fields are required."
                }

            ), 400


        # Connect database

        connection = get_db_connection()


        if connection is None:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Database connection failed."
                }

            ), 500


        # Create cursor

        cursor = connection.cursor()


        # Check existing email

        cursor.execute(

            """
            SELECT id
            FROM users
            WHERE email = %s
            """,

            (email,)

        )


        existing_user = cursor.fetchone()


        if existing_user:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Email already registered."
                }

            ), 409


        # Insert user

        cursor.execute(

            """
            INSERT INTO users
            (
                full_name,
                email,
                password_hash
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
            """,

            (
                full_name,
                email,
                password
            )

        )


        # Commit

        connection.commit()


        # Get user ID

        user_id = cursor.lastrowid


        return jsonify(

            {
                "success": True,

                "message":
                    "Account created successfully.",

                "user_id":
                    user_id,

                "full_name":
                    full_name
            }

        ), 201


    except Exception as e:

        print(
            "Signup Error:",
            repr(e)
        )


        if connection:

            connection.rollback()


        return jsonify(

            {
                "success": False,

                "error":
                    str(e)
            }

        ), 500


    finally:

        if cursor:

            cursor.close()


        if connection:

            connection.close()


# ==========================================================
# LOGIN API
# ==========================================================

@app.route(
    "/login",
    methods=["POST"]
)
def login():

    connection = None

    cursor = None

    try:

        data = request.get_json()


        if data is None:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "No data received."
                }

            ), 400


        email = data.get(
            "email"
        )

        password = data.get(
            "password"
        )


        if not email or not password:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Email and password are required."
                }

            ), 400


        connection = get_db_connection()


        if connection is None:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Database connection failed."
                }

            ), 500


        cursor = connection.cursor(
            dictionary=True
        )


        cursor.execute(

            """
            SELECT
                id,
                full_name,
                email,
                password_hash
            FROM users
            WHERE email = %s
            """,

            (email,)

        )


        user = cursor.fetchone()


        if user is None:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Invalid email or password."
                }

            ), 401


        # Compare password

        if password != user[
            "password_hash"
        ]:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Invalid email or password."
                }

            ), 401


        return jsonify(

            {
                "success": True,

                "message":
                    "Login successful.",

                "user_id":
                    user["id"],

                "full_name":
                    user["full_name"],

                "email":
                    user["email"]
            }

        ), 200


    except Exception as e:

        print(
            "Login Error:",
            repr(e)
        )


        return jsonify(

            {
                "success": False,

                "error":
                    str(e)
            }

        ), 500


    finally:

        if cursor:

            cursor.close()


        if connection:

            connection.close()


# ==========================================================
# DETECTION API
# ==========================================================

@app.route(
    "/detect",
    methods=["POST"]
)
def detect_changes():

    connection = None

    cursor = None


    try:

        # ==================================================
        # GET USER ID
        # ==================================================

        user_id = request.form.get(
            "user_id"
        )


        if not user_id:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "User ID is required."
                }

            ), 400


        try:

            user_id = int(
                user_id
            )

        except ValueError:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Invalid user ID."
                }

            ), 400


        # ==================================================
        # CHECK FILES
        # ==================================================

        if (

            "before_image"
            not in request.files

            or

            "after_image"
            not in request.files

        ):

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Both Before and After images are required."
                }

            ), 400


        before_file = request.files[
            "before_image"
        ]

        after_file = request.files[
            "after_image"
        ]


        if (

            before_file.filename == ""

            or

            after_file.filename == ""

        ):

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Please select both images."
                }

            ), 400


        # ==================================================
        # DATABASE CONNECTION
        # ==================================================

        connection = get_db_connection()


        if connection is None:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "Database connection failed."
                }

            ), 500


        cursor = connection.cursor()


        # ==================================================
        # CHECK USER EXISTS
        # ==================================================

        cursor.execute(

            """
            SELECT id
            FROM users
            WHERE id = %s
            """,

            (user_id,)

        )


        user_exists = cursor.fetchone()


        if not user_exists:

            return jsonify(

                {
                    "success": False,
                    "error":
                        "User does not exist."
                }

            ), 404


        # ==================================================
        # OPEN IMAGES
        # ==================================================

        before_image = Image.open(
            before_file
        )

        after_image = Image.open(
            after_file
        )


        # ==================================================
        # CREATE UNIQUE FILENAMES
        # ==================================================

        unique_id = uuid.uuid4().hex


        before_filename = (
            f"before_{unique_id}.png"
        )

        after_filename = (
            f"after_{unique_id}.png"
        )

        mask_filename = (
            f"mask_{unique_id}.png"
        )

        overlay_filename = (
            f"overlay_{unique_id}.png"
        )


        # ==================================================
        # SAVE BEFORE IMAGE
        # ==================================================

        before_save_path = os.path.join(

            BEFORE_FOLDER,

            before_filename

        )


        before_image.save(
            before_save_path
        )


        # ==================================================
        # SAVE AFTER IMAGE
        # ==================================================

        after_save_path = os.path.join(

            AFTER_FOLDER,

            after_filename

        )


        after_image.save(
            after_save_path
        )


        # ==================================================
        # RUN MODEL
        # ==================================================

        mask = predict_change(

            before_image,

            after_image

        )


        # ==================================================
        # CREATE OVERLAY
        # ==================================================

        overlay = create_overlay(

            after_image,

            mask

        )


        # ==================================================
        # CALCULATE METRICS
        # ==================================================

        changed_pixels = int(

            np.sum(

                mask > 0

            )

        )


        total_pixels = int(

            mask.size

        )


        change_percentage = (

            changed_pixels

            /

            total_pixels

        ) * 100


        # ==================================================
        # DETECTION STATUS
        # ==================================================

        if change_percentage > 1:

            detection_status = (
                "Change Detected"
            )

        else:

            detection_status = (
                "No Significant Change"
            )


        # ==================================================
        # CREATE MASK IMAGE
        # ==================================================

        mask_image = (

            mask * 255

        ).astype(

            np.uint8

        )


        mask_image = Image.fromarray(

            mask_image

        )


        # ==================================================
        # SAVE MASK
        # ==================================================

        mask_save_path = os.path.join(

            MASK_FOLDER,

            mask_filename

        )


        mask_image.save(

            mask_save_path

        )


        # ==================================================
        # SAVE OVERLAY
        # ==================================================

        overlay_image = Image.fromarray(

            overlay

        )


        overlay_save_path = os.path.join(

            OVERLAY_FOLDER,

            overlay_filename

        )


        overlay_image.save(

            overlay_save_path

        )


        # ==================================================
        # SAVE DETECTION TO MYSQL
        # ==================================================

        cursor.execute(

            """
            INSERT INTO detections
            (
                user_id,
                before_image,
                after_image,
                mask_image,
                overlay_image,
                changed_pixels,
                change_percentage,
                detection_status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """,

            (

                user_id,

                f"uploads/before/{before_filename}",

                f"uploads/after/{after_filename}",

                f"outputs/masks/{mask_filename}",

                f"outputs/overlays/{overlay_filename}",

                changed_pixels,

                round(
                    change_percentage,
                    2
                ),

                detection_status

            )

        )


        # ==================================================
        # COMMIT
        # ==================================================

        connection.commit()


        detection_id = cursor.lastrowid


        # ==================================================
        # RETURN RESPONSE
        # ==================================================

        return jsonify(

            {

                "success": True,

                "detection_id":
                    detection_id,

                "user_id":
                    user_id,

                "changed_pixels":
                    changed_pixels,

                "change_percentage":
                    round(
                        change_percentage,
                        2
                    ),

                "detection_status":
                    detection_status,

                "mask_url":
                    f"/outputs/mask/{mask_filename}",

                "overlay_url":
                    f"/outputs/overlay/{overlay_filename}"

            }

        ), 200


    except Exception as e:

        if connection:

            connection.rollback()


        print(

            "Detection Error:",

            repr(e)

        )


        return jsonify(

            {
                "success": False,

                "error":
                    str(e)
            }

        ), 500


    finally:

        if cursor:

            cursor.close()


        if connection:

            connection.close()



# ==========================================================
# SERVE BEFORE IMAGES
# ==========================================================

@app.route(
    "/uploads/before/<filename>",
    methods=["GET"]
)
def get_before_image(filename):

    return send_from_directory(
        BEFORE_FOLDER,
        filename
    )


# ==========================================================
# SERVE AFTER IMAGES
# ==========================================================

@app.route(
    "/uploads/after/<filename>",
    methods=["GET"]
)
def get_after_image(filename):

    return send_from_directory(
        AFTER_FOLDER,
        filename
    )



# ==========================================================
# SERVE MASK IMAGES
# ==========================================================

@app.route(
    "/outputs/mask/<filename>",
    methods=["GET"]
)
def get_mask(
    filename
):

    return send_from_directory(

        MASK_FOLDER,

        filename

    )


# ==========================================================
# SERVE OVERLAY IMAGES
# ==========================================================

@app.route(
    "/outputs/overlay/<filename>",
    methods=["GET"]
)
def get_overlay(
    filename
):

    return send_from_directory(

        OVERLAY_FOLDER,

        filename

    )


# ==========================================================
# RUN FLASK SERVER
# ==========================================================

if __name__ == "__main__":

    print(
        "Starting SatChange AI Backend..."
    )

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )