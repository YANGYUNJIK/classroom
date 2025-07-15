package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SchoolApiClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String API_KEY = "6d0d60bc04474945a1ae4e45c2004d07"; // ✅ 네 키

    public String getRegionFromSchoolName(String schoolName) {
        try {
            String url = "https://open.neis.go.kr/hub/schoolInfo" +
                    "?KEY=" + API_KEY +
                    "&Type=json" +
                    "&SCHUL_NM=" + schoolName;

            String response = restTemplate.getForObject(url, String.class);
            JsonNode json = objectMapper.readTree(response);

            JsonNode regionNode = json
                    .get("schoolInfo")
                    .get(1)
                    .get("row")
                    .get(0)
                    .get("ATPT_OFCDC_SC_NM"); // ex: "서울특별시교육청"

            return regionNode.asText();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
