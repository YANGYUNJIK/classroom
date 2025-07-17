package com.example.demo.repository;

import com.example.demo.entity.Counseling;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounselingRepository extends JpaRepository<Counseling, Long> {
    List<Counseling> findByApplicant(String applicant);
    List<Counseling> findAllByOrderByDateDesc();
}
