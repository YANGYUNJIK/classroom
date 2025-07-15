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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        evaluationService.delete(id);
    }
}
