package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void signup(UserDto dto) {
        User user = new User();
        user.setRole(dto.getRole());
        user.setSchool(dto.getSchool());
        user.setGrade(dto.getGrade());
        user.setClassNum(dto.getClassNum());
        user.setNumber(dto.getNumber());
        user.setName(dto.getName());
        user.setSubject(dto.getSubject());
        user.setIsHomeroom(dto.getIsHomeroom());
        user.setPassword(dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber());

        // ✅ loginId 자동 생성: 예) id_01077777777
        if (dto.getPhoneNumber() != null) {
            String loginId = "id_" + dto.getPhoneNumber().replaceAll("-", "");
            user.setLoginId(loginId);
        }

        userRepository.save(user);
    }

    public User login(String phoneNumber, String password) {
        User user = userRepository.findByPhoneNumber(phoneNumber);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public List<User> getStudentsByClass(String school, Integer grade, Integer classNum) {
        return userRepository.findByRoleAndSchoolAndGradeAndClassNumOrderByNumberAsc(
            "student", school, grade, classNum
        );
    }

    public void updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 학생을 찾을 수 없습니다."));

        user.setName(dto.getName());
        user.setNumber(dto.getNumber());
        user.setPhoneNumber(dto.getPhoneNumber());

        userRepository.save(user);
    }

    private String generateLoginId(String phoneNumber) {
        return "id_" + phoneNumber;  // 예: "id_01012345678"
    }
}
