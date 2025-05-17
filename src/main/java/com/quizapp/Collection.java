package com.quizapp;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Collection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;


    @ElementCollection
    private List<Long> quizzes;  // Stores quiz IDs

    // Getters and Setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }



    public List<Long> getQuizzes() { return quizzes; }
    public void setQuizzes(List<Long> quizzes) { this.quizzes = quizzes; }
}
