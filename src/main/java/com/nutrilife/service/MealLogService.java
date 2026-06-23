package com.nutrilife.service;

import com.nutrilife.dto.*;
import com.nutrilife.model.MealLog;
import com.nutrilife.model.User;
import com.nutrilife.repository.MealLogRepository;
import com.nutrilife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealLogService {

    private final MealLogRepository mealLogRepository;
    private final UserRepository userRepository;

    // Get current logged in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Convert entity to response DTO
    private MealLogResponse toResponse(MealLog meal) {
        return MealLogResponse.builder()
                .id(meal.getId())
                .mealName(meal.getMealName())
                .mealType(meal.getMealType())
                .calories(meal.getCalories())
                .protein(meal.getProtein())
                .carbs(meal.getCarbs())
                .fat(meal.getFat())
                .fiber(meal.getFiber())
                .notes(meal.getNotes())
                .loggedAt(meal.getLoggedAt())
                .build();
    }

    // Log a new meal
    public MealLogResponse logMeal(MealLogRequest request) {
        User user = getCurrentUser();
        MealLog meal = MealLog.builder()
                .user(user)
                .mealName(request.getMealName())
                .mealType(request.getMealType().toUpperCase())
                .calories(request.getCalories())
                .protein(request.getProtein())
                .carbs(request.getCarbs())
                .fat(request.getFat())
                .fiber(request.getFiber())
                .notes(request.getNotes())
                .build();
        return toResponse(mealLogRepository.save(meal));
    }

    // Get all meals for current user
    public List<MealLogResponse> getAllMeals() {
        User user = getCurrentUser();
        return mealLogRepository.findByUserOrderByLoggedAtDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get today's meals
    public List<MealLogResponse> getTodayMeals() {
        User user = getCurrentUser();
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);
        return mealLogRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get today's summary
    public DailySummaryResponse getTodaySummary() {
        User user = getCurrentUser();
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);

        List<MealLog> meals = mealLogRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

        double totalCalories = meals.stream().mapToDouble(MealLog::getCalories).sum();
        double totalProtein = meals.stream().mapToDouble(MealLog::getProtein).sum();
        double totalCarbs = meals.stream().mapToDouble(MealLog::getCarbs).sum();
        double totalFat = meals.stream().mapToDouble(MealLog::getFat).sum();
        double totalFiber = meals.stream().mapToDouble(MealLog::getFiber).sum();

        return DailySummaryResponse.builder()
                .totalCalories(totalCalories)
                .totalProtein(totalProtein)
                .totalCarbs(totalCarbs)
                .totalFat(totalFat)
                .totalFiber(totalFiber)
                .totalMeals(meals.size())
                .meals(meals.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    // Update a meal
    public MealLogResponse updateMeal(Long id, MealLogRequest request) {
        User user = getCurrentUser();
        MealLog meal = mealLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        if (!meal.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");

        meal.setMealName(request.getMealName());
        meal.setMealType(request.getMealType().toUpperCase());
        meal.setCalories(request.getCalories());
        meal.setProtein(request.getProtein());
        meal.setCarbs(request.getCarbs());
        meal.setFat(request.getFat());
        meal.setFiber(request.getFiber());
        meal.setNotes(request.getNotes());
        return toResponse(mealLogRepository.save(meal));
    }

    // Delete a meal
    public void deleteMeal(Long id) {
        User user = getCurrentUser();
        MealLog meal = mealLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));
        if (!meal.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        mealLogRepository.delete(meal);
    }
}