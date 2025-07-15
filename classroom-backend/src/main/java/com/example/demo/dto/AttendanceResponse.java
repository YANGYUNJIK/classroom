package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceResponse {
    private Long studentId;
    private String studentName;
    private String period;
    private String status; // "출석", "지각", ...
}
