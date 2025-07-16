package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    private String loginId;
}
