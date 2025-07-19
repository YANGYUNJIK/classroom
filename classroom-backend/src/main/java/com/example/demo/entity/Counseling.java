package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "counselings")
public class Counseling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;         // 평가 / 학습 / 학교생활
    private String applicant;        // 학생 loginId
    private LocalDate date;          // 신청 날짜
    private String content;          // 신청 내용
    private String status;           // 신청됨 / 허락됨 / 거절됨
    private String rejectionReason;  // 거절 사유 (선택)
    private String school;
    private int grade;
    private int classNum;

    @Column
    private LocalDateTime hopeTime;

}
