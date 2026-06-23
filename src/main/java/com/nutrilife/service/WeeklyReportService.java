package com.nutrilife.service;

import com.nutrilife.dto.*;
import com.nutrilife.model.*;
import com.nutrilife.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeeklyReportService {

        private final UserRepository userRepository;
        private final MealLogRepository mealLogRepository;
        private final WaterIntakeRepository waterIntakeRepository;
        private final WorkoutRepository workoutRepository;
        private final NutritionGoalRepository nutritionGoalRepository;
        private final WeeklyReportRepository weeklyReportRepository;
        private final ClaudeApiService claudeApiService;
        private final EmailService emailService;
        private final SimpMessagingTemplate messagingTemplate;

        // Runs every Sunday at 8:00 PM
        @Scheduled(cron = "0 0 20 * * SUN")
        public void generateWeeklyReportsForAllUsers() {
                System.out.println(">>> Generating weekly reports for all users...");
                List<User> users = userRepository.findAll();
                users.forEach(this::generateReportForUser);
                System.out.println(">>> Weekly reports generated for " + users.size() + " users");
        }

        // Generate report for a single user
        public WeeklyReportDto generateReportForUser(User user) {
                LocalDate weekEnd = LocalDate.now();
                LocalDate weekStart = weekEnd.minusDays(6);
                LocalDateTime start = weekStart.atStartOfDay();
                LocalDateTime end = weekEnd.atTime(23, 59, 59);

                // Collect weekly stats
                WeeklyStatsDto stats = collectWeeklyStats(user, start, end, weekStart, weekEnd);

                // Generate AI feedback
                String aiFeedback = claudeApiService.generateWeeklyFeedback(stats);

                // Calculate goal achievement
                int goalPct = (int) ((stats.getDaysCalorieGoalMet()
                                + stats.getDaysProteinGoalMet()
                                + stats.getDaysHydrationGoalMet()) / 3.0 * 100.0 / 7);

                // Save report
                WeeklyReport report = WeeklyReport.builder()
                                .user(user)
                                .weekStart(weekStart)
                                .weekEnd(weekEnd)
                                .aiFeedback(aiFeedback)
                                .avgDailyCalories(stats.getAvgDailyCalories())
                                .avgDailyProtein(stats.getAvgDailyProtein())
                                .avgDailyWaterMl(stats.getAvgDailyWaterMl())
                                .totalWorkouts(stats.getTotalWorkouts())
                                .goalAchievementPercent(goalPct)
                                .emailSent(false)
                                .build();
                WeeklyReport saved = weeklyReportRepository.save(report);

                // Send email
                emailService.sendWeeklyReport(
                                user.getEmail(), user.getName(), stats, aiFeedback);

                // Push in-app notification via WebSocket
                messagingTemplate.convertAndSend(
                                "/topic/report/" + user.getEmail(),
                                Map.of(
                                                "type", "WEEKLY_REPORT",
                                                "message", "Your weekly wellness report is ready!",
                                                "reportId", saved.getId()));

                // Mark email sent
                saved.setEmailSent(true);
                weeklyReportRepository.save(saved);

                return toDto(saved);
        }

        private WeeklyStatsDto collectWeeklyStats(User user,
                        LocalDateTime start, LocalDateTime end,
                        LocalDate weekStart, LocalDate weekEnd) {

                // Get all meals for the week
                List<MealLog> meals = mealLogRepository
                                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

                // Get all water logs
                List<WaterIntake> waterLogs = waterIntakeRepository
                                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

                // Get all workouts
                List<Workout> workouts = workoutRepository
                                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

                // Get goals
                NutritionGoal goal = nutritionGoalRepository.findByUser(user)
                                .orElse(NutritionGoal.builder()
                                                .dailyCalories(2000).dailyProtein(50)
                                                .dailyWaterMl(2500).weeklyWorkouts(5).build());

                // Calculate daily averages
                double totalCalories = meals.stream().mapToDouble(MealLog::getCalories).sum();
                double totalProtein = meals.stream().mapToDouble(MealLog::getProtein).sum();
                double totalCarbs = meals.stream().mapToDouble(MealLog::getCarbs).sum();
                double totalFat = meals.stream().mapToDouble(MealLog::getFat).sum();
                double totalFiber = meals.stream().mapToDouble(MealLog::getFiber).sum();
                int totalWater = waterLogs.stream().mapToInt(WaterIntake::getAmountMl).sum();

                // Count days goals were met
                int daysCalorieMet = 0, daysProteinMet = 0, daysHydrationMet = 0;
                for (int i = 0; i < 7; i++) {
                        LocalDateTime dayStart = weekStart.plusDays(i).atStartOfDay();
                        LocalDateTime dayEnd = weekStart.plusDays(i).atTime(23, 59, 59);

                        List<MealLog> dayMeals = mealLogRepository
                                        .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, dayStart, dayEnd);
                        List<WaterIntake> dayWater = waterIntakeRepository
                                        .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, dayStart, dayEnd);

                        double dayCalories = dayMeals.stream().mapToDouble(MealLog::getCalories).sum();
                        double dayProtein = dayMeals.stream().mapToDouble(MealLog::getProtein).sum();
                        int dayWaterMl = dayWater.stream().mapToInt(WaterIntake::getAmountMl).sum();

                        if (dayCalories >= goal.getDailyCalories() * 0.9)
                                daysCalorieMet++;
                        if (dayProtein >= goal.getDailyProtein() * 0.9)
                                daysProteinMet++;
                        if (dayWaterMl >= goal.getDailyWaterMl() * 0.9)
                                daysHydrationMet++;
                }

                // Most logged meal type
                String mostLoggedMealType = meals.stream()
                                .collect(Collectors.groupingBy(MealLog::getMealType, Collectors.counting()))
                                .entrySet().stream()
                                .max(Map.Entry.comparingByValue())
                                .map(Map.Entry::getKey)
                                .orElse("N/A");

                return WeeklyStatsDto.builder()
                                .userName(user.getName())
                                .userEmail(user.getEmail())
                                .avgDailyCalories(totalCalories / 7)
                                .avgDailyProtein(totalProtein / 7)
                                .avgDailyCarbs(totalCarbs / 7)
                                .avgDailyFat(totalFat / 7)
                                .avgDailyFiber(totalFiber / 7)
                                .avgDailyWaterMl(totalWater / 7.0)
                                .daysHydrationGoalMet(daysHydrationMet)
                                .totalWorkouts(workouts.size())
                                .totalCaloriesBurned(workouts.stream()
                                                .mapToDouble(Workout::getCaloriesBurned).sum())
                                .totalWorkoutMinutes(workouts.stream()
                                                .mapToInt(Workout::getDurationMinutes).sum())
                                .calorieGoal(goal.getDailyCalories())
                                .proteinGoal(goal.getDailyProtein())
                                .waterGoal(goal.getDailyWaterMl())
                                .workoutGoal(goal.getWeeklyWorkouts())
                                .daysCalorieGoalMet(daysCalorieMet)
                                .daysProteinGoalMet(daysProteinMet)
                                .totalMealsLogged(meals.size())
                                .mostLoggedMealType(mostLoggedMealType)
                                .build();
        }

        // Get reports for current user
        public List<WeeklyReportDto> getMyReports() {
                String email = SecurityContextHolder.getContext()
                                .getAuthentication().getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return weeklyReportRepository
                                .findTop5ByUserOrderByGeneratedAtDesc(user)
                                .stream().map(this::toDto).collect(Collectors.toList());
        }

        // Generate report manually for current user
        public WeeklyReportDto generateMyReport() {
                String email = SecurityContextHolder.getContext()
                                .getAuthentication().getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return generateReportForUser(user);
        }

        private WeeklyReportDto toDto(WeeklyReport r) {
                return WeeklyReportDto.builder()
                                .id(r.getId())
                                .weekStart(r.getWeekStart())
                                .weekEnd(r.getWeekEnd())
                                .aiFeedback(r.getAiFeedback())
                                .avgDailyCalories(r.getAvgDailyCalories())
                                .avgDailyProtein(r.getAvgDailyProtein())
                                .avgDailyWaterMl(r.getAvgDailyWaterMl())
                                .totalWorkouts(r.getTotalWorkouts())
                                .goalAchievementPercent(r.getGoalAchievementPercent())
                                .generatedAt(r.getGeneratedAt())
                                .build();
        }
}