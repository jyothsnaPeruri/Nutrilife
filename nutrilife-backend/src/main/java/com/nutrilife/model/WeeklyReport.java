package com.nutrilife.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate weekStart;
    private LocalDate weekEnd;

    @Column(columnDefinition = "TEXT")
    private String reportData;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    private double avgDailyCalories;
    private double avgDailyProtein;
    private double avgDailyWaterMl;
    private int totalWorkouts;
    private int goalAchievementPercent;

    @Builder.Default
    private LocalDateTime generatedAt = LocalDateTime.now();

    private boolean emailSent;
}