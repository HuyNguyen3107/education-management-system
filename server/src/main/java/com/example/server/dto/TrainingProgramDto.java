package com.example.server.dto;

import java.util.List;

public class TrainingProgramDto {
    private String semester;
    private Float totalCredits;
    private List<SubjectResponseDto> subjects;

    public TrainingProgramDto() {
    }

    public TrainingProgramDto(String semester, Float totalCredits, List<SubjectResponseDto> subjects) {
        this.semester = semester;
        this.totalCredits = totalCredits;
        this.subjects = subjects;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public Float getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(Float totalCredits) {
        this.totalCredits = totalCredits;
    }

    public List<SubjectResponseDto> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectResponseDto> subjects) {
        this.subjects = subjects;
    }
}
