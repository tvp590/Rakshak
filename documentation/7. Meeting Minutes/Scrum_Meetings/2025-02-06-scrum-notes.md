# Scrum Meeting Notes
### Date: February 06, 2025

### Attendees:
- Tirth Patel  
- Yi Xu  
- Mr. Adam Tilson  
- Other fellow capstone classmates

### Agenda
1. Discuss dataset improvements and model performance.  
2. Showcase progress on HLS streaming for real-time CCTV feeds.  
3. Evaluate the performance of the new weapon detection model.  

### Discussion Points

**1. Dataset and Model Performance**  
- Yi Xu developed and annotated a new dataset with 9,600 total images, including 2,515 images of police carrying weapons and 2,500 of unknown individuals carrying weapons. The rest of the images were various types of guns.  
- Unfortunately, the model's performance was lower than expected with 55% accuracy and 53% recall.  
- Adam suggested using the previously trained model (85% accuracy and 75% recall) and incorporating a new binary classification model to identify who is carrying the weapon (police or unknown).  

**2. HLS Streaming and Real-Time CCTV Feed**  
- We discussed the development of a streaming server for real-time CCTV feed streaming using HLS.  
- YOLO inference was taking around 50ms per frame, which was not ideal for real-time streaming.  
- It was decided that the weapon detection process would be moved to an asynchronous, separate process to improve the system's performance and ensure smoother streaming.  

### Next Steps
1. Implement the asynchronous processing for weapon detection in a separate process.  
2. Incorporate the binary classification model for detecting whether a police officer or an unknown individual is carrying the weapon.  
3. Continue improving the HLS streaming setup and optimize it for real-time performance.
