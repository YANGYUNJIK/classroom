package com.example.demo.controller;

import com.example.demo.dto.TimeTableDto;
import com.example.demo.dto.TimeTableRequest;
import com.example.demo.service.TimeTableService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimeTableController {

    private final TimeTableService timeTableService;

    @PostMapping
    public String save(@RequestBody TimeTableRequest request) {
        timeTableService.saveTimeTable(request);
        return "시간표 저장 완료!";
    }

    @GetMapping("/{teacherId}")
    public List<TimeTableDto> getTimeTable(@PathVariable Long teacherId) {
        return timeTableService.getTimeTableByTeacher(teacherId);
    }

    
}
