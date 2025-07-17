package com.example.demo.dto;

import com.example.demo.entity.Evaluation;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationDto {
    private Long id;
    private String title;
    private String subject;
    private String scope;
    private String content;
    private LocalDate endDate;

    public static EvaluationDto from(Evaluation evaluation) {
        return EvaluationDto.builder()
                .id(evaluation.getId())
                .title(evaluation.getTitle())
                .subject(evaluation.getSubject())
                .scope(evaluation.getScope())
                .content(evaluation.getContent())
                .endDate(evaluation.getEndDate())
                .build();
    }
}