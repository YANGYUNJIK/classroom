package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class TimeTableRequest {
    private Long teacherId;
    private List<TimeTableDto> timetable;
}
