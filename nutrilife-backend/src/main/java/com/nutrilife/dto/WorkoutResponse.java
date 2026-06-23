package com.nutrilife.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkoutResponse {
    private Long id;
    private String exerciseName;
    private String category;
    private int durationMinutes;
    private double caloriesBurned;
    private String intensity;
    private int sets;
    private int reps;
    private double weightKg;
    private String notes;
    private LocalDateTime loggedAt;
}