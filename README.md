📚 Quiz App

A full-stack quiz application currently live in production.
Designed for learners, educators, and anyone who enjoys testing their knowledge, the app offers multiple engaging modes and a clean, responsive interface.

🎮 Features

📝 Multiple Choice Questions (MCQs) – Quick and focused challenges for rapid learning

📊 Full Quizzes – Longer tests for a complete evaluation of knowledge

🗂 Collections – Create and manage entire quiz sets for specific topics

🃏 Flashcards – Reinforce memory through active recall

💾 Persistent Storage – All data is stored and retrieved from a SQL database

🚀 Production Ready – Dockerized and deployed for scalability and reliability

🛠 Tech Stack
Frontend

HTML5, CSS3, JavaScript (or React/Vue if used)

Backend

Java Spring Boot

JPA/Hibernate ORM

SQL Databases (MySQL / PostgreSQL)

RESTful APIs

DevOps / Deployment

Docker containerization

Git & GitHub for version control

🧩 Backend Architecture (Spring Boot)

The backend is powered by Java Spring Boot, providing a reliable, scalable API layer for managing quizzes, questions, and collections. It follows clean architectural principles and uses JPA/Hibernate to map application entities directly to SQL tables.

📘 JPA Entities & Data Modeling
Quiz Entity

Represents an entire quiz with its own set of questions.

Key details:

Uses @Entity with auto-generated ID

name field is unique

One-to-Many relationship with Question

CascadeType.ALL + orphanRemoval = true ensures that updates and deletions automatically propagate

Uses @JsonManagedReference to prevent serialization loops

Snippet:

@OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
@JsonManagedReference
private List<Question> questions;

Question Entity

Stores individual questions and correct answers.

Key details:

@ManyToOne relationship ties questions to a quiz

Foreign key stored via quiz_id

@JsonBackReference avoids circular JSON serialization

Snippet:

@ManyToOne
@JoinColumn(name = "quiz_id")
@JsonBackReference
private Quiz quiz;

Collections Support

Collections allow users to group entire quizzes under a topic or theme.

Uses a simple repository pattern:

public interface CollectionRepository extends JpaRepository<Collection, Long> {}

🌐 REST API Layer

The backend exposes REST endpoints for:

Creating quizzes

Fetching quizzes and questions

Updating quiz contents

Deleting quizzes

Managing collections

All responses are JSON, making the API easy to consume from any frontend framework.

🔧 Core Spring Boot Setup

The application starts from QuizBackendApplication, which includes global CORS configuration to allow frontend development (e.g., Vite/React):

registry.addMapping("/**")
    .allowedOrigins("http://localhost:5173")
    .allowedMethods("GET", "POST", "PUT", "DELETE")
    .allowedHeaders("*");


This ensures seamless communication between backend and frontend during development.

🗄 Database Layer

Uses MySQL or PostgreSQL

JPA automatically generates relational tables based on entities

Cascading rules ensure data integrity

Designed for easy schema updates and scalability

🚀 Production Deployment

The backend is fully Dockerized, enabling:

Reproducible environments

Smooth deployment to cloud providers

Easy scaling as user traffic increases
