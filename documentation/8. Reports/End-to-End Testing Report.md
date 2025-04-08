# End-to-End Testing Report

## Introduction
To ensure our application works as expected for different user roles, the End-to-end (E2E) testing is performed to validate the full functionality of the system from user action to final output.  

The E2E test covers the following sections: 
- User Login & Authentication
- Weapon Detection Workflow
- Alert Notification System
- Real-Time WebSocket Communication
- Security & API Authorization
- Role-based Access Control

## Testing Environment

- Frontend: Next.js (Docker Container)
- Backend: Flask + Gunicorn (Docker Container)
- Reverse Proxy: Nginx (Docker Container)
- Database: PostgreSQL

## Test cases

### Normal User
## ✅ End-to-End Testing Report – Normal User

| Test ID | Test Description            | Precondition                                           | Test Steps                                                                                                 | Expected Result                                                  | Actual Result |
|---------|-----------------------------|--------------------------------------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------------|
| 1       | User registers successfully | Rakshak is set up for the institution; code is provided by admin | 1. Enter name, email, and password<br>2. Confirm password<br>3. Enter institution code<br>4. Click Sign Up | Account is registered and user is redirected to login page      | Success       |
| 2       | User logs in                | User account is registered                             | 1. Enter email and password<br>2. Click Log In                                                            | User logs in and is redirected to the CCTV feeds page            | Success       |
| 3       | View live camera feeds      | Admin has started the streams; user is logged in       | 1. Navigate to the CCTV feeds page                                                                        | All active CCTV feeds are displayed concurrently                 | Success       |
| 4       | Zoom in on camera feed      | Cameras are added and streaming is active              | 1. Click the "Zoom In" button on a feed                                                                   | Feed expands to full screen                                      | Success       |
| 5       | Receive detection alert     | WebSocket connection is active                         | 1. Weapon appears<br>2. Alert is triggered                                                                | Alert appears on user’s dashboard                                | Success       |
| 6       | Receive email alert         | Detection alert has been triggered                     | 1. Wait for the system to send an email notification after detection                                      | Email with alert details is received in user’s inbox             | Success       |
| 7       | Unauthorized API request    | User is not logged in                                  | 1. Enter a protected API URL in browser<br>2. Press Enter                                                 | User is redirected to login page                                 | Success       |
| 8       | User logs out               | User is logged in                                      | 1. Click top-right user menu<br>2. Click "Logout"                                                         | User is logged out and redirected to login page                  | Success       |


### Site Admin
| Test ID | Test Description                        | Precondition                                          | Test Steps                                                                                                     | Expected Result                                                    | Actual Result |
|---------|------------------------------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|---------------|
| 1       | Site Admin registers successfully        | Rakshak system is set up                              | 1. Enter name, email, and password<br>2. Confirm password<br>3. Enter institution code<br>4. Click Sign Up     | Account is registered and admin is redirected to login page        | Success       |
| 2       | Site Admin logs in                       | Admin account is registered                           | 1. Enter email and password<br>2. Click Log In                                                                 | Admin logs in and is redirected to CCTV feeds page                 | Success       |
| 3       | View live camera feeds                   | Streams have been started by the admin                | 1. Navigate to CCTV feeds page                                                                                | Active camera feeds are displayed in real-time                     | Success       |
| 4       | Start and stop camera stream             | CCTVs are added and active                        | 1. Go to the CCTV Feeds page<br>2. Click Start or Stop on a specific feed                                            | Stream starts or stops as requested                                | Success       |
| 5       | Start and/or stop all camera streams (Global) | CCTVs are added and active                        | 1. Go to the CCTV Feeds page<br>2. Click the **Start All** or **Stop All** button in the top-left corner               | All streams start and/or stop as requested                         | Success       |
| 6       | Zoom in on camera feed                   | Feeds are active                                      | 1. Click "Zoom In" on a specific camera feed                                                                  | Feed expands to full screen                                        | Success       |
| 7       | Receive real-time alert notification     | Weapon appears on live feed                           | 1. Trigger AI model by showing weapon<br>2. Wait for WebSocket alert                                           | Real-time alert banner appears on dashboard                        | Success       |
| 8       | Receive email alert                      | Detection alert is triggered                          | 1. Wait for system to send email alert                                                                        | Email with alert image and metadata is received                    | Success       |
| 9       | View current alerts                      | Alerts have been triggered                            | 1. Go to Current Alerts page<br>2. Click "View Details"                                                       | Alert details are shown                                            | Success       |
| 10       | View alert history                       | Past alerts exist                                     | 1. Go to Alert History page<br>2. View previous alerts                                                        | Alert history is displayed successfully                            | Success       |
| 11      | Add a new CCTV                           | New camera is installed                               | 1. Navigate to Manage CCTV<br>2. Click "Add New"<br>3. Fill in form<br>4. Click "Add"                         | New CCTV feed is added successfully                                | Success       |
| 12      | Search and update CCTV                   | Multiple CCTV feeds exist                             | 1. Use search bar to find camera<br>2. Click "Edit"<br>3. Change name/location<br>4. Click Save               | CCTV feed is updated successfully                                  | Success       |
| 13      | Remove a CCTV feed                       | Camera exists                                         | 1. Search for specific CCTV<br>2. Click "Remove"<br>3. Confirm deletion                                        | Camera feed is removed successfully                                | Success       |
| 14      | Add a new user                           | Admin has access to user management                   | 1. Go to Manage Users<br>2. Click "Add User"<br>3. Fill in details<br>4. Click Save                           | New user is added successfully                                     | Success       |
| 15      | Search and update user details           | Multiple users exist                                  | 1. Search for a user<br>2. Click "Edit"<br>3. Update role or details<br>4. Click Save                         | User profile is updated successfully                               | Success       |
| 16      | Remove a user                            | User exists                                           | 1. Search for specific user<br>2. Click "Remove"<br>3. Confirm deletion                                        | User is removed from the system                                    | Success       |
| 17      | Unauthorized API access                  | Admin is logged out                                   | 1. Enter a protected API URL directly in browser                                                              | Admin is redirected to login page                                  | Success       |
| 18      | Site Admin logs out                      | Admin is logged in                                    | 1. Click user menu<br>2. Click "Logout"                                                                       | Admin is logged out and redirected to login page                   | Success       |


<br >

## Conclusion:
The end-to-end testing of the Rakshak system was conducted successfully, covering all critical functionalities for both Normal User and Site Admin roles. The tests validated the system's performance in real-world scenarios, ensuring that all components work together seamlessly to provide a reliable and efficient security solution.