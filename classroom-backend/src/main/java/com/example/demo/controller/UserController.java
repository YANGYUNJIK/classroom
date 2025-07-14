package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public String signup(@RequestBody UserDto dto) {
        userService.signup(dto);
        return "회원가입 완료";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String phoneNumber, @RequestParam String password) {
        User user = userService.login(phoneNumber, password);
        if (user != null) {
            return ResponseEntity.ok(user); // 200 OK + user 정보 반환
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패"); // 401 반환
        }
    }

}
