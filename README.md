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
