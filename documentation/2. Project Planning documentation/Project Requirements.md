# Project Requirements

| **Project Name** | Rakshak - Real-Time Weapon Detection System |
| :--- | :--- |
| **Problem Statement** | Public safety is a critical concern in environments like schools, airports, and large public gatherings. Traditional surveillance systems lack real-time intelligence and often rely on human operators to identify and respond to threats, which can lead to delays or missed threats. An automated, proactive system capable of detecting potential threats, such as weapons, in real time is essential to enhance safety and security in such environments.|
| **Background** | Surveillance systems have evolved significantly, with AI models now capable of real-time analysis and anomaly detection. By implementing an AI-driven system like Rakshak, which integrates object detection models with existing CCTV networks, real-time alerts can be generated to aid security personnel in responding swiftly to potential threats. |
| **Functional Requirements** | |
| **High Priority** | 1. Real-time monitoring and analysis of CCTV footage to detect potential weapon presence using YOLO (You Only Look Once) model |
| | 2. Integrating this AI model with the existing surveillance system network to stream live feeds and analyze multiple camera inputs simultaneously |
| | 3. Alert generation and notification to authorities in case a weapon is detected|
| | 4. User-friendly dashboard for security personnel to view alerts, manage responses, and access historical data |
| **Low Priority** | 1. Option to adjust model sensitivity and customize detection parameters per camera|
| | 2. Track individual objects across multiple camera feeds to provide a comprehensive view of potential threats |
|**Technical/Performance Requirements** | 1. **ReactJS** - ReactJS to design an attractive, intuitive interface for monitoring CCTV feeds, viewing alerts, and managing settings |
| | 2. **Flask** - Flask as the backend server to handle all API calls for data transfer between the frontend and backend, authentication, and alert notifications.|
| | 3. **PostgreSQL** - PostgreSQL database to store user information and historical data for future analysis |
| | 4. **Docker** - Docker containers for deploying the application, ensuring consistency across different environments |
