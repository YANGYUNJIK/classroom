package com.example.demo.controller;

import com.example.demo.dto.CounselingRequestDto;
import com.example.demo.entity.Counseling;
import com.example.demo.service.CounselingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 교사용: 상담 전체 조회
    @GetMapping("/teacher")
    public List<Counseling> getAll() {
        return counselingService.getAll();
    }

    // 교사용: 상담 허용 또는 거절 처리
    @PutMapping("/{id}")
    public void updateStatus(@PathVariable Long id, @RequestBody CounselingRequestDto request) {
        counselingService.updateStatus(id, request);
    }
}
