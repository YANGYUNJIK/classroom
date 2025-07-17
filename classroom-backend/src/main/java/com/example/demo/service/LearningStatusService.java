package com.example.demo.service;

import com.example.demo.entity.Learning;
import com.example.demo.entity.LearningStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.LearningRepository;
import com.example.demo.repository.LearningStatusRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningStatusService {

    private final LearningStatusRepository repository;
    private final LearningRepository learningRepository;
    private final UserRepository userRepository;

    public void toggleLearningStatus(String loginId, Long learningId) {
        Optional<LearningStatus> existing = repository.findByLoginIdAndLearningId(loginId, learningId);
        if (existing.isPresent()) {
            repository.delete(existing.get()); // ✅ 완료 취소
        } else {
            LearningStatus status = LearningStatus.builder()
                    .loginId(loginId)
                    .learningId(learningId)
                    .markedAt(LocalDateTime.now())
                    .build();
            repository.save(status); // ✅ 완료 처리
        }
    }

    public List<Long> getCompletedLearningIds(String loginId) {
        return repository.findByLoginId(loginId).stream()
                .map(LearningStatus::getLearningId)
                .toList();
    }

    public Map<String, Object> getLearningStatusSummary(Long learningId) {
        Learning learning = learningRepository.findById(learningId)
                .orElseThrow(() -> new RuntimeException("학습 없음"));

        List<User> students = userRepository.findBySchoolAndGradeAndClassNum(
                learning.getSchool(), learning.getGrade(), learning.getClassNum()
        );

        List<LearningStatus> completedList = repository.findByLearningId(learningId);
        Set<String> completedLoginIds = completedList.stream()
                .map(LearningStatus::getLoginId)
                .collect(Collectors.toSet());

        List<Map<String, String>> completed = new ArrayList<>();
        List<Map<String, String>> notCompleted = new ArrayList<>();

        for (User student : students) {
            Map<String, String> info = new HashMap<>();
            info.put("loginId", student.getLoginId());
            info.put("name", student.getName());

            if (completedLoginIds.contains(student.getLoginId())) {
                completed.add(info);
            } else {
                notCompleted.add(info);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("learningId", learningId);
        result.put("completed", completed);
        result.put("notCompleted", notCompleted);
        return result;
    }
}
