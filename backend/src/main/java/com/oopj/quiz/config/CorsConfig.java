package com.oopj.quiz.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration - allows the React frontend (localhost:5173)
 * and any deployed domain to call our Java backend API.
 *
 * Demonstrates: Interface implementation (WebMvcConfigurer),
 * method overriding, and Spring configuration annotations.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] allowedOrigins = {
            "http://localhost:5173",      // Local development
            "http://localhost:3000",       // Alternative local port
            "https://*.vercel.app"         // Vercel production
        };
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*", "https://*.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
