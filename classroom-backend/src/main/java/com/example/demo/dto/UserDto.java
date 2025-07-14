package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String role;
    private String school;
    private Integer grade;
    private Integer classNum;
    private Integer number;
    private String name;
    private String subject;
    private Boolean isHomeroom;
    private String password;
    private String phoneNumber;
}
