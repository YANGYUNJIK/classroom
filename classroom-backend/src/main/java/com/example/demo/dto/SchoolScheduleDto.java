package com.example.demo.dto;

public class SchoolScheduleDto {
    private String title;
    private String date;

    public SchoolScheduleDto() {}

    public SchoolScheduleDto(String title, String date) {
        this.title = title;
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
