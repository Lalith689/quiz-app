package com.oopj.quiz.model;

/**
 * Represents a single study flashcard with a front (term) and back (explanation).
 *
 * Demonstrates: Encapsulation, Constructor overloading.
 */
public class Flashcard {

    private String front;   // Concept or term
    private String back;    // Concise explanation (2-3 sentences)

    // Default constructor (required by Jackson)
    public Flashcard() {}

    // Parameterized constructor
    public Flashcard(String front, String back) {
        this.front = front;
        this.back = back;
    }

    // --- Getters and Setters ---

    public String getFront() {
        return front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return back;
    }

    public void setBack(String back) {
        this.back = back;
    }

    @Override
    public String toString() {
        return "Flashcard{front='" + front + "'}";
    }
}
