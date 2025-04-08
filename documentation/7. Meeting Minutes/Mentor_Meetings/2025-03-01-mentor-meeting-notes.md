# Mentor Meeting Notes

### Date: March 01, 2025  
### Attendees:  
- Tirth Patel  
- Yi Xu  
- Mr. Trevor Douglas  

## Agenda  
1. Demonstrate MVP 2 progress  
2. Discuss current architecture and detection delay  
3. Explore Celery + Redis for background task management  
4. Share alert enhancement ideas  

## Discussion Points

**1. MVP 2 Demonstration**  
- Presented a working version of Rakshak with real-time camera streaming and live weapon detection.  
- Python’s built-in `multiprocessing` module was used to handle streaming and detection in parallel.

**2. Detection Delay Observation**  
- We observed a slight delay between the weapon’s appearance and the alert being generated.  
- Trevor advised not to worry about the delay at this stage, explaining it’s primarily due to hardware limitations.  
- He reassured us that **latency would not be a major issue in production**, where **high-performance servers and GPUs** would be available.

**3. Task Management with Celery**  
- Tirth brought up the idea of using **Celery with Redis** to handle background tasks such as detection, streaming, and email alerts.  
- Trevor supported the approach, noting that moving heavy operations to background workers will help keep the **main server responsive and scalable**.

**4. Alert Notification Enhancements**  
- We are currently working on sending **captured weapon images** along with detection alerts.  
- Trevor appreciated the effort and emphasized the value of rich, informative alerts in real-world use cases.

## Next Steps  
1. Begin integrating **Celery + Redis** for background task execution.  
2. Test detection-to-alert latency under various loads.  
3. Finalize email alert functionality with **image attachments**.
