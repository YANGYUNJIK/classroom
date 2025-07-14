package com.example.demo.repository;

import com.example.demo.entity.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    List<TimeTable> findByTeacherId(Long teacherId);

    // ✅ 교사 ID 기준 삭제 (덮어쓰기용)
    void deleteByTeacherId(Long teacherId);
}
