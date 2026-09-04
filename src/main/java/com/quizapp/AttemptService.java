package com.quizapp;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final QuizRepository quizRepository;

    public AttemptService(AttemptRepository attemptRepository, QuizRepository quizRepository) {
        this.attemptRepository = attemptRepository;
        this.quizRepository = quizRepository;
    }

    public static class AnswerInput {
        public String question;
        public String answer;
        public String userAnswer;
    }

    public Attempt recordAttempt(Long quizId, List<AnswerInput> answerInputs) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalStateException("No quiz found with ID: " + quizId));

        if (answerInputs == null || answerInputs.isEmpty()) {
            throw new IllegalArgumentException("An attempt must include at least one answer");
        }

        Attempt attempt = new Attempt(quiz);
        int correctCount = 0;

        for (AnswerInput input : answerInputs) {
            boolean wasCorrect = input.userAnswer != null && input.answer != null
                    && input.userAnswer.trim().equalsIgnoreCase(input.answer.trim());
            if (wasCorrect) {
                correctCount++;
            }
            attempt.getAnswers().add(new AttemptAnswer(attempt, input.question, input.answer, input.userAnswer, wasCorrect));
        }

        attempt.setCorrectCount(correctCount);
        attempt.setTotalQuestions(answerInputs.size());
        attemptRepository.save(attempt);

        double percentage = (double) correctCount / answerInputs.size() * 100;
        if (quiz.getHighScore() == null || percentage > quiz.getHighScore()) {
            quiz.setHighScore(percentage);
            quizRepository.save(quiz);
        }

        return attempt;
    }

    public List<Attempt> getRecentAttempts(Long quizId) {
        return attemptRepository.findTop5ByQuizIdOrderByPlayedAtDesc(quizId);
    }
}
