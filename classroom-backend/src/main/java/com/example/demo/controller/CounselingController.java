package com.example.demo.controller;

import com.example.demo.dto.CounselingRequestDto;
import com.example.demo.dto.CounselingResponseDto;
import com.example.demo.entity.Counseling;
import com.example.demo.service.CounselingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "https://classroomate.netlify.app")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/counselings")
public class CounselingController {

    private final CounselingService counselingService;

    // 상담 등록
    @PostMapping
    public void createCounseling(@RequestBody CounselingRequestDto request) {
        counselingService.createCounseling(request);
    }

    // 학생용: 본인이 신청한 상담 목록 조회
    @GetMapping("/student")
    public List<Counseling> getByApplicant(@RequestParam String applicant) {
        return counselingService.getByApplicant(applicant);
    }

    // ✅ 교사용: 해당 학급 학생들의 상담 목록만 조회
    @GetMapping("/teacher")
    public List<CounselingResponseDto> getForTeacher(
        @RequestParam String school,
        @RequestParam int grade,
        @RequestParam int classNum
    ) {
        return counselingService.getForTeacher(school, grade, classNum);
    }

    // 교사용: 상담 허용 또는 거절 처리
    @PutMapping("/{id}")
    public void updateStatus(@PathVariable Long id, @RequestBody CounselingRequestDto request) {
        counselingService.updateStatus(id, request);
    }

    // 학생 본인의 상담 삭제
    @DeleteMapping("/{id}")
    public void deleteCounseling(@PathVariable Long id) {
        counselingService.deleteCounseling(id);
    }

}
