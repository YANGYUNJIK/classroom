package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeTableDto {
    private String dayOfWeek; // "월", "화", ...
    private String period;
    private String subject;
    private String start; // "HH:mm"
    private String end;   // "HH:mm"
}
