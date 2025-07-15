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

    // ✅ CORS 허용 (프론트 localhost:5173 → 이 API만 허용)
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{teacherId}/today")
    public List<AttendanceResponse> getTodayAttendance(
            @PathVariable Long teacherId,
            @RequestParam String period
    ) {
        return attendanceService.getTodayAttendanceByTeacher(teacherId, period);
    }
}
