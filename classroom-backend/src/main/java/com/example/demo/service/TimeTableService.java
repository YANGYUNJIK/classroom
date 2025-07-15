package com.example.demo.service;

import com.example.demo.dto.TimeTableDto;
import com.example.demo.dto.TimeTableRequest;
import com.example.demo.entity.TimeTable;
import com.example.demo.entity.User;
import com.example.demo.repository.TimeTableRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeTableService {

    private final TimeTableRepository timeTableRepository;
    private final UserRepository userRepository;

    public void saveTimeTable(TimeTableRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        // 🧹 요일별로 기존 데이터 삭제
        List<String> days = request.getTimetable().stream()
                .map(TimeTableDto::getDayOfWeek)
                .distinct()
                .toList();
        for (String day : days) {
            timeTableRepository.deleteByTeacherIdAndDayOfWeek(request.getTeacherId(), day);
        }

        // ⏱ 새로 저장
        List<TimeTable> list = request.getTimetable().stream().map(dto -> {
            TimeTable tt = new TimeTable();
            tt.setPeriod(dto.getPeriod());
            tt.setSubject(dto.getSubject());
            tt.setDayOfWeek(dto.getDayOfWeek());

            if (dto.getStart() != null && !dto.getStart().isEmpty()) {
                tt.setStartTime(LocalTime.parse(dto.getStart(), formatter));
            }
            if (dto.getEnd() != null && !dto.getEnd().isEmpty()) {
                tt.setEndTime(LocalTime.parse(dto.getEnd(), formatter));
            }

            tt.setTeacher(teacher);
            return tt;
        }).toList();

        timeTableRepository.saveAll(list);
    }

    public List<TimeTableDto> getTimeTableByTeacher(Long teacherId) {
        List<TimeTable> list = timeTableRepository.findByTeacherId(teacherId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        return list.stream().map(tt -> {
            TimeTableDto dto = new TimeTableDto();
            dto.setPeriod(tt.getPeriod());
            dto.setSubject(tt.getSubject());
            dto.setDayOfWeek(tt.getDayOfWeek());

            if (tt.getStartTime() != null) {
                dto.setStart(tt.getStartTime().format(formatter));
            }
            if (tt.getEndTime() != null) {
                dto.setEnd(tt.getEndTime().format(formatter));
            }

            return dto;
        }).toList();
    }
}
