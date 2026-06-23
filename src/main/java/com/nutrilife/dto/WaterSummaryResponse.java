package com.nutrilife.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WaterSummaryResponse {
    private int totalMl;
    private int goalMl;
    private double percentage;
    private int remainingMl;
    private List<WaterIntakeResponse> logs;
}