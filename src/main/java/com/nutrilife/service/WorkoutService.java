package com.nutrilife.service;

import com.nutrilife.dto.WorkoutRequest;
import com.nutrilife.dto.WorkoutResponse;
import com.nutrilife.dto.WorkoutSummaryResponse;
import com.nutrilife.model.User;
import com.nutrilife.model.Workout;
import com.nutrilife.repository.UserRepository;
import com.nutrilife.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WorkoutResponse toResponse(Workout w) {
        return WorkoutResponse.builder()
                .id(w.getId())
                .exerciseName(w.getExerciseName())
                .category(w.getCategory())
                .durationMinutes(w.getDurationMinutes())
                .caloriesBurned(w.getCaloriesBurned())
                .intensity(w.getIntensity())
                .sets(w.getSets())
                .reps(w.getReps())
                .weightKg(w.getWeightKg())
                .notes(w.getNotes())
                .loggedAt(w.getLoggedAt())
                .build();
    }

    // Log a workout
    public WorkoutResponse logWorkout(WorkoutRequest request) {
        User user = getCurrentUser();
        Workout workout = Workout.builder()
                .user(user)
                .exerciseName(request.getExerciseName())
                .category(request.getCategory().toUpperCase())
                .durationMinutes(request.getDurationMinutes())
                .caloriesBurned(request.getCaloriesBurned())
                .intensity(request.getIntensity() != null ? request.getIntensity().toUpperCase() : "MEDIUM")
                .sets(request.getSets())
                .reps(request.getReps())
                .weightKg(request.getWeightKg())
                .notes(request.getNotes())
                .build();
        return toResponse(workoutRepository.save(workout));
    }

    // Get all workouts
    public List<WorkoutResponse> getAllWorkouts() {
        User user = getCurrentUser();
        return workoutRepository.findByUserOrderByLoggedAtDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get today's workouts
    public List<WorkoutResponse> getTodayWorkouts() {
        User user = getCurrentUser();
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);
        return workoutRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get today's summary
    public WorkoutSummaryResponse getTodaySummary() {
        User user = getCurrentUser();
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);

        List<Workout> workouts = workoutRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

        Double totalCalories = workoutRepository
                .sumCaloriesByUserAndDate(user, start, end);
        Integer totalDuration = workoutRepository
                .sumDurationByUserAndDate(user, start, end);

        return WorkoutSummaryResponse.builder()
                .totalWorkouts(workouts.size())
                .totalDurationMinutes(totalDuration != null ? totalDuration : 0)
                .totalCaloriesBurned(totalCalories != null ? totalCalories : 0)
                .workouts(workouts.stream().map(this::toResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    // Update workout
    public WorkoutResponse updateWorkout(Long id, WorkoutRequest request) {
        User user = getCurrentUser();
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");

        workout.setExerciseName(request.getExerciseName());
        workout.setCategory(request.getCategory().toUpperCase());
        workout.setDurationMinutes(request.getDurationMinutes());
        workout.setCaloriesBurned(request.getCaloriesBurned());
        workout.setIntensity(request.getIntensity() != null ? request.getIntensity().toUpperCase() : "MEDIUM");
        workout.setSets(request.getSets());
        workout.setReps(request.getReps());
        workout.setWeightKg(request.getWeightKg());
        workout.setNotes(request.getNotes());
        return toResponse(workoutRepository.save(workout));
    }

    // Delete workout
    public void deleteWorkout(Long id) {
        User user = getCurrentUser();
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        workoutRepository.delete(workout);
    }
}