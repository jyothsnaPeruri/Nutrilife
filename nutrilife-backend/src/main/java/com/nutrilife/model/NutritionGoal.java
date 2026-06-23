package com.nutrilife.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "nutrition_goals")
public class NutritionGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Min(0)
    private double dailyCalories;

    @Min(0)
    private double dailyProtein;

    @Min(0)
    private double dailyCarbs;

    @Min(0)
    private double dailyFat;

    @Min(0)
    private double dailyFiber;

    @Min(0)
    private int dailyWaterMl;

    @Min(0)
    private int weeklyWorkouts;

    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public NutritionGoal() {
    }

    public NutritionGoal(Long id, User user, double dailyCalories, double dailyProtein, double dailyCarbs, double dailyFat, double dailyFiber, int dailyWaterMl, int weeklyWorkouts, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.dailyCalories = dailyCalories;
        this.dailyProtein = dailyProtein;
        this.dailyCarbs = dailyCarbs;
        this.dailyFat = dailyFat;
        this.dailyFiber = dailyFiber;
        this.dailyWaterMl = dailyWaterMl;
        this.weeklyWorkouts = weeklyWorkouts;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(double dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public double getDailyProtein() {
        return dailyProtein;
    }

    public void setDailyProtein(double dailyProtein) {
        this.dailyProtein = dailyProtein;
    }

    public double getDailyCarbs() {
        return dailyCarbs;
    }

    public void setDailyCarbs(double dailyCarbs) {
        this.dailyCarbs = dailyCarbs;
    }

    public double getDailyFat() {
        return dailyFat;
    }

    public void setDailyFat(double dailyFat) {
        this.dailyFat = dailyFat;
    }

    public double getDailyFiber() {
        return dailyFiber;
    }

    public void setDailyFiber(double dailyFiber) {
        this.dailyFiber = dailyFiber;
    }

    public int getDailyWaterMl() {
        return dailyWaterMl;
    }

    public void setDailyWaterMl(int dailyWaterMl) {
        this.dailyWaterMl = dailyWaterMl;
    }

    public int getWeeklyWorkouts() {
        return weeklyWorkouts;
    }

    public void setWeeklyWorkouts(int weeklyWorkouts) {
        this.weeklyWorkouts = weeklyWorkouts;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NutritionGoal that = (NutritionGoal) o;
        return Double.compare(that.dailyCalories, dailyCalories) == 0 &&
                Double.compare(that.dailyProtein, dailyProtein) == 0 &&
                Double.compare(that.dailyCarbs, dailyCarbs) == 0 &&
                Double.compare(that.dailyFat, dailyFat) == 0 &&
                Double.compare(that.dailyFiber, dailyFiber) == 0 &&
                dailyWaterMl == that.dailyWaterMl &&
                weeklyWorkouts == that.weeklyWorkouts &&
                Objects.equals(id, that.id) &&
                Objects.equals(user, that.user) &&
                Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, dailyCalories, dailyProtein, dailyCarbs, dailyFat, dailyFiber, dailyWaterMl, weeklyWorkouts, updatedAt);
    }

    @Override
    public String toString() {
        return "NutritionGoal{" +
                "id=" + id +
                ", user=" + user +
                ", dailyCalories=" + dailyCalories +
                ", dailyProtein=" + dailyProtein +
                ", dailyCarbs=" + dailyCarbs +
                ", dailyFat=" + dailyFat +
                ", dailyFiber=" + dailyFiber +
                ", dailyWaterMl=" + dailyWaterMl +
                ", weeklyWorkouts=" + weeklyWorkouts +
                ", updatedAt=" + updatedAt +
                '}';
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private double dailyCalories;
        private double dailyProtein;
        private double dailyCarbs;
        private double dailyFat;
        private double dailyFiber;
        private int dailyWaterMl;
        private int weeklyWorkouts;
        private LocalDateTime updatedAt = LocalDateTime.now();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder dailyCalories(double dailyCalories) {
            this.dailyCalories = dailyCalories;
            return this;
        }

        public Builder dailyProtein(double dailyProtein) {
            this.dailyProtein = dailyProtein;
            return this;
        }

        public Builder dailyCarbs(double dailyCarbs) {
            this.dailyCarbs = dailyCarbs;
            return this;
        }

        public Builder dailyFat(double dailyFat) {
            this.dailyFat = dailyFat;
            return this;
        }

        public Builder dailyFiber(double dailyFiber) {
            this.dailyFiber = dailyFiber;
            return this;
        }

        public Builder dailyWaterMl(int dailyWaterMl) {
            this.dailyWaterMl = dailyWaterMl;
            return this;
        }

        public Builder weeklyWorkouts(int weeklyWorkouts) {
            this.weeklyWorkouts = weeklyWorkouts;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public NutritionGoal build() {
            return new NutritionGoal(id, user, dailyCalories, dailyProtein, dailyCarbs, dailyFat, dailyFiber, dailyWaterMl, weeklyWorkouts, updatedAt);
        }
    }
}