package com.oopj.quiz.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oopj.quiz.model.FlashcardResponse;
import com.oopj.quiz.model.QuizResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service that communicates with the Google Gemini API (FREE tier) to generate
 * quiz questions and flashcards from extracted PDF content.
 *
 * Model used: gemini-2.5-flash  →  FREE, no credit card needed
 * Free limits: 10 requests/min, 500 requests/day — plenty for a student project.
 *
 * Demonstrates:
 * - Abstraction (hides HTTP call complexity behind clean public methods)
 * - Encapsulation (private fields, private helper methods)
 * - Exception Handling (try-catch, custom error messages)  [Module 4]
 * - Collections (List, Map from Java Collections Framework) [Module 5]
 * - String operations (String.format, substring, indexOf)  [Module 5]
 *
 * @Service marks this as a Spring-managed singleton bean
 */
@Service
public class AIService {

    // Injected from application.properties → reads GEMINI_API_KEY env variable
    @Value("${gemini.api.key}")
    private String apiKey;

    // Gemini REST endpoint — API key goes as a query param, NOT in headers
    private static final String GEMINI_BASE_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    // RestTemplate for HTTP calls (Spring's HTTP client)
    private final RestTemplate restTemplate = new RestTemplate();

    // ObjectMapper for JSON serialization/deserialization
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ===== Public Methods =====

    /**
     * Generates multiple-choice quiz questions from PDF content.
     *
     * @param pdfContent   Extracted text from the PDF
     * @param numQuestions 5, 10, or 15
     * @param difficulty   "easy", "medium", or "hard"
     */
    public QuizResponse generateQuiz(String pdfContent, int numQuestions, String difficulty) throws Exception {
        if (numQuestions != 5 && numQuestions != 10 && numQuestions != 15) {
            throw new IllegalArgumentException("numQuestions must be 5, 10, or 15");
        }
        if (!List.of("easy", "medium", "hard").contains(difficulty.toLowerCase())) {
            throw new IllegalArgumentException("difficulty must be easy, medium, or hard");
        }

        String prompt     = buildQuizPrompt(pdfContent, numQuestions, difficulty.toLowerCase());
        String rawResponse = callGeminiAPI(prompt);
        String cleanJson   = extractJson(rawResponse);

        try {
            return objectMapper.readValue(cleanJson, QuizResponse.class);
        } catch (Exception e) {
            throw new RuntimeException(
                "Failed to parse quiz JSON from Gemini. First 200 chars: "
                + cleanJson.substring(0, Math.min(200, cleanJson.length())), e);
        }
    }

    /**
     * Generates exactly 10 study flashcards from PDF content.
     *
     * @param pdfContent Extracted text from the PDF
     */
    public FlashcardResponse generateFlashcards(String pdfContent) throws Exception {
        String prompt      = buildFlashcardPrompt(pdfContent);
        String rawResponse = callGeminiAPI(prompt);
        String cleanJson   = extractJson(rawResponse);

        try {
            return objectMapper.readValue(cleanJson, FlashcardResponse.class);
        } catch (Exception e) {
            throw new RuntimeException(
                "Failed to parse flashcard JSON from Gemini. First 200 chars: "
                + cleanJson.substring(0, Math.min(200, cleanJson.length())), e);
        }
    }

    // ===== Private Helper Methods (Abstraction) =====

