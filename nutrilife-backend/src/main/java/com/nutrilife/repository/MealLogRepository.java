package com.nutrilife.repository;

import com.nutrilife.model.MealLog;
import com.nutrilife.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface MealLogRepository extends JpaRepository<MealLog, Long> {

    List<MealLog> findByUserOrderByLoggedAtDesc(User user);

    List<MealLog> findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(
            User user, LocalDateTime start, LocalDateTime end);

    List<MealLog> findByUserAndMealTypeOrderByLoggedAtDesc(
            User user, String mealType);

    @Query("SELECT SUM(m.calories) FROM MealLog m WHERE m.user = :user " +
            "AND m.loggedAt BETWEEN :start AND :end")
    Double sumCaloriesByUserAndDate(@Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(m) FROM MealLog m WHERE m.user = :user " +
            "AND m.loggedAt BETWEEN :start AND :end")
    Long countMealsByUserAndDate(@Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}