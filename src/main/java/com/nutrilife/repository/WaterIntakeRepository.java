package com.nutrilife.repository;

import com.nutrilife.model.User;
import com.nutrilife.model.WaterIntake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface WaterIntakeRepository extends JpaRepository<WaterIntake, Long> {

    List<WaterIntake> findByUserAndLoggedAtBetweenOrderByLoggedAtDesc(
            User user, LocalDateTime start, LocalDateTime end);

    List<WaterIntake> findByUserOrderByLoggedAtDesc(User user);

    @Query("SELECT SUM(w.amountMl) FROM WaterIntake w WHERE w.user = :user " +
            "AND w.loggedAt BETWEEN :start AND :end")
    Integer sumAmountByUserAndDate(@Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}