// src/main/java/com/example/demo/dto/LoginResponse.java
package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private Long id;
    private String loginId;
    private String name;
    private String role;
    private String school;
    private Integer grade;
    private Integer classNum;
    private Integer number;
}
