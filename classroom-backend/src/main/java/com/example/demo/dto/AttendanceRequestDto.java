package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequestDto {
    private String studentLoginId;  // 기존 studentId → loginId로 변경
    private Long teacherId;
    private String period;
    private String dayOfWeek;
    private String status;
}
