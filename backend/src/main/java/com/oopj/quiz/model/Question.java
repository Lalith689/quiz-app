package com.oopj.quiz.model;

import java.util.List;

/**
 * Represents a single multiple-choice quiz question.
 *
 * Demonstrates: Encapsulation (private fields + public getters/setters),
 * Constructor overloading, and use of Java Collections (List).
 */
public class Question {

    private String question;
    private List<String> options;   // ["A. option1", "B. option2", "C. option3", "D. option4"]
    private String correctAnswer;   // "A", "B", "C", or "D"
    private String explanation;     // Why the correct answer is right (and others wrong)

    // Default constructor (required by Jackson for deserialization)
    public Question() {}

    // Parameterized constructor
    public Question(String question, List<String> options, String correctAnswer, String explanation) {
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }

    // --- Getters and Setters (Encapsulation) ---

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    @Override
    public String toString() {
        return "Question{" +
                "question='" + question + '\'' +
                ", correctAnswer='" + correctAnswer + '\'' +
                '}';
    }
}
