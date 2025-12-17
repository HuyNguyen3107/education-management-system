package com.example.server.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class UpdateGradeRequestDto {
    private JsonNode scores;

    public JsonNode getScores() {
        return scores;
    }

    public void setScores(JsonNode scores) {
        this.scores = scores;
    }
}
