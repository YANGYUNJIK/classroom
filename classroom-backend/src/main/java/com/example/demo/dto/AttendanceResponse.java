package com.example.demo.dto;

import com.example.demo.entity.Attendance;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceResponse {
    private Long studentId;
    private String studentName;
    private String period;
    private String status;

    public AttendanceResponse() {}

    public AttendanceResponse(String status) {
        this.status = status;
    }

    // 출석 DB 엔티티로부터 DTO 생성
    public AttendanceResponse(Attendance attendance) {
        this.studentId = attendance.getStudent().getId();
        this.studentName = attendance.getStudent().getName();
        this.period = attendance.getPeriod();
        this.status = attendance.getStatus();
    }
}