    /**
     * Builds the quiz generation prompt.
     * Uses String.format — Module 5: String Operations.
     */
    private String buildQuizPrompt(String pdfContent, int numQuestions, String difficulty) {
        String guide = switch (difficulty) {
            case "easy"   -> "Focus on basic definitions, syntax, and simple recall of concepts.";
            case "medium" -> "Focus on application of concepts, comparing approaches, and moderate code understanding.";
            case "hard"   -> "Focus on complex scenarios, edge cases, multi-concept integration, and code analysis.";
            default       -> "Focus on application of concepts.";
        };

        return String.format("""
            You are an expert Java instructor creating a quiz for B.Tech CSE students \
            studying Object-Oriented Programming with Java.

            Generate exactly %d multiple-choice questions at %s difficulty.
            Difficulty guideline: %s

            Rules:
            - Each question must have exactly 4 options labeled A, B, C, D
            - Only one option is correct
            - Questions must be directly based on the PDF content provided
            - The explanation must say why the correct answer is right AND why each wrong option is wrong
            - For hard difficulty, include short code snippets in questions where relevant

            Return ONLY valid JSON — absolutely no markdown fences, no extra text before or after:
            {
              "questions": [
                {
                  "question": "Full question text here?",
                  "options": ["A. first option", "B. second option", "C. third option", "D. fourth option"],
                  "correctAnswer": "A",
                  "explanation": "A is correct because... B is wrong because... C is wrong because... D is wrong because..."
                }
              ]
            }

            PDF Content:
            %s
            """, numQuestions, difficulty, guide, pdfContent);
    }

    /**
     * Builds the flashcard generation prompt.
     */
    private String buildFlashcardPrompt(String pdfContent) {
        return String.format("""
            You are an expert Java instructor creating study flashcards for B.Tech CSE students.

            Generate exactly 10 flashcards covering the most important concepts from the PDF content.

            Rules:
            - Front: A clear concept name or short question (under 10 words)
            - Back: A concise explanation in 2-3 sentences MAX
            - Cover a variety of topics spread across the whole PDF, not just one section
            - Use simple, student-friendly language
            - Include a one-line code example on the back only when it genuinely helps

            Return ONLY valid JSON — absolutely no markdown fences, no extra text before or after:
            {
              "flashcards": [
                {
                  "front": "Term or short question",
                  "back": "Concise 2-3 sentence explanation. Optional: code example"
                }
              ]
            }

            PDF Content:
            %s
            """, pdfContent);
    }

    /**
     * Makes a POST request to the Google Gemini REST API.
     *
     * Gemini request format (different from Anthropic/OpenAI):
     * {
     *   "contents": [
     *     { "parts": [ { "text": "your prompt" } ] }
     *   ]
     * }
     *
     * Gemini response format:
     * {
     *   "candidates": [
     *     { "content": { "parts": [ { "text": "model reply" } ] } }
     *   ]
     * }
     *
     * Demonstrates: Collections (HashMap, List, nested Map), HTTP POST, JSON parsing.
     */
    @SuppressWarnings("unchecked")
    private String callGeminiAPI(String prompt) {
        // Gemini uses the API key as a URL query param — no Authorization header needed
        String url = GEMINI_BASE_URL + apiKey;

        // Build request headers (only Content-Type needed)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build Gemini-specific request body structure
        // contents → parts → text  (this is Gemini's format, different from OpenAI/Claude)
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        // Add generation config — ask for JSON output mode
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        requestBody.put("generationConfig", generationConfig);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class
            );

            if (response.getBody() == null) {
                throw new RuntimeException("Empty response from Gemini API");
            }

            // Navigate: candidates[0] → content → parts[0] → text
            List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.getBody().get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in Gemini response. Body: " + response.getBody());
            }

            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentMap     = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts     = (List<Map<String, Object>>) contentMap.get("parts");

            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No parts in Gemini response content");
            }

            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts a clean JSON object from a string that may contain markdown fences.
     * Even with responseMimeType=application/json, Gemini occasionally wraps output.
     *
     * Strategy: find the first '{' and the last '}' and slice between them.
     * Demonstrates: String operations — indexOf, lastIndexOf, substring [Module 5].
     *
     * @param text Raw text from the model
     * @return Clean JSON string
     */
    private String extractJson(String text) {
        if (text == null) return "{}";
        text = text.trim();

        // Find outermost JSON object boundaries
        int start = text.indexOf('{');
        int end   = text.lastIndexOf('}');

        if (start != -1 && end != -1 && end > start) {
            return text.substring(start, end + 1);
        }

        // Fallback: strip markdown fences manually
        if (text.startsWith("```json")) text = text.substring(7);
        else if (text.startsWith("```"))  text = text.substring(3);
        if (text.endsWith("```"))         text = text.substring(0, text.length() - 3);

        return text.trim();
    }
}
