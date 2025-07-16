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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;  // ✅ 자바 표준 Set으로 수정
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningStatusService {

    private final LearningStatusRepository repository;
    private final LearningRepository learningRepository;
    private final UserRepository userRepository;


    public void markAsDone(String loginId, Long learningId) {
        boolean alreadyMarked = repository.findByLoginIdAndLearningId(loginId, learningId).isPresent();
        if (!alreadyMarked) {
            LearningStatus status = LearningStatus.builder()
                    .loginId(loginId)
                    .learningId(learningId)
                    .markedAt(LocalDateTime.now())
                    .build();
            repository.save(status);
        }
    }

    public List<Long> getCompletedLearningIds(String loginId) {
        return repository.findByLoginId(loginId).stream()
                .map(LearningStatus::getLearningId)
                .toList();
    }

    public Map<String, Object> getLearningStatusSummary(Long learningId) {
        // 학습 정보 가져오기
        Learning learning = learningRepository.findById(learningId)
            .orElseThrow(() -> new RuntimeException("학습 없음"));

        // 해당 학습을 받는 학급의 학생 전체 조회
        List<User> students = userRepository.findBySchoolAndGradeAndClassNum(
            learning.getSchool(), learning.getGrade(), learning.getClassNum()
        );

        // 완료 상태 조회
        List<LearningStatus> completedList = repository.findByLearningId(learningId);
        Set<String> completedLoginIds = completedList.stream()
                .map(LearningStatus::getLoginId)
                .collect(Collectors.toSet());

        // 분리
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
