package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeTableDto {
    private String dayOfWeek; // 요일 (월~금)
    private String period;    // 교시 (1교시 등)
    private String subject;   // 과목명
    private String start;     // 시작 시간 "HH:mm"
    private String end;       // 종료 시간 "HH:mm"
    private Long teacherId;   // 교사 ID (프론트 매핑용)
}
