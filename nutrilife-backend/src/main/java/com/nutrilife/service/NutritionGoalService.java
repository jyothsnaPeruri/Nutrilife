package com.nutrilife.service;

import com.nutrilife.dto.*;
import com.nutrilife.model.NutritionGoal;
import com.nutrilife.model.User;
import com.nutrilife.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NutritionGoalService {

    private final NutritionGoalRepository goalRepository;
    private final UserRepository userRepository;
    private final MealLogRepository mealLogRepository;
    private final WaterIntakeRepository waterIntakeRepository;
    private final WorkoutRepository workoutRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private NutritionGoalResponse toResponse(NutritionGoal g) {
        return NutritionGoalResponse.builder()
                .id(g.getId())
                .dailyCalories(g.getDailyCalories())
                .dailyProtein(g.getDailyProtein())
                .dailyCarbs(g.getDailyCarbs())
                .dailyFat(g.getDailyFat())
                .dailyFiber(g.getDailyFiber())
                .dailyWaterMl(g.getDailyWaterMl())
                .weeklyWorkouts(g.getWeeklyWorkouts())
                .updatedAt(g.getUpdatedAt())
                .build();
    }

    // Save or update goal
    public NutritionGoalResponse saveGoal(NutritionGoalRequest request) {
        User user = getCurrentUser();
        NutritionGoal goal = goalRepository.findByUser(user)
                .orElse(NutritionGoal.builder().user(user).build());

        goal.setDailyCalories(request.getDailyCalories());
        goal.setDailyProtein(request.getDailyProtein());
        goal.setDailyCarbs(request.getDailyCarbs());
        goal.setDailyFat(request.getDailyFat());
        goal.setDailyFiber(request.getDailyFiber());
        goal.setDailyWaterMl(request.getDailyWaterMl());
        goal.setWeeklyWorkouts(request.getWeeklyWorkouts());
        goal.setUpdatedAt(LocalDateTime.now());

        return toResponse(goalRepository.save(goal));
    }

    // Get current goal
    public NutritionGoalResponse getGoal() {
        User user = getCurrentUser();
        return goalRepository.findByUser(user)
                .map(this::toResponse)
                .orElse(null);
    }

    // Get today's progress vs goals
    public GoalProgressResponse getTodayProgress() {
        User user = getCurrentUser();
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);

        // Get goal
        NutritionGoal goal = goalRepository.findByUser(user)
                .orElse(NutritionGoal.builder()
                        .dailyCalories(2000).dailyProtein(50)
                        .dailyCarbs(250).dailyFat(65)
                        .dailyFiber(25).dailyWaterMl(2500)
                        .weeklyWorkouts(5).build());

        // Get today's actuals
        List<com.nutrilife.model.MealLog> meals = mealLogRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

        double actualCalories = meals.stream().mapToDouble(m -> m.getCalories()).sum();
        double actualProtein = meals.stream().mapToDouble(m -> m.getProtein()).sum();
        double actualCarbs = meals.stream().mapToDouble(m -> m.getCarbs()).sum();
        double actualFat = meals.stream().mapToDouble(m -> m.getFat()).sum();
        double actualFiber = meals.stream().mapToDouble(m -> m.getFiber()).sum();

        Integer waterTotal = waterIntakeRepository
                .sumAmountByUserAndDate(user, start, end);
        int actualWater = waterTotal != null ? waterTotal : 0;

        // Weekly workouts
        LocalDateTime weekStart = LocalDate.now()
                .with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        List<com.nutrilife.model.Workout> workouts = workoutRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, weekStart, end);
        int actualWorkouts = workouts.size();

        return GoalProgressResponse.builder()
                .calorieGoal(goal.getDailyCalories())
                .calorieActual(actualCalories)
                .caloriePercent(pct(actualCalories, goal.getDailyCalories()))
                .proteinGoal(goal.getDailyProtein())
                .proteinActual(actualProtein)
                .proteinPercent(pct(actualProtein, goal.getDailyProtein()))
                .carbsGoal(goal.getDailyCarbs())
                .carbsActual(actualCarbs)
                .carbsPercent(pct(actualCarbs, goal.getDailyCarbs()))
                .fatGoal(goal.getDailyFat())
                .fatActual(actualFat)
                .fatPercent(pct(actualFat, goal.getDailyFat()))
                .fiberGoal(goal.getDailyFiber())
                .fiberActual(actualFiber)
                .fiberPercent(pct(actualFiber, goal.getDailyFiber()))
                .waterGoal(goal.getDailyWaterMl())
                .waterActual(actualWater)
                .waterPercent(pct(actualWater, goal.getDailyWaterMl()))
                .workoutGoal(goal.getWeeklyWorkouts())
                .workoutActual(actualWorkouts)
                .workoutPercent(pct(actualWorkouts, goal.getWeeklyWorkouts()))
                .build();
    }

    private double pct(double actual, double goal) {
        if (goal == 0)
            return 0;
        return Math.min(Math.round((actual / goal) * 1000.0) / 10.0, 100.0);
    }
}