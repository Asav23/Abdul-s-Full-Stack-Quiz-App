package com.quizapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*") // Allow requests from any origin (adjust as needed)

public class QuizController {

    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }


@GetMapping   // get all first
    public List <Quiz> getAllquizes(){
        return quizService.getAllQuizzes();

}


@GetMapping("/{id}") // get id
    public  Quiz getQuizById(@PathVariable Long id){

return quizService.getQuizById(id);
}

    @PutMapping("/{id}")
    public void updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        quizService.updatequiz(id, updatedQuiz);
    }

@RequestMapping
public void createQuiz(@RequestBody Quiz quiz){
        quizService.createquiz(quiz);

}

@DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id){
   quizService.deletequiz(id);



}




}