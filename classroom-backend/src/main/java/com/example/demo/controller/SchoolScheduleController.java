package com.example.demo.controller;

import com.example.demo.dto.SchoolScheduleDto;
import com.example.demo.service.SchoolScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/school-schedule")
@CrossOrigin(origins = "https://classroomate.netlify.app")
public class SchoolScheduleController {

    private final SchoolScheduleService schoolScheduleService;

    public SchoolScheduleController(SchoolScheduleService schoolScheduleService) {
        this.schoolScheduleService = schoolScheduleService;
    }

    @GetMapping
    public List<SchoolScheduleDto> getSchedule(@RequestParam String school) {
        return schoolScheduleService.fetchSchedule(school);
    }
}
