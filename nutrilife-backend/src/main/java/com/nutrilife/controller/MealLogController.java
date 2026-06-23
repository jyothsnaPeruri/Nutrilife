package com.nutrilife.controller;

import com.nutrilife.dto.*;
import com.nutrilife.service.MealLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealLogController {

    private final MealLogService mealLogService;

    // POST /api/meals — log a meal
    @PostMapping
    public ResponseEntity<MealLogResponse> logMeal(
            @Valid @RequestBody MealLogRequest request) {
        return ResponseEntity.ok(mealLogService.logMeal(request));
    }

    // GET /api/meals — get all meals
    @GetMapping
    public ResponseEntity<List<MealLogResponse>> getAllMeals() {
        return ResponseEntity.ok(mealLogService.getAllMeals());
    }

    // GET /api/meals/today — get today's meals
    @GetMapping("/today")
    public ResponseEntity<List<MealLogResponse>> getTodayMeals() {
        return ResponseEntity.ok(mealLogService.getTodayMeals());
    }

    // GET /api/meals/summary — get today's nutrition summary
    @GetMapping("/summary")
    public ResponseEntity<DailySummaryResponse> getTodaySummary() {
        return ResponseEntity.ok(mealLogService.getTodaySummary());
    }

    // PUT /api/meals/{id} — update a meal
    @PutMapping("/{id}")
    public ResponseEntity<MealLogResponse> updateMeal(
            @PathVariable Long id,
            @Valid @RequestBody MealLogRequest request) {
        return ResponseEntity.ok(mealLogService.updateMeal(id, request));
    }

    // DELETE /api/meals/{id} — delete a meal
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long id) {
        mealLogService.deleteMeal(id);
        return ResponseEntity.ok().build();
    }
}