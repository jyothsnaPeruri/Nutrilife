package com.nutrilife.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DailySummaryResponse {
    private double totalCalories;
    private double totalProtein;
    private double totalCarbs;
    private double totalFat;
    private double totalFiber;
    private int totalMeals;
    private List<MealLogResponse> meals;
}