package com.oopj.quiz.model;

import java.util.List;

/**
 * Wrapper response object for the quiz API endpoint.
 * Jackson serializes this to JSON automatically.
 *
 * Demonstrates: Encapsulation, use of Generics (List<Question>).
 */
public class QuizResponse {

    private List<Question> questions;

    public QuizResponse() {}

    public QuizResponse(List<Question> questions) {
        this.questions = questions;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
