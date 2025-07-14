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

    // 시간표 저장
    public void saveTimeTable(TimeTableRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        List<TimeTable> list = request.getTimetable().stream().map(dto -> {
            TimeTable tt = new TimeTable();
            tt.setPeriod(dto.getPeriod());
            tt.setSubject(dto.getSubject());

            // ✅ 문자열을 LocalTime으로 파싱
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

    // 시간표 불러오기
    public List<TimeTableDto> getTimeTableByTeacher(Long teacherId) {
        List<TimeTable> list = timeTableRepository.findByTeacherId(teacherId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        return list.stream().map(tt -> {
            TimeTableDto dto = new TimeTableDto();
            dto.setPeriod(tt.getPeriod());
            dto.setSubject(tt.getSubject());

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
