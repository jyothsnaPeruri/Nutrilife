package com.nutrilife.controller;

import com.nutrilife.dto.*;
import com.nutrilife.service.NutritionGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class NutritionGoalController {

    private final NutritionGoalService goalService;

    // POST or PUT /api/goals — save or update goal
    @PostMapping
    public ResponseEntity<NutritionGoalResponse> saveGoal(
            @Valid @RequestBody NutritionGoalRequest request) {
        return ResponseEntity.ok(goalService.saveGoal(request));
    }

    // GET /api/goals — get current goal
    @GetMapping
    public ResponseEntity<NutritionGoalResponse> getGoal() {
        return ResponseEntity.ok(goalService.getGoal());
    }

    // GET /api/goals/progress — today's progress vs goals
    @GetMapping("/progress")
    public ResponseEntity<GoalProgressResponse> getTodayProgress() {
        return ResponseEntity.ok(goalService.getTodayProgress());
    }
}