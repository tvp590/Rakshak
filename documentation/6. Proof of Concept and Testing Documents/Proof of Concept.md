## Proof of Concept: YOLO Model for Weapon Detection in Rakshak Project

### Introduction

This document outlines the Proof of Concept (PoC) for the weapon detection system in the `Rakshak` project. The core of this PoC is the implementation of the `YOLO (You Only Look Once)` model for detecting weapons in video feeds. At this stage, the focus is on proving that the YOLO model can successfully detect weapons in real-time video streams. 

### Objective

The goal of this PoC is to demonstrate that the YOLO model can detect weapons from a video input, whether it’s a pre-recorded video or a live camera feed. This serves as a foundation for integrating the weapon detection capabilities into the larger Rakshak system, which will eventually include front-end interfaces, back-end logic, and alert systems.

### Implementation Details

1. **Model Used**
   - **YOLOv11**: The YOLO model chosen for this project is [YOLOv11](https://github.com/ultralytics/ultralytics), which is known for its high accuracy and fast processing speeds. The model was pre-trained on a general object detection dataset and has been trained and fine-tuned to detect weapons on a custom dataset.
   - **Libraries and Frameworks**: The implementation relies on Python, OpenCV for video processing, and the Ultralytics YOLOv11 library for the model.
  
2. **Dataset**
   - **Multiple Datasets**: Multiple datasets were downloaded and combined, with good-quality data sourced from platforms like Kaggle and Roboflow.
   - **Data Labeling**: The dataset used for training the model was manually labeled with bounding boxes using the **Roboflow framework**. This allowed for custom labeling of weapon types, ensuring that the model was trained specifically for weapon detection tasks.
  
3. **Model Trainiing**
   - The University of Regina's headless `Lambda` server was used to train the weapon detection model multiple times, with slight fine-tuning applied during each training session. For more details about the training process, please refer to the documentation in this [issue](https://github.com/tvp590/rakshak-ai-model/issues/1).
  
4. **Results**
   - **Weapon Detection**: If a weapon is detected, the model draws a bounding box around it and assigns a confidence score.
   - **Output**: The output was saved as processed video with annotations.
  
5. **Model Evaluation**
   - **Accuracy**: 
     - The model was able to correctly detect weapons in several test videos, although there were some false positives and false negatives depending on the video quality and resolution.
     - From the training so far, we have achieved `85% precision` (accuracy in detecting weapons) and around `75% recall` (True Positive Rate).
   - **Processing Speed**: 
     - The model was able to process each frame at a reasonable speed, suitable for real-time application.
  
### Challenges Encountered

- **Manually Labeling Data**: A significant challenge was the time-consuming process of manually labeling data for training. Since the dataset required specific annotations for weapon objects in diverse scenarios, this process took considerable effort and was prone to human error. Since accurate labels are crucial for effective training, this manual labeling process slowed down the dataset preparation.
  
- **False Positives and False Negatives**: The primary challenge during testing was dealing with false positives (non-weapons detected as weapons) and false negatives (weapons not detected). This can be improved with further fine-tuning of the model or training on a more specialized weapon detection dataset.
  
### Next Steps
- **Fine-Tuning the Model**: We will experiment with modifying hyperparameters like learning rate, optimizer, etc., for better accuracy.
- **Integration**:  Integrate the model with `Rakshak` system.
- **Frontend and Backend Development**: Start developing the frontend and backend systems to support the model's deployment, including user interfaces and API endpoints for seamless interaction.
- **Testing**: Test in various camera angles, lighting conditions, and real-world scenarios to evaluate performance in a production environment.
  

### Conclusion

This Proof of Concept demonstrates that weapon detection using YOLO is feasible within the Rakshak project. The model successfully detects weapons in video streams, and further improvements can be made in accuracy and performance. The next steps will involve integrating this functionality into a complete system with alerting capabilities and real-time video processing.