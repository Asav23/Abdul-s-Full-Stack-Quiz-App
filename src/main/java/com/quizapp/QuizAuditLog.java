package com.quizapp;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * An append-only record of every create/update/delete/restore on a quiz -
 * a deliberately simplified Change Data Capture stream. quizId is a plain
 * column, not a @ManyToOne, so this history survives even after a quiz is
 * permanently purged.
 */
@Entity
public class QuizAuditLog {

    public enum Action {
        CREATED, UPDATED, DELETED, RESTORED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long quizId;

    private String quizName;

    @Enumerated(EnumType.STRING)
    private Action action;

    private Instant timestamp = Instant.now();

    public QuizAuditLog() {}

    public QuizAuditLog(Long quizId, String quizName, Action action) {
        this.quizId = quizId;
        this.quizName = quizName;
        this.action = action;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
