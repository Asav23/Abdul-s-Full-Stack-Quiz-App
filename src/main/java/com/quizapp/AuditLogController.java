package com.quizapp;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AuditLogController {

    private final QuizAuditLogRepository auditLogRepository;

    public AuditLogController(QuizAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/api/quizzes/{id}/audit-log")
    public List<QuizAuditLog> getQuizAuditLog(@PathVariable Long id) {
        return auditLogRepository.findByQuizIdOrderByTimestampDesc(id);
    }

    @GetMapping("/api/audit-log")
    public List<QuizAuditLog> getAllAuditLog() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
