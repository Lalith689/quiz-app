package com.oopj.quiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Java OOP Quiz Generator application.
 * 
 * Demonstrates: Annotations, Spring Boot auto-configuration,
 * and the application lifecycle typical in enterprise Java.
 */
@SpringBootApplication
public class QuizApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizApplication.class, args);
    }
}
