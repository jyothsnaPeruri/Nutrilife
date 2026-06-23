package com.nutrilife.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WeeklyReportDto {
    private Long id;
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private String aiFeedback;
    private double avgDailyCalories;
    private double avgDailyProtein;
    private double avgDailyWaterMl;
    private int totalWorkouts;
    private int goalAchievementPercent;
    private LocalDateTime generatedAt;
}