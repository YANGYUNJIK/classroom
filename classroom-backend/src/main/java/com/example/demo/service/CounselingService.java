package com.example.demo.service;

import com.example.demo.dto.CounselingRequestDto;
import com.example.demo.entity.Counseling;
import com.example.demo.entity.User;
import com.example.demo.repository.CounselingRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CounselingService {

    private final CounselingRepository counselingRepository;
    private final UserRepository userRepository;

    // 상담 신청
    public void createCounseling(CounselingRequestDto request) {
        Counseling counseling = new Counseling();
        counseling.setCategory(request.getCategory());
        counseling.setContent(request.getContent());
        counseling.setApplicant(request.getApplicant());
        counseling.setDate(LocalDate.now());
        counseling.setStatus("대기중");
        counselingRepository.save(counseling);
    }

    // 학생용: 본인 신청 상담 조회
    public List<Counseling> getByApplicant(String applicant) {
        return counselingRepository.findByApplicant(applicant);
    }

    // 교사용: 전체 상담 목록 (날짜순)
    public List<Counseling> getAll() {
        return counselingRepository.findAllByOrderByDateDesc();
    }

    // 교사용: 상담 상태 변경 (허락 또는 거절)
    public void updateStatus(Long id, CounselingRequestDto request) {
        Counseling counseling = counselingRepository.findById(id).orElseThrow();
        counseling.setStatus(request.getStatus());

        if ("거절됨".equals(request.getStatus())) {
            counseling.setRejectionReason(request.getRejectionReason());
        } else {
            counseling.setRejectionReason(null); // 이전 사유 제거
        }

        counselingRepository.save(counseling);
    }

    // 교사용: 자기 학급 학생들의 상담만 조회
    public List<Counseling> getForTeacher(String school, int grade, int classNum) {
        List<User> students = userRepository.findBySchoolAndGradeAndClassNum(school, grade, classNum);
        List<String> loginIds = students.stream()
                .map(User::getLoginId)
                .collect(Collectors.toList());

        return counselingRepository.findByApplicantIn(loginIds);
    }
}
