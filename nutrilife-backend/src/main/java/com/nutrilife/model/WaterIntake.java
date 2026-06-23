package com.nutrilife.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_intake")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterIntake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Min(1)
    private int amountMl;

    private String note;

    @Builder.Default
    private LocalDateTime loggedAt = LocalDateTime.now();
}