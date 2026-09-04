package com.quizapp;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes/{quizId}/attempts")
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping
    public Attempt recordAttempt(@PathVariable Long quizId, @RequestBody Map<String, List<AttemptService.AnswerInput>> body) {
        return attemptService.recordAttempt(quizId, body.get("answers"));
    }

    @GetMapping
    public List<Attempt> getRecentAttempts(@PathVariable Long quizId) {
        return attemptService.getRecentAttempts(quizId);
    }
}
