package com.quizapp;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Attempt> attempts;

    private Double highScore;

    // Soft delete: "default false" at the SQL level (not just the Java field
    // default) matters here - when this column is added to the existing
    // table via ddl-auto=update, every already-existing quiz needs to
    // backfill to false, not NULL, or it silently vanishes from
    // findByDeletedFalse().
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;

    // Constructors
    public Quiz() {}

    public Quiz(String name, List<Question> questions) {
        this.name = name;
        this.questions = questions;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<Attempt> getAttempts() {
        return attempts;
    }

    public void setAttempts(List<Attempt> attempts) {
        this.attempts = attempts;
    }

    public Double getHighScore() {
        return highScore;
    }

    public void setHighScore(Double highScore) {
        this.highScore = highScore;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
