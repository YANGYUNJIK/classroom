package com.example.demo.service;

import com.example.demo.entity.Evaluation;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public Evaluation save(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    public List<Evaluation> findAll() {
        return evaluationRepository.findAll();
    }

    public List<Evaluation> findByClass(String school, Integer grade, Integer classNum) {
        return evaluationRepository.findAllBySchoolAndGradeAndClassNum(school, grade, classNum);
    }

    public void delete(Long id) {
        evaluationRepository.deleteById(id);
    }
}
