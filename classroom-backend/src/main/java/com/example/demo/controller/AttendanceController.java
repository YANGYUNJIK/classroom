package com.example.demo.controller;

import com.example.demo.dto.AttendanceRequestDto;
import com.example.demo.dto.AttendanceResponse;
import com.example.demo.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
// @CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "https://classroomate.netlify.app")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public void recordAttendance(@RequestBody AttendanceRequestDto request) {
        System.out.println("📥 출석 요청 도착: " + request);
        attendanceService.saveAttendance(request);
    }

    @GetMapping("/{teacherId}/today")
    public List<AttendanceResponse> getTodayAttendance(
            @PathVariable Long teacherId,
            @RequestParam String period
    ) {
        return attendanceService.getTodayAttendanceByTeacher(teacherId, period);
    }

    @GetMapping("/check")
    public AttendanceResponse checkAttendance(
            @RequestParam String studentLoginId,
            @RequestParam Long teacherId,
            @RequestParam Integer period,
            @RequestParam String dayOfWeek,
            @RequestParam String date
    ) {
        return attendanceService.checkAttendance(studentLoginId, teacherId, period, dayOfWeek, date);
    }
}
