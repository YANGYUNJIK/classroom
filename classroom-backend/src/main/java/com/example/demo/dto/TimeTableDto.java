package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeTableDto {
    private String period;
    private String subject;
    
    private String start; // "HH:mm" 형식
    private String end;   // "HH:mm" 형식
}

