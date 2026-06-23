package com.nutrilife.repository;

import com.nutrilife.model.NutritionGoal;
import com.nutrilife.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NutritionGoalRepository extends JpaRepository<NutritionGoal, Long> {
    Optional<NutritionGoal> findByUser(User user);
}