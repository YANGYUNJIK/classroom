package com.example.demo.service;

import com.example.demo.dto.SchoolScheduleDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SchoolScheduleService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public List<SchoolScheduleDto> fetchSchedule(String schoolName) {
        String schoolCode = getHomepageCode(schoolName); // 예: "gbjbms"

        if (schoolCode == null) {
            return List.of(new SchoolScheduleDto("지원하지 않는 학교입니다", ""));
        }

        String url = "https://school.gyo6.net/" + schoolCode + "/schl/sv/schdulView/selectSchdulList.do";

        // 요청 바디 (예: 2025년 7월 일정)
        Map<String, String> body = new HashMap<>();
        body.put("searchYear", "2025");
        body.put("searchMonth", "07");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // 유지
        headers.set("User-Agent", "Mozilla/5.0"); // 추가
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);


        try {
            System.out.println("📡 요청 URL: " + url);
            System.out.println("📦 요청 바디: " + objectMapper.writeValueAsString(body));

            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class
            );

            System.out.println("🔽 응답 내용:");
            System.out.println(response.getBody());

            JsonNode json = objectMapper.readTree(response.getBody());

            if (!json.has("resultList")) {
                System.out.println("❌ 'resultList' 항목이 없음!");
                return List.of(new SchoolScheduleDto("결과 없음", ""));
            }

            JsonNode list = json.get("resultList");
            List<SchoolScheduleDto> result = new ArrayList<>();

            for (JsonNode item : list) {
                String title = item.get("SCHUL_CN").asText();
                String date = item.get("SCHUL_YMD").asText();
                result.add(new SchoolScheduleDto(title, date));
            }

            return result;

        } catch (Exception e) {
            System.out.println("❗ 예외 발생:");
            e.printStackTrace(); // 반드시 콘솔에 전체 예외 출력
            return List.of(new SchoolScheduleDto("크롤링 실패", ""));
        }


    }

    // ✨ 학교명 → 학교 홈페이지 코드 매핑
    private String getHomepageCode(String schoolName) {
        if (schoolName.contains("경북중부중")) return "gbjbms";
        if (schoolName.contains("경북소프트웨어마이스터고")) return "gbsw";
        // TODO: 더 많은 학교를 여기에 추가 가능
        return null;
    }
}
