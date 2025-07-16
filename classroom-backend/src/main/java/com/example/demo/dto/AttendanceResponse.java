package com.example.demo.dto;

import com.example.demo.entity.Attendance;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceResponse {
    private Long studentId;
    private String studentName;
    private Integer studentNumber; // ✅ 학생 번호 추가
    private String period;
    private String status;

    public AttendanceResponse() {}

    public AttendanceResponse(String status) {
        this.status = status;
    }

    // ✅ Attendance → DTO 변환 시 studentNumber도 포함
    public AttendanceResponse(Attendance attendance) {
        this.studentId = attendance.getStudent().getId();
        this.studentName = attendance.getStudent().getName();
        this.studentNumber = attendance.getStudent().getNumber(); // ✅ 추가
        this.period = attendance.getPeriod();
        this.status = attendance.getStatus();
    }
}
