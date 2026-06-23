package com.nutrilife.controller;

import com.nutrilife.dto.*;
import com.nutrilife.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutResponse> logWorkout(
            @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.logWorkout(request));
    }

    @GetMapping
    public ResponseEntity<List<WorkoutResponse>> getAllWorkouts() {
        return ResponseEntity.ok(workoutService.getAllWorkouts());
    }

    @GetMapping("/today")
    public ResponseEntity<List<WorkoutResponse>> getTodayWorkouts() {
        return ResponseEntity.ok(workoutService.getTodayWorkouts());
    }

    @GetMapping("/summary")
    public ResponseEntity<WorkoutSummaryResponse> getTodaySummary() {
        return ResponseEntity.ok(workoutService.getTodaySummary());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.updateWorkout(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok().build();
    }
}