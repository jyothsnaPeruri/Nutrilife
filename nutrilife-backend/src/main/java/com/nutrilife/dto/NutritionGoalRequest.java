package com.nutrilife.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.*;

@Data
public class NutritionGoalRequest {

    @Min(value = 0, message = "Calories cannot be negative")
    private double dailyCalories;

    @Min(0)
    private double dailyProtein;

    @Min(0)
    private double dailyCarbs;

    @Min(0)
    private double dailyFat;

    @Min(0)
    private double dailyFiber;

    @Min(0)
    private int dailyWaterMl;

    @Min(0)
    private int weeklyWorkouts;
}