package com.nutrilife.service;

import com.nutrilife.dto.WaterIntakeRequest;
import com.nutrilife.dto.WaterIntakeResponse;
import com.nutrilife.dto.WaterSummaryResponse;
import com.nutrilife.model.User;
import com.nutrilife.model.WaterIntake;
import com.nutrilife.repository.UserRepository;
import com.nutrilife.repository.WaterIntakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WaterIntakeService {

    private final WaterIntakeRepository waterIntakeRepository;
    private final UserRepository userRepository;

    private static final int DAILY_GOAL_ML = 2500;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WaterIntakeResponse toResponse(WaterIntake w) {
        return WaterIntakeResponse.builder()
                .id(w.getId())
                .amountMl(w.getAmountMl())
                .note(w.getNote())
                .loggedAt(w.getLoggedAt())
                .build();
    }

    // Log water intake
    public WaterIntakeResponse logWater(WaterIntakeRequest request) {
        User user = getCurrentUser();
        WaterIntake water = WaterIntake.builder()
                .user(user)
                .amountMl(request.getAmountMl())
                .note(request.getNote())
                .build();
        return toResponse(waterIntakeRepository.save(water));
    }

    // Get today's water summary
    public WaterSummaryResponse getTodaySummary() {
        User user = getCurrentUser();
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59);

        List<WaterIntake> logs = waterIntakeRepository
                .findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(user, start, end);

        Integer total = waterIntakeRepository
                .sumAmountByUserAndDate(user, start, end);
        int totalMl = total != null ? total : 0;

        double percentage = Math.min((totalMl * 100.0) / DAILY_GOAL_ML, 100.0);
        int remaining = Math.max(DAILY_GOAL_ML - totalMl, 0);

        return WaterSummaryResponse.builder()
                .totalMl(totalMl)
                .goalMl(DAILY_GOAL_ML)
                .percentage(Math.round(percentage * 10.0) / 10.0)
                .remainingMl(remaining)
                .logs(logs.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    // Get all water logs
    public List<WaterIntakeResponse> getAllLogs() {
        User user = getCurrentUser();
        return waterIntakeRepository.findByUserOrderByLoggedAtDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Delete a water log
    public void deleteLog(Long id) {
        User user = getCurrentUser();
        WaterIntake water = waterIntakeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        if (!water.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        waterIntakeRepository.delete(water);
    }
}