package com.quizapp;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class AttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "attempt_id")
    @JsonBackReference
    private Attempt attempt;

    @Column(length = 2000)
    private String question;

    @Column(length = 2000)
    private String answer;

    @Column(length = 2000)
    private String userAnswer;

    private boolean wasCorrect;

    // Constructors
    public AttemptAnswer() {}

    public AttemptAnswer(Attempt attempt, String question, String answer, String userAnswer, boolean wasCorrect) {
        this.attempt = attempt;
        this.question = question;
        this.answer = answer;
        this.userAnswer = userAnswer;
        this.wasCorrect = wasCorrect;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Attempt getAttempt() {
        return attempt;
    }

    public void setAttempt(Attempt attempt) {
        this.attempt = attempt;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public boolean isWasCorrect() {
        return wasCorrect;
    }

    public void setWasCorrect(boolean wasCorrect) {
        this.wasCorrect = wasCorrect;
    }
}
