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
    private final CollectionRepository collectionRepository;

    public QuizService(QuizRepository quizRepository, CollectionRepository collectionRepository){
       this.quizRepository = quizRepository;
       this.collectionRepository = collectionRepository;
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
    Quiz quiz = getQuizById(id);

    // A quiz can belong to collections via the collection_quizzes join table;
    // deleting it outright would violate that foreign key, so drop its
    // membership from any collection first.
    List<Collection> collections = collectionRepository.findByQuizzesContaining(quiz);
    for (Collection collection : collections) {
        collection.getQuizzes().removeIf(q -> q.getId().equals(id));
    }
    collectionRepository.saveAll(collections);

    quizRepository.deleteById(id);
}




public void updatequiz(Long id, Quiz updateQuiz){
validateQuestionCount(updateQuiz);
Quiz quiz = getQuizById(id);
quiz.setName(updateQuiz.getName());

// orphanRemoval requires mutating the existing managed collection in place -
// replacing it with a new List instance makes Hibernate throw
// "A collection with orphan deletion was no longer referenced".
List<Question> existingQuestions = quiz.getQuestions();
existingQuestions.clear();

List<Question> newQuestions = updateQuiz.getQuestions();
if (newQuestions != null) {
    for (Question question : newQuestions) {
        question.setId(null);
        question.setQuiz(quiz);
        existingQuestions.add(question);
    }
}

quizRepository.save(quiz);


}

///  get Quiz include main class
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No quiz found with ID: " + id));
    }



}
