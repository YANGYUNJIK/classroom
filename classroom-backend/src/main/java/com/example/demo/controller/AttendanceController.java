package com.example.demo.controller;

import com.example.demo.dto.AttendanceRequestDto;
import com.example.demo.dto.AttendanceResponse;
import com.example.demo.service.AttendanceService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public void recordAttendance(@RequestBody AttendanceRequestDto request) {
        attendanceService.saveAttendance(request);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{teacherId}/today")
    public List<AttendanceResponse> getTodayAttendance(
            @PathVariable Long teacherId,
            @RequestParam String period
    ) {
        return attendanceService.getTodayAttendanceByTeacher(teacherId, period);
    }
}

