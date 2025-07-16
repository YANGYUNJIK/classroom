package com.example.demo.controller;

import com.example.demo.service.LearningStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-status")
@RequiredArgsConstructor
public class LearningStatusController {

    private final LearningStatusService learningStatusService;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/mark")
    public void markLearning(@RequestBody Map<String, Object> request) {
        String loginId = (String) request.get("loginId");
        Long learningId = Long.valueOf(request.get("learningId").toString());
        learningStatusService.markAsDone(loginId, learningId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/list")
    public List<Long> getCompletedLearningIds(@RequestParam String loginId) {
        return learningStatusService.getCompletedLearningIds(loginId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/summary/{learningId}")
    public Map<String, Object> getSummary(@PathVariable Long learningId) {
        return learningStatusService.getLearningStatusSummary(learningId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/completed/{loginId}")
    public List<Long> getCompletedLearningIdsByPath(@PathVariable String loginId) {
        return learningStatusService.getCompletedLearningIds(loginId);
    }
}
