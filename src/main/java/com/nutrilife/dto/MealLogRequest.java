package com.nutrilife.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MealLogRequest {

    @NotBlank(message = "Meal name is required")
    private String mealName;

    @NotBlank(message = "Meal type is required")
    private String mealType;

    @Min(value = 0, message = "Calories cannot be negative")
    private double calories;

    @Min(0)
    private double protein;

    @Min(0)
    private double carbs;

    @Min(0)
    private double fat;

    @Min(0)
    private double fiber;

    private String notes;
}