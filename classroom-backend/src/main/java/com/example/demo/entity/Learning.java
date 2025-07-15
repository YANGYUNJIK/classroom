package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Learning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String subject;
    private String goal;
    private String rangeText;

    @Column(length = 1000)
    private String content;

    @Column(nullable = true)
    private LocalDate deadline;  // ✅ String → LocalDate 로 변경

    private String school;
    private Integer grade;
    private Integer classNum;
}
