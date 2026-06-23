package com.nutrilife.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WorkoutRequest {

    @NotBlank(message = "Exercise name is required")
    private String exerciseName;

    @NotBlank(message = "Category is required")
    private String category;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private int durationMinutes;

    @Min(0)
    private double caloriesBurned;

    private String intensity;
    private int sets;
    private int reps;
    private double weightKg;
    private String notes;
}