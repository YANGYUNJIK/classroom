package com.example.demo.controller;

import com.example.demo.dto.EvaluationCoachingDto;
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
        updated.setId(id);
        return evaluationService.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        evaluationService.delete(id);
    }

    /**
     * ✅ GPT 기반 학습 코칭 메시지 + 평가 내용 포함 반환
     */
    @GetMapping("/coaching")
    public EvaluationCoachingDto getCoachingMessage(
            @RequestParam String school,
            @RequestParam Integer grade,
            @RequestParam Integer classNum
    ) {
        return evaluationService.getLatestCoaching(school, grade, classNum);
    }
}
