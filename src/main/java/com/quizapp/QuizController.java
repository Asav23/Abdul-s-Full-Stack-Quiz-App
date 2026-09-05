package com.quizapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/quizzes")
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

@GetMapping("/deleted")
    public List<Quiz> getDeletedQuizzes(){
        return quizService.getDeletedQuizzes();
}


@GetMapping("/{id}") // get id
    public  Quiz getQuizById(@PathVariable Long id){

return quizService.getQuizById(id);
}

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizService.createquiz(quiz);
    }

    @PutMapping("/{id}")
    public void updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        quizService.updatequiz(id, updatedQuiz);
    }

@DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id){
   quizService.deletequiz(id);



}

@PostMapping("/{id}/restore")
    public void restoreQuiz(@PathVariable Long id){
        quizService.restorequiz(id);
}

@DeleteMapping("/{id}/purge")
    public void purgeQuiz(@PathVariable Long id){
        quizService.purgequiz(id);
}




}