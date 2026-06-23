package com.nutrilife.service;

import com.nutrilife.dto.WeeklyStatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClaudeApiService {

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.url}")
    private String apiUrl;

    @Value("${claude.api.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateWeeklyFeedback(WeeklyStatsDto stats) {
        String prompt = buildPrompt(stats);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "max_tokens", 1024,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, Map.class);

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("content")) {
                List<Map<String, Object>> content = (List<Map<String, Object>>) body.get("content");
                if (!content.isEmpty()) {
                    return (String) content.get(0).get("text");
                }
            }
        } catch (Exception e) {
            return generateFallbackFeedback(stats);
        }
        return generateFallbackFeedback(stats);
    }

    private String buildPrompt(WeeklyStatsDto stats) {
        return String.format("""
                You are a professional nutritionist and wellness coach.
                Analyze this user's weekly health data and provide
                personalized, encouraging feedback.

                User: %s
                Week Summary:
                - Average daily calories: %.0f kcal (goal: %.0f kcal)
                - Average daily protein: %.1f g (goal: %.0f g)
                - Average daily carbs: %.1f g
                - Average daily fat: %.1f g
                - Average daily water: %.0f ml (goal: %d ml)
                - Days hydration goal met: %d/7
                - Days calorie goal met: %d/7
                - Days protein goal met: %d/7
                - Total workouts: %d (goal: %d/week)
                - Total calories burned: %.0f kcal
                - Total workout minutes: %d
                - Total meals logged: %d
                - Most logged meal type: %s

                Please provide:
                1. Overall performance summary (2-3 sentences)
                2. Top 2 achievements this week
                3. Top 2 areas for improvement with specific actionable tips
                4. Motivational closing message

                Keep the tone warm, encouraging and professional.
                Format with clear sections. Keep it under 300 words.
                """,
                stats.getUserName(),
                stats.getAvgDailyCalories(), stats.getCalorieGoal(),
                stats.getAvgDailyProtein(), stats.getProteinGoal(),
                stats.getAvgDailyCarbs(), stats.getAvgDailyFat(),
                stats.getAvgDailyWaterMl(), stats.getWaterGoal(),
                stats.getDaysHydrationGoalMet(),
                stats.getDaysCalorieGoalMet(),
                stats.getDaysProteinGoalMet(),
                stats.getTotalWorkouts(), stats.getWorkoutGoal(),
                stats.getTotalCaloriesBurned(),
                stats.getTotalWorkoutMinutes(),
                stats.getTotalMealsLogged(),
                stats.getMostLoggedMealType());
    }

    private String generateFallbackFeedback(WeeklyStatsDto stats) {
        return String.format("""
                Weekly Wellness Report for %s

                Great effort this week! Here's your summary:

                Nutrition: You averaged %.0f kcal per day and %.1fg of protein.
                Hydration: You met your water goal on %d out of 7 days.
                Fitness: You completed %d workouts burning %.0f calories total.

                Keep up the great work and stay consistent!
                """,
                stats.getUserName(),
                stats.getAvgDailyCalories(),
                stats.getAvgDailyProtein(),
                stats.getDaysHydrationGoalMet(),
                stats.getTotalWorkouts(),
                stats.getTotalCaloriesBurned());
    }
}