package com.example.demo.service;

import com.example.demo.dto.TimeTableDto;
import com.example.demo.dto.TimeTableRequest;
import com.example.demo.entity.TimeTable;
import com.example.demo.entity.User;
import com.example.demo.repository.TimeTableRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✅ 추가

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TimeTableService {

    private final TimeTableRepository timeTableRepository;
    private final UserRepository userRepository;

    @Transactional  // ✅ 트랜잭션 처리 추가
    public void saveTimeTable(TimeTableRequest request) {
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        // 요일별 기존 데이터 삭제
        List<String> days = request.getTimetable().stream()
                .map(TimeTableDto::getDayOfWeek)
                .distinct()
                .toList();

        for (String day : days) {
            timeTableRepository.deleteByTeacherIdAndDayOfWeek(teacher.getId(), day);
        }

        // 새로 저장
        List<TimeTable> entities = request.getTimetable().stream().map(dto -> {
            TimeTable tt = new TimeTable();
            tt.setPeriod(dto.getPeriod());
            tt.setSubject(dto.getSubject());
            tt.setDayOfWeek(dto.getDayOfWeek());

            try {
                tt.setStartTime(dto.getStart() != null ? LocalTime.parse(dto.getStart(), formatter) : null);
            } catch (DateTimeParseException e) {
                System.out.println("⛔ 시작 시간 파싱 실패: " + dto.getStart());
                tt.setStartTime(null);
            }

            try {
                tt.setEndTime(dto.getEnd() != null ? LocalTime.parse(dto.getEnd(), formatter) : null);
            } catch (DateTimeParseException e) {
                System.out.println("⛔ 끝 시간 파싱 실패: " + dto.getEnd());
                tt.setEndTime(null);
            }

            tt.setTeacher(teacher);
            return tt;
        }).toList();

        timeTableRepository.saveAll(entities);
    }

    public List<TimeTableDto> getTimeTableByTeacher(Long teacherId) {
        List<TimeTable> list = timeTableRepository.findByTeacherId(teacherId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        return list.stream().map(tt -> {
            TimeTableDto dto = new TimeTableDto();
            dto.setPeriod(tt.getPeriod());
            dto.setSubject(tt.getSubject());
            dto.setDayOfWeek(tt.getDayOfWeek());

            dto.setTeacherId(tt.getTeacher() != null ? tt.getTeacher().getId() : null);
            dto.setStart(tt.getStartTime() != null ? tt.getStartTime().format(formatter) : null);
            dto.setEnd(tt.getEndTime() != null ? tt.getEndTime().format(formatter) : null);

            return dto;
        }).toList();
    }

    public String getCurrentPeriod(String school, int grade, int classNum, String dayOfWeek, String nowTime) {
        List<TimeTable> list = timeTableRepository
            .findAllByTeacher_SchoolAndTeacher_GradeAndTeacher_ClassNumAndDayOfWeek(school, grade, classNum, dayOfWeek);

        LocalTime now = LocalTime.parse(nowTime);

        for (TimeTable tt : list) {
            if (tt.getStartTime() != null && tt.getEndTime() != null) {
                if (!now.isBefore(tt.getStartTime()) && !now.isAfter(tt.getEndTime())) {
                    return tt.getPeriod();
                }
            }
        }

        return null; // 현재 시간에 해당하는 교시 없음
    }

    public Optional<TimeTableDto> getCurrentPeriodDto(String school, int grade, int classNum, String dayOfWeek, String currentTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime now = LocalTime.parse(currentTime, formatter);

        List<TimeTable> list = timeTableRepository.findAllByTeacher_SchoolAndTeacher_GradeAndTeacher_ClassNumAndDayOfWeek(
                school, grade, classNum, dayOfWeek
        );

        for (TimeTable tt : list) {
            if (tt.getStartTime() != null && tt.getEndTime() != null) {
                if (!now.isBefore(tt.getStartTime()) && !now.isAfter(tt.getEndTime())) {
                    TimeTableDto dto = new TimeTableDto();
                    dto.setPeriod(tt.getPeriod());
                    dto.setSubject(tt.getSubject());
                    return Optional.of(dto);
                }
            }
        }

        return Optional.empty();
    }

}
