package com.example.demo.repository;

import com.example.demo.entity.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    List<TimeTable> findByTeacherId(Long teacherId);
    void deleteByTeacherId(Long teacherId);
    void deleteByTeacherIdAndDayOfWeek(Long teacherId, String dayOfWeek);
}
