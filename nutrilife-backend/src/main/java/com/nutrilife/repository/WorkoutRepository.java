package com.nutrilife.repository;

import com.nutrilife.model.User;
import com.nutrilife.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    List<Workout> findByUserOrderByLoggedAtDesc(User user);

    List<Workout> findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(
            User user, LocalDateTime start, LocalDateTime end);

    List<Workout> findByUserAndCategoryOrderByLoggedAtDesc(
            User user, String category);

    @Query("SELECT SUM(w.caloriesBurned) FROM Workout w WHERE w.user = :user " +
            "AND w.loggedAt BETWEEN :start AND :end")
    Double sumCaloriesByUserAndDate(@Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT SUM(w.durationMinutes) FROM Workout w WHERE w.user = :user " +
            "AND w.loggedAt BETWEEN :start AND :end")
    Integer sumDurationByUserAndDate(@Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}