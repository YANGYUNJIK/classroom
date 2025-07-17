package com.example.demo.service;

import com.example.demo.dto.EvaluationCoachingDto;
import com.example.demo.entity.Evaluation;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final GptService gptService;

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
     * GPT를 활용한 평가 기반 학습 코칭 메시지 포함 DTO 반환
     */
    public EvaluationCoachingDto getCoachingWithDto(Evaluation eval) {
        String prompt = String.format(
                "과목: %s\n제목: %s\n범위: %s\n내용: %s\n\n위 평가에 대해 학생에게 학습 코칭을 200자 내외로 해주세요.",
                eval.getSubject(), eval.getTitle(), eval.getScope(), eval.getContent()
        );
        String message = gptService.getAdvice(prompt).block();

        return EvaluationCoachingDto.builder()
                .title(eval.getTitle())
                .subject(eval.getSubject())
                .scope(eval.getScope())
                .content(eval.getContent())
                .message(message)
                .build();
    }

    /**
     * 가장 최근 평가 1개로 GPT 코칭 생성
     */
    public EvaluationCoachingDto getLatestCoaching(String school, Integer grade, Integer classNum) {
        List<Evaluation> evaluations = findByClass(school, grade, classNum);

        return evaluations.stream()
                .max(Comparator.comparing(Evaluation::getEndDate))
                .map(this::getCoachingWithDto)
                .orElse(EvaluationCoachingDto.builder()
                        .message("최근 평가가 없습니다.")
                        .build());
    }
}
