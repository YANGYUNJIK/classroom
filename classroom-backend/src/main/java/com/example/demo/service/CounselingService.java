package com.example.demo.service;

import com.example.demo.dto.CounselingRequestDto;
import com.example.demo.dto.CounselingResponseDto;
import com.example.demo.entity.Counseling;
import com.example.demo.entity.User;
import com.example.demo.repository.CounselingRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
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
        counseling.setHopeTime(request.getHopeTime());
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
            counseling.setRejectionReason(null);
        }

        counselingRepository.save(counseling);
    }

    // 교사용: 자기 학급 학생들의 상담만 조회
    public List<CounselingResponseDto> getForTeacher(String school, int grade, int classNum) {
        List<User> students = userRepository.findBySchoolAndGradeAndClassNum(school, grade, classNum);

        Map<String, String> loginIdToName = students.stream()
            .collect(Collectors.toMap(User::getLoginId, User::getName));

        List<String> loginIds = students.stream()
            .map(User::getLoginId)
            .collect(Collectors.toList());

        List<Counseling> counselingList = counselingRepository.findByApplicantIn(loginIds);

        return counselingList.stream().map(c -> {
            CounselingResponseDto dto = new CounselingResponseDto();
            dto.setId(c.getId());
            dto.setCategory(c.getCategory());
            dto.setApplicant(c.getApplicant());
            dto.setApplicantName(loginIdToName.getOrDefault(c.getApplicant(), "알 수 없음"));
            dto.setDate(c.getDate());
            dto.setContent(c.getContent());
            dto.setStatus(c.getStatus());
            dto.setRejectionReason(c.getRejectionReason());
            dto.setHopeTime(c.getHopeTime());
            return dto;
        }).collect(Collectors.toList());
    }

    // ✅ 수정된 삭제 메서드
    public void deleteCounseling(Long id) {
        if (!counselingRepository.existsById(id)) {
            throw new IllegalArgumentException("삭제할 상담이 존재하지 않습니다. ID: " + id);
        }
        counselingRepository.deleteById(id);
    }
}
