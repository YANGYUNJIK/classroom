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
// @CrossOrigin(origins = "*")
@CrossOrigin(origins = "https://classroomate.netlify.app")
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

    @GetMapping("/period")
    public String getCurrentPeriod(
            @RequestParam String school,
            @RequestParam int grade,
            @RequestParam int classNum,
            @RequestParam String dayOfWeek,
            @RequestParam String nowTime
    ) {
        return timeTableService.getCurrentPeriod(school, grade, classNum, dayOfWeek, nowTime);
    }

    @GetMapping("/current")
    public TimeTableDto getCurrentPeriodForStudent(
            @RequestParam String school,
            @RequestParam int grade,
            @RequestParam int classNum,
            @RequestParam String dayOfWeek,
            @RequestParam String time
    ) {
        return timeTableService.getCurrentPeriodDto(school, grade, classNum, dayOfWeek, time)
        .orElse(new TimeTableDto());
    }

}
