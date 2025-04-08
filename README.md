# Rakshak - Real-Time Weapon Detection System

## Project Idea

Our team aims to develop an innovative **Real-Time Weapon Detection Surveillance System** called **Rakshak**. This system is designed to enhance public safety by providing real-time weapon detection in surveillance footage. By leveraging AI and machine learning, **Rakshak** enables instant alerts for potential threats, helping authorities respond quickly and mitigate risks in critical environments.


## Project Background

**Rakshak**, meaning `protector` or `guardian` in Hindi and Sanskrit, reflects our mission to enhance safety in public spaces. With the rise in safety concerns at schools, universities, and public spaces due to incidents involving weapons, it’s crucial to find effective ways to keep everyone safe. Traditional surveillance systems depend on human operators, which can sometimes lead to delays in identifying threats. **Rakshak** aims to change that by using advanced technology to automatically detect weapons in real time. This way, security teams can receive instant alerts and respond quickly to any potential danger.

By implementing **Rakshak** in various environments, we hope to create a safer atmosphere for all individuals present. The system not only enables security personnel to act promptly but also provides peace of mind, knowing that an extra layer of protection is in place. This innovative approach to surveillance is designed to make our public areas and venues safer for everyone.

## Project Vlogs

- [Vlog1](https://youtu.be/uRUrYmM65Us) 
- [Vlog2](https://youtu.be/H9dpu83g6AI)
- [Vlog3](https://youtu.be/WIFGDbpcr58)
- [Commercial Video](https://www.youtube.com/watch?v=TfI7RbCMGm0)


## Team Members

- **Tirth V Patel**  
  - Team Lead, Full Stack Developer, AI Engineer, System Architect  
- **Yi Xu**  
  - Documentation Specialist, UI/UX Designer, QA Engineer, Poster & Video Designer


##  Tech Stack

| Layer        | Technologies Used                                           |
|--------------|-------------------------------------------------------------|
| **Frontend** | Next.js (React + TypeScript)                                |
| **Backend**  | Flask, Gunicorn                                             |
| **AI Model** | YOLOv11 (custom-trained for weapon detection)               |
| **Task Management** | Celery (for background processing tasks)             |
| **Task Queue** | Redis                                                     |
| **Database** | PostgreSQL                                                  |
| **Streaming**| FFmpeg (for HLS live stream generation)                     |
| **Reverse Proxy** | NGINX                                                  |
| **Deployment** | Docker, Docker Compose                                    |



<br />

--- 

<br />

##  Developer Setup Guide

> To run Rakshak locally, follow the steps below:

---

### 1. Clone the Repository

Clone the project and enter the root directory:

```bash
git clone https://github.com/tvp590/Rakshak.git
cd Rakshak
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Then open the `.env` file in any text editor and follow the comment instructions provided next to each variable to complete the setup.


### 3. Build and Run the Project (Docker Compose)

```bash
docker compose up --build -d
```

This will start the following services:
- Flask API (backend)
- Celery worker (background task execution)
- Redis (task queue)
- PostgreSQL (database)
- Next.js (frontend dashboard)
- NGINX (reverse proxy)


### 4. Add YOLOv11 Model Weights
Ensure you place your trained YOLO model in the correct directory:

```bash
Rakshak/code/backend/app/yolo_model/best.pt
```
> This `best.pt` model will be used for real-time weapon detection.


### 5. Access the Application

Once the services are up and running, you can access the application at:

```bash
  http://localhost/login
```

> From there, users can log in and navigate through the full application (dashboard, feeds, alerts, etc.) — all routed through NGINX.