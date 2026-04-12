package com.oopj.quiz.model;

import java.util.List;

/**
 * Wrapper response object for the flashcard API endpoint.
 *
 * Demonstrates: Encapsulation, use of Generics (List<Flashcard>).
 */
public class FlashcardResponse {

    private List<Flashcard> flashcards;

    public FlashcardResponse() {}

    public FlashcardResponse(List<Flashcard> flashcards) {
        this.flashcards = flashcards;
    }

    public List<Flashcard> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<Flashcard> flashcards) {
        this.flashcards = flashcards;
    }
}
