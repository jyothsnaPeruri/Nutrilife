package com.nutrilife.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkoutSummaryResponse {
    private int totalWorkouts;
    private int totalDurationMinutes;
    private double totalCaloriesBurned;
    private List<WorkoutResponse> workouts;
}