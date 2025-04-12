package com.quizapp;



import com.quizapp.Quiz;
import com.quizapp.QuizRepository;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository){
       this.quizRepository = quizRepository;
    }




   public List<Quiz> getAllQuizzes(){
return quizRepository.findAll();
}


public void createquiz( Quiz quiz      ){
        quizRepository.save(quiz);



}


public void deletequiz(Long id){


        quizRepository.deleteById(id);


}




public void updatequiz(Long id, Quiz updateQuiz){
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