package com.nutrilife.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WaterIntakeResponse {
    private Long id;
    private int amountMl;
    private String note;
    private LocalDateTime loggedAt;
}