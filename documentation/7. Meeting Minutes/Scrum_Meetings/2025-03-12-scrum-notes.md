# Scrum Meeting Notes  
### Date: March 12, 2025  

### Attendees:
- Tirth Patel  
- Yi Xu  
- Mr. Adam Tilson  

### Agenda  
1. Present MVP 3 progress and system stability  
2. Review alert generation and notification features  
3. Discuss potential Celery + Redis integration for background processing  

### Discussion Points  

**1. MVP 3 Progress Update**  
- We demonstrated a working version of Rakshak with stable **live streaming** and **weapon detection** features.  
- The detection alerts are now successfully being triggered and displayed on the dashboard.  
- **Email notifications** are also functioning correctly when a weapon is detected.

**2. Upcoming Feature – Image Alerts**  
- We shared our plan to include **captured weapon images** in alert emails to improve context and user response.  
- This enhancement is planned for MVP 4.

**3. Celery + Redis Discussion**  
- Tirth brought up the idea of using **Celery and Redis** to offload detection, streaming, and email tasks to background workers.  
- Adam supported the idea, highlighting that separating background tasks would improve system responsiveness and scalability.  
- We agreed that this integration should begin soon to prepare for final demo performance.

### Next Steps  
1. Begin integrating **Celery + Redis** for handling background tasks.  
2. Implement the feature to **attach weapon images** in detection alert emails.  
3. Continue testing MVP 3 under different load scenarios to ensure consistent performance.
