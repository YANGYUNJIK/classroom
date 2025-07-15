package com.example.demo.repository;

import com.example.demo.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findAllBySchoolAndGradeAndClassNum(String school, Integer grade, Integer classNum);
}
