package com.nutrilife.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class WaterIntakeRequest {
    @Min(value = 1, message = "Amount must be at least 1ml")
    private int amountMl;
    private String note;
}