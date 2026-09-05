package com.quizapp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAuditLogRepository extends JpaRepository<QuizAuditLog, Long> {

    List<QuizAuditLog> findByQuizIdOrderByTimestampDesc(Long quizId);

    List<QuizAuditLog> findAllByOrderByTimestampDesc();
}
