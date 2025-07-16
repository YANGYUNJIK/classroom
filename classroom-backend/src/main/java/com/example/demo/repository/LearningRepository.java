package com.example.demo.repository;

import com.example.demo.entity.Learning;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningRepository extends JpaRepository<Learning, Long> {
    List<Learning> findBySchoolAndGradeAndClassNum(String school, Integer grade, Integer classNum);
}
