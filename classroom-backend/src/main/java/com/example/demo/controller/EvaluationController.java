package com.example.demo.controller;

import com.example.demo.entity.Evaluation;
import com.example.demo.service.EvaluationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluations")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    public Evaluation create(@RequestBody Evaluation evaluation) {
        return evaluationService.save(evaluation);
    }

    @GetMapping
    public List<Evaluation> getAll() {
        return evaluationService.findAll();
    }

    @GetMapping("/search")
    public List<Evaluation> getByClass(
            @RequestParam String school,
            @RequestParam Integer grade,
            @RequestParam Integer classNum
    ) {
        return evaluationService.findByClass(school, grade, classNum);
    }

    @PutMapping("/{id}")
    public Evaluation update(@PathVariable Long id, @RequestBody Evaluation updated) {
        updated.setId(id); // ID를 정확히 지정해야 JPA가 수정으로 인식합니다
        return evaluationService.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        evaluationService.delete(id);
    }

    /**
     * ✅ GPT 기반 학습 코칭 메시지 생성
     */
    @CrossOrigin(origins = "http://localhost:5173") 
    @GetMapping("/coaching")
    public String getCoachingMessage(
            @RequestParam String school,
            @RequestParam Integer grade,
            @RequestParam Integer classNum
    ) {
        List<Evaluation> evaluations = evaluationService.findByClass(school, grade, classNum);

        if (evaluations.isEmpty()) {
            return "최근 평가가 없습니다.";
        }

        // 가장 마지막 평가 1개 선택 (가장 최근에 등록된 순)
        evaluations.sort((e1, e2) -> e2.getEndDate().compareTo(e1.getEndDate()));
        Evaluation latestEval = evaluations.get(0);

        return evaluationService.generateCoachingMessage(latestEval);
    }

}
