package com.example.demo.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CounselingRequestDto {
    private String category;
    private String applicant;
    private String content;
    private String status;
    private String rejectionReason;
    private LocalDateTime hopeTime;

}
