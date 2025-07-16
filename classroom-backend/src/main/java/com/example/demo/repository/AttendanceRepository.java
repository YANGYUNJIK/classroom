package com.example.demo.repository;

import com.example.demo.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByTeacherIdAndDate(Long teacherId, LocalDate date);

    List<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);

    boolean existsByStudentIdAndDateAndPeriod(Long studentId, LocalDate date, String period);

    Optional<Attendance> findByStudentLoginIdAndTeacherIdAndPeriodAndDayOfWeekAndDate(
        String studentLoginId, Long teacherId, String period, String dayOfWeek, LocalDate date
    );




}
