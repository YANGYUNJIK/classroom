package com.example.demo.controller;

import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            // ✅ 응답용 DTO로 변환
            LoginResponse response = new LoginResponse();
            response.setId(user.getId());
            response.setLoginId(user.getLoginId());
            response.setName(user.getName());
            response.setRole(user.getRole());
            response.setSchool(user.getSchool());
            response.setGrade(user.getGrade());
            response.setClassNum(user.getClassNum());
            response.setNumber(user.getNumber());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }


    // ✅ 우리반 학생 목록 조회 API
    @GetMapping("/students")
    public List<User> getStudentsByClass(
            @RequestParam String school,
            @RequestParam Integer grade,
            @RequestParam Integer classNum
    ) {
        return userService.getStudentsByClass(school, grade, classNum);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto dto
    ) {
        userService.updateUser(id, dto);
        return ResponseEntity.ok("수정 완료");
    }

}
