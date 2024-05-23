import cv2 as cv
import numpy as np
from tensorflow.keras.models import load_model

# Load the saved model
model = load_model('custom_image_classifier.keras')

# Define class names
class_names = ['camp', 'soldier', 'tank']
image_size = (224, 224)  # Ensure dimensions match the training image size

# Function to capture image from a webcam, compress it, and send it to the model
def capture_and_classify(model, class_names, output_file):
    cap = cv.VideoCapture(0, cv.CAP_DSHOW)  # Use DirectShow backend
    if not cap.isOpened():
        print("Error: Could not open video device.")
        return

    with open(output_file, 'w') as f:
        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame.")
                break

            frame_count += 1
            if frame_count % 5 != 0:  # Skip frames to reduce processing load
                continue

            # Resize and preprocess the frame
            img = cv.resize(frame, image_size)  # Ensure dimensions are correct
            img = img / 255.0
            img = np.expand_dims(img, axis=0)

            # Make a prediction
            prediction = model.predict(img)
            predicted_class_idx = np.argmax(prediction)
            predicted_class = class_names[predicted_class_idx]
            confidence = prediction[0][predicted_class_idx] * 100

            # Draw the bounding box and label
            label = f"{predicted_class}: {confidence:.2f}%"
            cv.putText(frame, label, (10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv.LINE_AA)
            cv.rectangle(frame, (10, 40), (image_size[1] - 10, image_size[0] - 10), (0, 255, 0), 2)

            # Display the frame
            cv.imshow('Webcam Feed', frame)

            # Write the prediction to the file
            f.write(f"Predicted class: {predicted_class}, Confidence: {confidence:.2f}%\n")
            print(f"Predicted class: {predicted_class}, Confidence: {confidence:.2f}%")

            # Exit on pressing 'q'
            if cv.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv.destroyAllWindows()

# Start capturing and classifying
capture_and_classify(model, class_names, 'predictions.txt')
