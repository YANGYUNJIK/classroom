package com.example.demo.repository;

import com.example.demo.entity.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    List<TimeTable> findByTeacherId(Long teacherId);
    void deleteByTeacherId(Long teacherId);
    void deleteByTeacherIdAndDayOfWeek(Long teacherId, String dayOfWeek);

    // ✅ 추가: 학생 기준으로 현재 요일 시간표 가져오기
    List<TimeTable> findAllByTeacher_SchoolAndTeacher_GradeAndTeacher_ClassNumAndDayOfWeek(String school, int grade, int classNum, String dayOfWeek);

}
