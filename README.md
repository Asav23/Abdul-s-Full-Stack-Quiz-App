📚 Quiz App

A full-stack quiz application currently live in production.
Designed for learners, educators, and anyone who enjoys testing their knowledge, the app includes multiple learning modes and a clean, responsive interface.

🎮 Features

📝 Multiple Choice Questions (MCQs) – Quick and focused challenges

📊 Full Quizzes – Longer assessments for deeper evaluation

🗂 Collections – Organize quizzes into themed sets

🃏 Flashcards – Strengthen memory through active recall

💾 Persistent Storage – All data stored in a SQL database

🚀 Production Ready – Fully containerized and deployed

🛠 Tech Stack
Frontend

HTML5, CSS3, JavaScript (or React/Vue if used)

Backend

Java Spring Boot

JPA / Hibernate ORM

MySQL or PostgreSQL

RESTful APIs

DevOps

Docker

Git & GitHub

🧩 Backend Architecture

The backend is built with Java Spring Boot, providing a clear and organized structure for handling application logic, database operations, and communication with the frontend. It is designed for scalability, maintainability, and clean separation of responsibilities.

🧠 Domain Model & Data Layer

The core of the backend revolves around three main concepts:

Quiz

A quiz represents a complete set of questions under a single topic or theme.
Each quiz includes:

A unique name

A collection of questions that belong exclusively to that quiz

Automatic updating and removal of related questions when the quiz is modified

The relationship between quizzes and questions is tightly managed so that data always remains consistent.

Question

A question holds:

The question text

The correct answer

A direct connection to the quiz it belongs to

Every question is linked to exactly one quiz, ensuring structured data and clear hierarchy.

Collections

Collections allow multiple quizzes to be grouped into larger sets, such as “Math Basics,” “Programming Essentials,” or “History Review.”
They make it easy for users to organize content and expand the system with themed categories.

The backend uses Spring Data JPA repositories to handle all database interactions, providing efficient and standardized CRUD operations for quizzes, questions, and collections.

🌐 REST API Design

The backend exposes a well-organized REST API that the frontend uses to:

Create, retrieve, update, and delete quizzes

Add or remove questions from quizzes

Fetch questions for gameplay modes

Manage quiz collections

The APIs follow predictable naming and response patterns, making integration simple and reliable.
All data is exchanged using JSON, ensuring compatibility with modern frontend frameworks.

🔧 Application Configuration

The backend includes centralized configuration for:

CORS, ensuring the frontend (e.g., Vite/React) can communicate with the backend during development

Database connectivity, using environment variables or configuration files

Error handling, so the API returns clear and informative messages

Spring Boot’s auto-configuration allows the application to remain lightweight while still supporting complex features.

🗄 Database Integration

Data is stored in a relational SQL database (MySQL or PostgreSQL).
Key backend responsibilities include:

Mapping Java entities to database tables via JPA

Managing relationships between quizzes, questions, and collections

Ensuring dependent data is created or removed together when necessary

Maintaining referential integrity automatically

The structure makes it easy to scale or introduce new features without restructuring the entire database.

🚀 Deployment & Production Setup

The backend is fully Dockerized, which means:

The environment is consistent across machines

Deployment to any cloud platform is straightforward

Scaling horizontally or vertically is simple

Combined with Spring Boot’s production-ready features (actuators, profiles, logging), the backend runs reliably under real-world workloads.
