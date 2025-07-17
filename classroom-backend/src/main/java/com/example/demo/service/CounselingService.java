package com.example.demo.service;

import com.example.demo.dto.CounselingRequestDto;
import com.example.demo.entity.Counseling;
import com.example.demo.repository.CounselingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CounselingService {

    private final CounselingRepository counselingRepository;

    public void createCounseling(CounselingRequestDto request) {
        Counseling counseling = new Counseling();
        counseling.setCategory(request.getCategory());
        counseling.setContent(request.getContent());
        counseling.setApplicant(request.getApplicant());
        counseling.setDate(LocalDate.now());
        counseling.setStatus("대기중");
        counselingRepository.save(counseling);
    }

    public List<Counseling> getByApplicant(String applicant) {
        return counselingRepository.findByApplicant(applicant);
    }

    public List<Counseling> getAll() {
        return counselingRepository.findAllByOrderByDateDesc();
    }

    public void updateStatus(Long id, CounselingRequestDto request) {
        Counseling counseling = counselingRepository.findById(id).orElseThrow();
        counseling.setStatus(request.getStatus());

        if ("거절됨".equals(request.getStatus())) {
            counseling.setRejectionReason(request.getRejectionReason());
        }

        counselingRepository.save(counseling);
    }
}
