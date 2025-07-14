package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

        userRepository.save(user);
    }

    public User login(String phoneNumber, String password) {
        User user = userRepository.findByPhoneNumber(phoneNumber);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }


}
