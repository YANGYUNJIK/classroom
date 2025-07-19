package com.example.demo.service;

import com.example.demo.dto.AttendanceRequestDto;
import com.example.demo.dto.AttendanceResponse;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.User;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public void saveAttendance(AttendanceRequestDto request) {
        log.info("💾 출석 저장 시도: {}", request);

        User student = userRepository.findByLoginId(request.getStudentLoginId())
                .orElseThrow(() -> {
                    log.error("❌ 학생 없음: {}", request.getStudentLoginId());
                    return new RuntimeException("학생 없음");
                });

        LocalDate targetDate = LocalDate.parse(request.getDate());

        boolean exists = attendanceRepository.existsByStudentIdAndDateAndPeriod(
                student.getId(), targetDate, request.getPeriod());

        if (exists) {
            log.warn("⚠️ 이미 출석됨: {}, {}, {}", student.getId(), targetDate, request.getPeriod());
            throw new RuntimeException("이미 출석 체크됨");
        }

        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> {
                    log.error("❌ 교사 없음: {}", request.getTeacherId());
                    return new RuntimeException("교사 없음");
                });

        Attendance record = new Attendance();
        record.setDate(targetDate);
        record.setDayOfWeek(request.getDayOfWeek());
        record.setPeriod(request.getPeriod());
        record.setStudent(student);
        record.setTeacher(teacher);
        record.setStatus(request.getStatus() != null ? request.getStatus() : "출석");

        attendanceRepository.save(record);
        log.info("✅ 출석 저장 완료: {}, {}, {}", student.getId(), targetDate, request.getPeriod());
    }

    public List<AttendanceResponse> getTodayAttendanceByTeacher(Long teacherId, String period) {
        LocalDate today = LocalDate.now();

        List<Attendance> records = attendanceRepository.findByTeacherIdAndDate(teacherId, today);

        return records.stream()
                .filter(a -> a.getPeriod().equals(period))
                .map(AttendanceResponse::new)
                .toList();
    }

    public AttendanceResponse checkAttendance(String studentLoginId, Long teacherId, Integer period, String dayOfWeek, String date) {
        LocalDate parsedDate = LocalDate.parse(date); // 🔥 String → LocalDate 변환
        return attendanceRepository.findByStudentLoginIdAndTeacherIdAndPeriodAndDayOfWeekAndDate(
                studentLoginId,
                teacherId,
                String.valueOf(period),
                dayOfWeek,
                parsedDate
        ).map(AttendanceResponse::new)
        .orElse(new AttendanceResponse("미출석"));
    }

}
