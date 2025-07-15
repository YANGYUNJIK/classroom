package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequest {
    private Long studentId;
    private Long teacherId;
    private String dayOfWeek;
    private String period;
    private String status; // "출석", "지각", "결석" 중 하나
}
