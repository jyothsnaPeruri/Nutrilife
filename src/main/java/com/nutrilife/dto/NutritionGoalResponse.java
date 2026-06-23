package com.nutrilife.dto;

import java.time.LocalDateTime;

public class NutritionGoalResponse {
    private Long id;
    private double dailyCalories;
    private double dailyProtein;
    private double dailyCarbs;
    private double dailyFat;
    private double dailyFiber;
    private int dailyWaterMl;
    private int weeklyWorkouts;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long v) {
        this.id = v;
    }

    public double getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(double v) {
        this.dailyCalories = v;
    }

    public double getDailyProtein() {
        return dailyProtein;
    }

    public void setDailyProtein(double v) {
        this.dailyProtein = v;
    }

    public double getDailyCarbs() {
        return dailyCarbs;
    }

    public void setDailyCarbs(double v) {
        this.dailyCarbs = v;
    }

    public double getDailyFat() {
        return dailyFat;
    }

    public void setDailyFat(double v) {
        this.dailyFat = v;
    }

    public double getDailyFiber() {
        return dailyFiber;
    }

    public void setDailyFiber(double v) {
        this.dailyFiber = v;
    }

    public int getDailyWaterMl() {
        return dailyWaterMl;
    }

    public void setDailyWaterMl(int v) {
        this.dailyWaterMl = v;
    }

    public int getWeeklyWorkouts() {
        return weeklyWorkouts;
    }

    public void setWeeklyWorkouts(int v) {
        this.weeklyWorkouts = v;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime v) {
        this.updatedAt = v;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final NutritionGoalResponse obj = new NutritionGoalResponse();

        public Builder id(Long v) {
            obj.id = v;
            return this;
        }

        public Builder dailyCalories(double v) {
            obj.dailyCalories = v;
            return this;
        }

        public Builder dailyProtein(double v) {
            obj.dailyProtein = v;
            return this;
        }

        public Builder dailyCarbs(double v) {
            obj.dailyCarbs = v;
            return this;
        }

        public Builder dailyFat(double v) {
            obj.dailyFat = v;
            return this;
        }

        public Builder dailyFiber(double v) {
            obj.dailyFiber = v;
            return this;
        }

        public Builder dailyWaterMl(int v) {
            obj.dailyWaterMl = v;
            return this;
        }

        public Builder weeklyWorkouts(int v) {
            obj.weeklyWorkouts = v;
            return this;
        }

        public Builder updatedAt(LocalDateTime v) {
            obj.updatedAt = v;
            return this;
        }

        public NutritionGoalResponse build() {
            return obj;
        }
    }
}