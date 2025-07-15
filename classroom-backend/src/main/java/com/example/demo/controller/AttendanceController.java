package com.example.demo.controller;

import com.example.demo.dto.AttendanceRequest;
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
    public void recordAttendance(@RequestBody AttendanceRequest request) {
        attendanceService.saveAttendance(request);
    }

    @GetMapping("/{teacherId}/today")
    public List<AttendanceResponse> getTodayAttendance(
            @PathVariable Long teacherId,
            @RequestParam String period
    ) {
        return attendanceService.getTodayAttendanceByTeacher(teacherId, period);
    }

}
