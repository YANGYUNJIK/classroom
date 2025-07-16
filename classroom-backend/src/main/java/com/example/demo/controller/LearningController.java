package com.example.demo.controller;

import com.example.demo.entity.Evaluation;
import com.example.demo.entity.Learning;
import com.example.demo.service.LearningService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learnings")
@CrossOrigin(origins = "*")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @PostMapping
    public Learning create(@RequestBody Learning learning) {
        return learningService.save(learning);
    }

    @GetMapping
    public List<Learning> getAll() {
        return learningService.findAll();
    }

    // @GetMapping("/search")
    // public List<Learning> getByClass(
    //         @RequestParam String school,
    //         @RequestParam Integer grade,
    //         @RequestParam Integer classNum
    // ) {
    //     System.out.println("🟡 학습 검색 요청");
    //     System.out.println(" → school: " + school + " / grade: " + grade + " / classNum: " + classNum);

    //     List<Learning> result = learningService.findByClass(school, grade, classNum);
    //     System.out.println(" → 검색 결과 개수: " + result.size());
    //     result.forEach(l -> System.out.println("   • " + l.getTitle() + " / " + l.getSubject()));

    //     return result;
    // }


    @GetMapping("/search")
    public List<Learning> getByClass(
            @RequestParam String school,
            @RequestParam Integer grade,
            @RequestParam Integer classNum
    ) {
        return learningService.findByClass(school, grade, classNum);
    }



    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        learningService.delete(id);
    }

    @PutMapping("/{id}")
    public Learning update(@PathVariable Long id, @RequestBody Learning updated) {
        return learningService.update(id, updated); // ✅ 수정: save() → update()
    }



}