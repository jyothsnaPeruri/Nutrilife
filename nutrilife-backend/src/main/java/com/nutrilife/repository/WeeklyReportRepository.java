package com.nutrilife.repository;

import com.nutrilife.model.User;
import com.nutrilife.model.WeeklyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, Long> {
    List<WeeklyReport> findByUserOrderByGeneratedAtDesc(User user);

    List<WeeklyReport> findTop5ByUserOrderByGeneratedAtDesc(User user);
}