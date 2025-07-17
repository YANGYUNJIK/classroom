package com.example.demo.service;

import com.example.demo.entity.Evaluation;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final GptService gptService; // ✅ GPT 서비스 주입

    public EvaluationService(EvaluationRepository evaluationRepository, GptService gptService) {
        this.evaluationRepository = evaluationRepository;
        this.gptService = gptService;
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

    /**
     * GPT를 활용한 평가 기반 학습 코칭 메시지 생성
     */
    public String generateCoachingMessage(Evaluation eval) {
        String prompt = eval.getSubject() + " 과목의 '" + eval.getTitle() + "' 평가에 대해 학생에게 학습 코칭을 해주세요.";
        return gptService.getAdvice(prompt).block(); // GPT 호출
    }

}
