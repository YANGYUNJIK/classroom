package com.example.demo.service;

import com.example.demo.entity.Learning;
import com.example.demo.repository.LearningRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningService {

    private final LearningRepository learningRepository;

    public LearningService(LearningRepository learningRepository) {
        this.learningRepository = learningRepository;
    }

    public Learning save(Learning learning) {
        return learningRepository.save(learning);
    }

    public List<Learning> findAll() {
        return learningRepository.findAll();
    }

    public List<Learning> findByClass(String school, Integer grade, Integer classNum) {
        return learningRepository.findBySchoolAndGradeAndClassNum(school, grade, classNum);
    }

    public void delete(Long id) {
        learningRepository.deleteById(id);
    }

    public Learning update(Long id, Learning updated) {
        Optional<Learning> optional = learningRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("해당 학습 정보를 찾을 수 없습니다. ID: " + id);
        }

        Learning original = optional.get();

        // 기존 값 유지 + 새로운 값 덮어쓰기
        original.setTitle(updated.getTitle());
        original.setSubject(updated.getSubject());
        original.setGoal(updated.getGoal());
        original.setRangeText(updated.getRangeText());
        original.setContent(updated.getContent());
        original.setDeadline(updated.getDeadline());
        original.setSchool(updated.getSchool());
        original.setGrade(updated.getGrade());
        original.setClassNum(updated.getClassNum());

        return learningRepository.save(original);
    }
}
