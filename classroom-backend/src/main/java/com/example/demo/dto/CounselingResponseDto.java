package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

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
}
