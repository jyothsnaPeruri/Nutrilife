package com.nutrilife.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MealLogResponse {
    private Long id;
    private String mealName;
    private String mealType;
    private double calories;
    private double protein;
    private double carbs;
    private double fat;
    private double fiber;
    private String notes;
    private LocalDateTime loggedAt;
}