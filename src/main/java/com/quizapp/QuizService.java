package com.quizapp;

import com.quizapp.Quiz;
import com.quizapp.Question;
import com.quizapp.QuizRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    public static final int MAX_QUESTIONS_PER_QUIZ = 35;

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository){
       this.quizRepository = quizRepository;
    }




   public List<Quiz> getAllQuizzes(){
return quizRepository.findAll();
}


public Quiz createquiz(Quiz quiz) {
    validateQuestionCount(quiz);
    // Set the quiz reference for each question
    if (quiz.getQuestions() != null) {
        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }
    }
    return quizRepository.save(quiz);
}

private void validateQuestionCount(Quiz quiz) {
    if (quiz.getQuestions() != null && quiz.getQuestions().size() > MAX_QUESTIONS_PER_QUIZ) {
        throw new IllegalArgumentException("A quiz can have at most " + MAX_QUESTIONS_PER_QUIZ + " questions");
    }
}


public void deletequiz(Long id){


        quizRepository.deleteById(id);


}




public void updatequiz(Long id, Quiz updateQuiz){
validateQuestionCount(updateQuiz);
Quiz quiz = getQuizById(id);
quiz.setName(updateQuiz.getName());
quiz.setQuestions(updateQuiz.getQuestions());
quizRepository.save(quiz);


}

///  get Quiz include main class
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No quiz found with ID: " + id));
    }



}