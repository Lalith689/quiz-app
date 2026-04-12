package com.oopj.quiz.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service responsible for extracting plain text from uploaded PDF files.
 * Uses Apache PDFBox library for PDF parsing.
 *
 * Demonstrates:
 * - Abstraction (hides PDF parsing complexity from the controller)
 * - Exception Handling (try-with-resources for safe resource management)
 * - The @Service annotation marks this as a Spring-managed bean
 */
@Service
public class PdfService {

    /**
     * Extracts all text content from a PDF file.
     *
     * Uses try-with-resources (a feature related to AutoCloseable) to ensure
     * the PDDocument is always closed — preventing resource leaks.
     *
     * @param file The uploaded PDF file
     * @return Extracted plain text content
     * @throws Exception If the file cannot be read or parsed
     */
    public String extractText(MultipartFile file) throws Exception {
        // Validate that the file is not empty
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or null");
        }

        // Validate file type
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported. Got: " + originalFilename);
        }

        // Try-with-resources ensures PDDocument is closed even if an exception occurs
        // This demonstrates Exception Handling + resource management from Module 4
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException("Could not extract text from PDF. The PDF may be image-based or encrypted.");
            }

            // Limit content to avoid exceeding API token limits (roughly 12,000 chars)
            if (text.length() > 12000) {
                text = text.substring(0, 12000) + "\n[Content truncated for processing]";
            }

            return text.trim();
        }
    }
}
