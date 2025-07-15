package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek; // 예: "월", "화", ...
    private String period; // 예: "1교시", "2교시"
    private LocalDate date; // 출석한 날짜

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    private String status; // "출석", "결석", "지각" 등
}
