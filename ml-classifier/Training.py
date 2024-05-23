import os
import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from tensorflow.keras.utils import to_categorical

# Step 2: Prepare the Dataset
dataset_path = "images"
class_names = ['camp', 'soldier', 'tank']
image_size = (224, 224)  # Smaller image size for MobileNet

# Function to load and preprocess images from a folder
def load_images_from_folder(folder, label, images, labels):
    for filename in os.listdir(folder):
        img = cv.imread(os.path.join(folder, filename))
        if img is not None:
            img = cv.resize(img, image_size)
            img = img / 255.0
            images.append(img)
            labels.append(label)

train_images, train_labels = [], []
test_images, test_labels = [], []

# Load images for each class
for idx, class_name in enumerate(class_names):
    folder_path = os.path.join(dataset_path, class_name)
    all_images, all_labels = [], []
    load_images_from_folder(folder_path, idx, all_images, all_labels)
    split_idx = int(0.8 * len(all_images))
    train_images.extend(all_images[:split_idx])
    train_labels.extend(all_labels[:split_idx])
    test_images.extend(all_images[split_idx:])
    test_labels.extend(all_labels[split_idx:])

    # Debug: print the number of images loaded for each class
    print(f"Loaded {len(all_images)} images for class '{class_name}'")

# Shuffle the training and testing data
train_data = list(zip(train_images, train_labels))
test_data = list(zip(test_images, test_labels))
np.random.shuffle(train_data)
np.random.shuffle(test_data)
train_images, train_labels = zip(*train_data)
test_images, test_labels = zip(*test_data)

train_images = np.array(train_images)
train_labels = np.array(train_labels)
test_images = np.array(test_images)
test_labels = np.array(test_labels)

# Convert labels to categorical
train_labels = to_categorical(train_labels, num_classes=len(class_names))
test_labels = to_categorical(test_labels, num_classes=len(class_names))

# Step 3: Visualize Some Training Images
for i in range(16):
    plt.subplot(4, 4, i + 1)
    plt.xticks([])
    plt.yticks([])
    plt.imshow(train_images[i])
    plt.xlabel(class_names[np.argmax(train_labels[i])])

plt.show()

# Step 4: Define and Train the Model
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze the base model

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(64, activation='relu'),
    layers.Dense(len(class_names), activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10, validation_data=(test_images, test_labels))

# Step 5: Evaluate the Model
loss, accuracy = model.evaluate(test_images, test_labels)
print(f"loss: {loss}")
print(f"accuracy: {accuracy}")

# Step 6: Save the Trained Model
model.save("custom_image_classifier.keras")

# Step 7: Load the Trained Model for Inference
model = models.load_model('custom_image_classifier.keras')

# Example Inference
predictions = model.predict(test_images[:5])
for i, prediction in enumerate(predictions):
    print(f"Predicted class for test image {i}: {class_names[np.argmax(prediction)]}")
