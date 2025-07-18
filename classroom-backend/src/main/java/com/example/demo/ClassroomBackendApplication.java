// package com.example.demo;

// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
// public class ClassroomBackendApplication {

// 	public static void main(String[] args) {
// 		SpringApplication.run(ClassroomBackendApplication.class, args);
// 	}

// }


package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example.demo.entity")
public class ClassroomBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClassroomBackendApplication.class, args);
	}

}
