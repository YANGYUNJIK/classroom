package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationCoachingDto {
    private String title;
    private String subject;
    private String scope;
    private String content;
    private String message;
}