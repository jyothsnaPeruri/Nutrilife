package com.nutrilife.controller;

import com.nutrilife.dto.WeeklyReportDto;
import com.nutrilife.service.EmailService;
import com.nutrilife.service.WeeklyReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class WeeklyReportController {

    private final WeeklyReportService weeklyReportService;
    private final EmailService emailService;

    // GET /api/reports — get my reports
    @GetMapping
    public ResponseEntity<List<WeeklyReportDto>> getMyReports() {
        return ResponseEntity.ok(weeklyReportService.getMyReports());
    }

    // POST /api/reports/generate — generate report now (for testing)
    @PostMapping("/generate")
    public ResponseEntity<WeeklyReportDto> generateNow() {
        return ResponseEntity.ok(weeklyReportService.generateMyReport());
    }

}