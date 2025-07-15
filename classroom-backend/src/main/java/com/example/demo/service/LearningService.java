package com.example.demo.service;

import com.example.demo.entity.Learning;
import com.example.demo.repository.LearningRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningService {

    private final LearningRepository learningRepository;

    public LearningService(LearningRepository learningRepository) {
        this.learningRepository = learningRepository;
    }

    public Learning save(Learning learning) {
        return learningRepository.save(learning);
    }

    public List<Learning> findAll() {
        return learningRepository.findAll();
    }

    public List<Learning> findByClass(String school, Integer grade, Integer classNum) {
        return learningRepository.findAllBySchoolAndGradeAndClassNum(school, grade, classNum);
    }

    public void delete(Long id) {
        learningRepository.deleteById(id);
    }
}
