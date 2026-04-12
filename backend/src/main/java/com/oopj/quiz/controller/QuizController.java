package com.oopj.quiz.controller;

import com.oopj.quiz.model.FlashcardResponse;
import com.oopj.quiz.model.QuizResponse;
import com.oopj.quiz.service.AIService;
import com.oopj.quiz.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * REST Controller that exposes the quiz and flashcard generation API endpoints.
 *
 * Demonstrates:
 * - Dependency Injection via @Autowired (Spring manages object creation)
 * - Polymorphism (ResponseEntity<?> can hold any response type)
 * - Exception Handling (try-catch at controller level)
 * - Encapsulation (business logic delegated to service classes)
 *
 * @RestController = @Controller + @ResponseBody (auto-serializes return values to JSON)
 */
@RestController
@RequestMapping("/api")
public class QuizController {

    // Dependency Injection — Spring injects the service beans automatically
    @Autowired
    private PdfService pdfService;

    @Autowired
    private AIService aiService;

    /**
     * Generates a multiple-choice quiz from an uploaded PDF.
     *
     * Accepts: multipart/form-data with:
     *   - file         : PDF file
     *   - numQuestions : 5, 10, or 15
     *   - difficulty   : "easy", "medium", or "hard"
     *
     * Returns: JSON array of Question objects
     */
    @PostMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(
            @RequestParam("file") MultipartFile file,
            @RequestParam("numQuestions") int numQuestions,
            @RequestParam("difficulty") String difficulty) {

        try {
            // Step 1: Extract text from uploaded PDF (PdfService handles this)
            String pdfContent = pdfService.extractText(file);

            // Step 2: Generate quiz questions using Claude AI
            QuizResponse quiz = aiService.generateQuiz(pdfContent, numQuestions, difficulty);

            return ResponseEntity.ok(quiz);

        } catch (IllegalArgumentException e) {
            // Client error (bad input)
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            // Server error
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate quiz: " + e.getMessage()));
        }
    }

    /**
     * Generates 10 study flashcards from an uploaded PDF.
     *
     * Accepts: multipart/form-data with:
     *   - file : PDF file
     *
     * Returns: JSON array of Flashcard objects
     */
    @PostMapping("/generate-flashcards")
    public ResponseEntity<?> generateFlashcards(
            @RequestParam("file") MultipartFile file) {

        try {
            // Step 1: Extract text from uploaded PDF
            String pdfContent = pdfService.extractText(file);

            // Step 2: Generate flashcards using Claude AI
            FlashcardResponse flashcards = aiService.generateFlashcards(pdfContent);

            return ResponseEntity.ok(flashcards);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate flashcards: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint to verify the backend is running.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Java OOP Quiz Generator is running!"
        ));
    }
}
