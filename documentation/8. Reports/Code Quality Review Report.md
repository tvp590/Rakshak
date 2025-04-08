# Code Quality & Software Evaluation Report – Rakshak

**Project Name:** Rakshak – Real-Time Weapon Detection System  
**Review Date:** April 1, 2025   <br >
**Prepared By:** Rakshak Development Team  

---

## 1. Introduction

As part of our capstone project, we developed **Rakshak**, a real-time weapon detection system designed to monitor live CCTV feeds and trigger alerts upon detecting firearms. In this report, we evaluate the quality and robustness of the codebase we built, focusing on software design, security, maintainability, scalability, and reliability.

Our goal was not only to build a functional system, but also to ensure the code supporting it is clean, extensible, and production-ready.

---

## 2. Design Principles

We designed Rakshak with clarity and modularity in mind. Key design principles we focused on include:

- **Separation of Concerns:** Each major responsibility — video streaming, AI detection, user management, alerting — was developed as a distinct module.
- **Modularity:** We ensured our code was broken into reusable, loosely coupled components.
- **Scalability by Design:** From the beginning, we built Rakshak with the ability to scale to multiple cameras and users.
- **Simplicity:** We avoided unnecessary complexity, keeping logic clean and readable.

In retrospect, we are proud of the balance we achieved between system complexity and developer experience.

---

## 3. Code Quality

We maintained consistent code formatting across all components. On the frontend, we used **ESLint** to enforce code style and catch common issues. However, the backend currently lacks an automated linter, and formatting was done manually.

We used meaningful naming conventions, concise functions, and clear logic.  
We avoided deep nesting, duplicated logic, and hardcoded values as much as possible.  
We organized our folders and components for readability and future growth.

That said, we recognize that adding more inline documentation and comments — especially in our Celery tasks and model inference logic — would improve onboarding for new developers. We also plan to introduce linting tools like `flake8` or `black` in the backend to maintain consistency going forward.


---

## 4. Security

Security was a major focus given the sensitive nature of weapon detection. Here's what we implemented:

- **Flask-Login with server-side sessions**: We used server-managed sessions to ensure that only a session ID is stored in the browser. This approach avoids exposing any personal or sensitive user information on the client side.
- **On-premise deployment**, which ensures privacy and avoids third-party cloud storage.
- Access to critical pages (like user management) is role-restricted.
- Environment variables are used for secrets like Redis URLs and email credentials.

Moving forward, we plan to add rate limiting and input sanitization on form endpoints, along with stricter NGINX rules for request validation.

---

## 5. Maintainability

We structured the project so each component can be improved or replaced without affecting others:

- Our AI model is decoupled from the **streaming task**, allowing independent updates and experimentation.
- Redis and Celery workers handle background tasks, keeping the main application responsive.
- The codebase is readable, well-organized, and consistent across modules.

During testing, we were able to upgrade the YOLO weights, refactor UI components, and reconfigure Docker services with minimal friction — demonstrating the flexibility and modularity of our system.

To further improve maintainability, we plan to add detailed developer documentation and setup instructions to support future contributors.


---

## 6. Reliability

Rakshak was built to handle real-time use cases, and reliability was a core focus throughout development. We implemented:

- **Background task execution** using Celery and Redis, covering:
  - **Streaming tasks** (starting and stopping camera feeds)
  - **Detection tasks** (running the AI model on video frames)
  - **Email alert tasks** (sending notifications on weapon detection)
- **Redundant alerting** via both the dashboard and email, ensuring detection events are not missed.

By moving these operations to background tasks, our frontend and main backend server stay fast and responsive. This means users can still navigate the dashboard or manage feeds smoothly, even when heavy detection or stream processing tasks are running in the background.


Reliability during testing was strong — all critical tasks ran smoothly under normal conditions. However, we did notice that if the email service failed (e.g., SMTP server down), the system did not retry sending the alert. In future iterations, we plan to introduce **Celery retry policies** and basic **failure monitoring tools** to improve fault recovery and system resilience.


---

## 7. Scalability

We intentionally used a service-oriented structure to help Rakshak grow:

- Multiple CCTV streams are handled using isolated FFmpeg processes.
- Each AI detection task runs independently, allowing horizontal scaling.
- Web-based access allows multiple users to monitor alerts concurrently.

We acknowledge that for production-scale deployments, we’ll need to integrate camera zones, feed grouping, and real-time metrics (like GPU usage) to support dozens or hundreds of cameras efficiently.

---
## 8. Architecture

Our software architecture was kept clean, layered, and modular:

- **Frontend:** Built with Next.js (React + TypeScript), responsible for the overall user interface including live CCTV feeds, current alerts, alert history, user and CCTV management.
- **Backend:** Flask handles core backend logic, with **Gunicorn** serving as the production WSGI server.
- **Task Queue System:** Celery is used to run background tasks (streaming, detection, email), with **Redis** acting as the message broker and task state manager (e.g., stream PIDs, task IDs).
- **AI Engine:** A custom YOLO-based weapon detection model processes frames and sends detection results to the system.
- **Reverse Proxy:** NGINX handles HTTPS termination and routes traffic to the appropriate backend or frontend services.

This structure allowed us to work in parallel and debug each component in isolation. Using Docker Compose, we were able to orchestrate all services consistently across both development and deployment environments.


---

## 9. Error Handling & Fault Tolerance

Throughout development, we implemented several strategies to improve fault tolerance:

- All background tasks are queued and tracked using Redis, ensuring the main server remains unblocked during processing.
- We handle timeouts, detection errors, and frame decoding failures gracefully to prevent system crashes.
- Email alerts act as a fallback notification method in case the dashboard alert is missed.

However, we currently lack a centralized logging system, automated alerting (e.g., Slack or email notifications for failed tasks), and retry mechanisms for critical operations like email delivery or detection failures. These improvements are part of our future enhancement roadmap.


---

## 10. Final Reflection

As a team, we are proud of the code and system we’ve built. Rakshak is not only functional — it’s structured, readable, and resilient. We applied core software engineering principles, kept security in mind, and ensured modularity for future teams or real-world deployments.

There’s room for growth — especially in testing, automation, and monitoring — but Rakshak provides a strong foundation for AI-driven surveillance tools.

---

## 11. Future Improvements

- Implement CI/CD with automated linting and Docker builds.
- Introduce logging dashboards and error alerts.
- Create setup documentation and onboarding guides for new developers.


