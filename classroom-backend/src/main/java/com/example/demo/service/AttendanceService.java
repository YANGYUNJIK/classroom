package com.example.demo.service;

import com.example.demo.dto.AttendanceRequest;
import com.example.demo.dto.AttendanceResponse;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.User;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public void saveAttendance(AttendanceRequest request) {
        // 이미 출석한 경우 중복 방지
        boolean exists = attendanceRepository.existsByStudentIdAndDateAndPeriod(
                request.getStudentId(), LocalDate.now(), request.getPeriod());

        if (exists) {
            throw new RuntimeException("이미 출석 체크됨");
        }

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("학생 없음"));

        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("교사 없음"));

        Attendance record = new Attendance();
        record.setDate(LocalDate.now());
        record.setDayOfWeek(request.getDayOfWeek());
        record.setPeriod(request.getPeriod());
        record.setStudent(student);
        record.setTeacher(teacher);
        record.setStatus(request.getStatus());

        attendanceRepository.save(record);
    }

    public List<AttendanceResponse> getTodayAttendanceByTeacher(Long teacherId, String period) {
        LocalDate today = LocalDate.now();

        List<Attendance> records = attendanceRepository.findByTeacherIdAndDate(teacherId, today);

        return records.stream()
                .filter(a -> a.getPeriod().equals(period))
                .map(a -> {
                    AttendanceResponse dto = new AttendanceResponse();
                    dto.setStudentId(a.getStudent().getId());
                    dto.setStudentName(a.getStudent().getName());
                    dto.setPeriod(a.getPeriod());
                    dto.setStatus(a.getStatus());
                    return dto;
                })
                .toList();
    }

}
