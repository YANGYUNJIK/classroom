package com.example.demo.repository;

import com.example.demo.entity.LearningStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningStatusRepository extends JpaRepository<LearningStatus, Long> {
    Optional<LearningStatus> findByLoginIdAndLearningId(String loginId, Long learningId);
    List<LearningStatus> findByLoginId(String loginId);
    List<LearningStatus> findByLearningId(Long learningId);

    
}
