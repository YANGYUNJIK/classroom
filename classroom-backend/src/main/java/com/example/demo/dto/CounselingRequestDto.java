package com.example.demo.dto;

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
}
