Quizzer


A full-stack, production-deployed quiz application for learners and educators, featuring multiple study modes and a clean, responsive interface.

Features

Multiple-choice questions, full-length quizzes, themed collections, and flashcards for active recall, all backed by persistent SQL storage.

Tech Stack

Frontend: HTML5, CSS3, JavaScript (React/Vue)
Backend: Java, Spring Boot, JPA/Hibernate, PostgreSQL/MySQL, REST APIs
DevOps: Docker, Git/GitHub

Architecture

A Spring Boot backend built around three core domain models (Quizzes, Questions, and Collections) with tightly managed JPA relationships that maintain referential integrity automatically. Spring Data repositories handle CRUD operations, and a RESTful JSON API connects cleanly to the frontend.

Key highlights:

Clean separation of concerns across the data, service, and API layers
Centralized configuration for CORS, database connectivity, and error handling
Fully containerized with Docker for consistent, portable deployment
Production-ready via Spring Boot actuators, profiles, and logging

Run it yourself

Requires only Docker and Docker Compose - no local Java, Maven, or Node install needed.

    git clone <this-repo-url>
    cd Abdul-s-Full-Stack-Quiz-App
    docker-compose up --build

Then open http://localhost:3000 in a browser. Quizzes are stored in a Postgres database in a Docker volume, so they persist across restarts (`docker-compose down` keeps the data, `docker-compose down -v` wipes it).

The backend API is reachable directly at http://localhost:8080/api/quizzes, and its health check at http://localhost:8080/actuator/health.
