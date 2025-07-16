package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequestDto {
    private String studentLoginId;  // ex: "3-2-17"
    private Long teacherId;
    private String period;          // 반드시 String (e.g., "1", "2")
    private String dayOfWeek;       // e.g., "월"
    private String status;          // "출석" or "지각" 등
    private String date;            // "2025-07-16" 형식
}
