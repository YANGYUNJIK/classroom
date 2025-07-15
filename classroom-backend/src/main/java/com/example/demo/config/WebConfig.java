package com.example.demo.config; // ← 네 구조에 맞게 package 이름 확인

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:5173") // 💡 이거 사용해야 함!
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
