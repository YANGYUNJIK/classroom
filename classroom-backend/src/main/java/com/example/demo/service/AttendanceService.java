package com.example.demo.service;

import com.example.demo.dto.AttendanceRequestDto;
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

    public void saveAttendance(AttendanceRequestDto request) {
        User student = userRepository.findByLoginId(request.getStudentLoginId())
                .orElseThrow(() -> new RuntimeException("학생 없음"));

        // ✅ 프론트에서 넘어온 날짜를 문자열로 받아서 LocalDate로 변환
        LocalDate targetDate = LocalDate.parse(request.getDate());

        boolean exists = attendanceRepository.existsByStudentIdAndDateAndPeriod(
                student.getId(), targetDate, request.getPeriod());

        if (exists) {
            throw new RuntimeException("이미 출석 체크됨");
        }

        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("교사 없음"));

        Attendance record = new Attendance();
        record.setDate(targetDate);  // ✅ 정확한 날짜로 설정
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
