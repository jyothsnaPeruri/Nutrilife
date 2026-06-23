package com.nutrilife.controller;

import com.nutrilife.dto.*;
import com.nutrilife.service.WaterIntakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/water")
@RequiredArgsConstructor
public class WaterIntakeController {

    private final WaterIntakeService waterIntakeService;

    // POST /api/water — log water
    @PostMapping
    public ResponseEntity<WaterIntakeResponse> logWater(
            @Valid @RequestBody WaterIntakeRequest request) {
        return ResponseEntity.ok(waterIntakeService.logWater(request));
    }

    // GET /api/water/summary — today's summary
    @GetMapping("/summary")
    public ResponseEntity<WaterSummaryResponse> getTodaySummary() {
        return ResponseEntity.ok(waterIntakeService.getTodaySummary());
    }

    // GET /api/water — all logs
    @GetMapping
    public ResponseEntity<List<WaterIntakeResponse>> getAllLogs() {
        return ResponseEntity.ok(waterIntakeService.getAllLogs());
    }

    // DELETE /api/water/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLog(@PathVariable Long id) {
        waterIntakeService.deleteLog(id);
        return ResponseEntity.ok().build();
    }
}