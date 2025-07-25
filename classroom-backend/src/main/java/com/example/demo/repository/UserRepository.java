package com.example.demo.repository;

import com.example.demo.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByPhoneNumber(String phoneNumber);
    List<User> findByRoleAndSchoolAndGradeAndClassNumOrderByNumberAsc(
        String role, String school, Integer grade, Integer classNum
    );
    Optional<User> findByLoginId(String loginId);
    List<User> findBySchoolAndGradeAndClassNum(String school, int grade, int classNum);
}

