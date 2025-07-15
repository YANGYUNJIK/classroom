package com.example.demo.entity;

import java.time.LocalTime;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TimeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String period;
    private String subject;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "day_of_week")
    private String dayOfWeek; // "월", "화", ..., "일"

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;
}
