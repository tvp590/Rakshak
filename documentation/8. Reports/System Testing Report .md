# System Testing Report – Rakshak

## 1. Purpose  
The purpose of system testing is to validate the complete and integrated Rakshak application in a near-production environment. This includes real-time video streaming, AI detection, user actions, alerts, and coordination between all services.

---

## 2. Scope  
This testing covered:

- User Authentication & Authorization  
- Live CCTV Feed Management  
- AI-based Weapon Detection  
- Real-time WebSocket Alert Notifications  
- Email Notification System  
- Background Task Processing (Celery + Redis)  
- Role-Based Access Control  
- Individual & Global Stream Controls  
- User and CCTV Management  
- Frontend, Backend, and AI Model Integration

---

## 3. Testing Environment

| Component      | Details                              |
|----------------|--------------------------------------|
| Frontend       | Next.js (Docker container)           |
| Backend        | Flask + Gunicorn (Docker container)  |
| AI Model       | YOLOv11                              |
| Task Queue     | Redis + Celery                       |
| Video Streaming| FFmpeg (HLS-based)                   |
| Reverse Proxy  | NGINX (HTTPS & routing)              |
| Database       | PostgreSQL (Docker container)        |
| Hosting        | Localhost + internal Docker network  |

---

## 4. Testing Objectives

- Verify full-system functional correctness  
- Ensure smooth integration between modules  
- Validate alert delivery through both dashboard and email  
- Check UI responsiveness under concurrent load  
- Test behavior under edge cases (e.g., stream loss, email failure)

---

## 5. Test Scenarios and Results

| Test ID | Scenario                                               | Expected Outcome                                           | Result     | Comments                                                           |
|--------:|--------------------------------------------------------|------------------------------------------------------------|------------|--------------------------------------------------------------------|
| 1       | Full user journey (Register → Login → View Feeds → Logout) | User navigates successfully through complete flow         | Success    |                                                                    |
| 2       | Weapon appears in live feed                            | Real-time alert appears, and email is sent                 | Success    |                                                                    |
| 3       | System handles simultaneous alerts                     | Alerts do not overlap, and all are delivered properly      | Success    |                                                                    |
| 4       | Celery tasks for detection & email run in background   | UI remains responsive; backend processes continue          | Success    |                                                                    |
| 5       | Streams started/stopped globally from UI               | All cameras respond accordingly                            | Success    |                                                                    |
| 6       | Admin updates user role while feeds are active         | Feeds continue running, and user updates are applied       | Success    |                                                                    |
| 7       | One component (email service) temporarily fails        | Detection still works; email retries fail gracefully       | Partial    | Email failed silently; no retry policy or fallback mechanism yet   |
| 8       | Access restricted route as unauthorized user           | System redirects to login page                             | Success    |                                                                    |
| 9       | Alert metadata (time, image, location) verified        | Accurate metadata shown in dashboard and email             | Success    |                                                                    |
| 10      | Remove and re-add same CCTV                            | System reflects changes instantly without duplication      | Success    |                                                                    |
| 11      | Concurrent CCTV streaming and detection              | Detection and stream tasks run in parallel   | Partial    | Minor delay observed due to hardware limitations during YOLO inference |                                                                  |
| 12      | Multiple users logged in at once (from different browser) | Each user sees only their institution’s data              | Success    |                                                                    |
| 13      | Rapid start/stop on a single stream                    | System handles repeated toggles without crashing           | Success    |                                                                    |
| 14      | AI model fails or times out                            | System logs error; UI remains functional                   | Success    |                                                                    |
| 15      | WebSocket connection drops during detection            | Connection is re-established; alerts resume                | Success    |                                                                    |
| 16      | Multiple users receive real-time alerts and admin can reject them | All users are logged in; an alert is triggered            | Success    |                                                                    |


---

## 6. Observations

- System remained **stable and responsive** throughout testing  
- Real-time detection and alert delivery worked reliably  
- Background tasks prevented UI blocking and improved performance  
- Only minor gap identified: **no retry or fallback logic** for failed email alerts

---

## 7. Conclusion

Rakshak passed all major system tests, proving that the full-stack application is stable, accurate, and ready for further deployment. Integration between the frontend, backend, and AI logic is seamless, with background processing ensuring scalability.  
As the Rakshak development team, we acknowledge the need for retry logic in the email alert system and plan to address this in future iterations to further improve system reliability.

