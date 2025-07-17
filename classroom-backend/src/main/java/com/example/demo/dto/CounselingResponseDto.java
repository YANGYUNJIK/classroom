package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class CounselingResponseDto {
    private Long id;
    private String category;
    private String applicant;
    private LocalDate date;
    private String content;
    private String status;
    private String rejectionReason;
    private String applicantName;  // ✅ 신청자 이름 추가
    private LocalDateTime hopeTime;


}
