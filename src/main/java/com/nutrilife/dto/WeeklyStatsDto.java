package com.nutrilife.dto;

public class WeeklyStatsDto {
    private String userName;
    private String userEmail;
    private double avgDailyCalories;
    private double avgDailyProtein;
    private double avgDailyCarbs;
    private double avgDailyFat;
    private double avgDailyFiber;
    private double avgDailyWaterMl;
    private int daysHydrationGoalMet;
    private int totalWorkouts;
    private double totalCaloriesBurned;
    private int totalWorkoutMinutes;
    private double calorieGoal;
    private double proteinGoal;
    private int waterGoal;
    private int workoutGoal;
    private int daysCalorieGoalMet;
    private int daysProteinGoalMet;
    private int totalMealsLogged;
    private String mostLoggedMealType;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String v) {
        this.userName = v;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String v) {
        this.userEmail = v;
    }

    public double getAvgDailyCalories() {
        return avgDailyCalories;
    }

    public void setAvgDailyCalories(double v) {
        this.avgDailyCalories = v;
    }

    public double getAvgDailyProtein() {
        return avgDailyProtein;
    }

    public void setAvgDailyProtein(double v) {
        this.avgDailyProtein = v;
    }

    public double getAvgDailyCarbs() {
        return avgDailyCarbs;
    }

    public void setAvgDailyCarbs(double v) {
        this.avgDailyCarbs = v;
    }

    public double getAvgDailyFat() {
        return avgDailyFat;
    }

    public void setAvgDailyFat(double v) {
        this.avgDailyFat = v;
    }

    public double getAvgDailyFiber() {
        return avgDailyFiber;
    }

    public void setAvgDailyFiber(double v) {
        this.avgDailyFiber = v;
    }

    public double getAvgDailyWaterMl() {
        return avgDailyWaterMl;
    }

    public void setAvgDailyWaterMl(double v) {
        this.avgDailyWaterMl = v;
    }

    public int getDaysHydrationGoalMet() {
        return daysHydrationGoalMet;
    }

    public void setDaysHydrationGoalMet(int v) {
        this.daysHydrationGoalMet = v;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(int v) {
        this.totalWorkouts = v;
    }

    public double getTotalCaloriesBurned() {
        return totalCaloriesBurned;
    }

    public void setTotalCaloriesBurned(double v) {
        this.totalCaloriesBurned = v;
    }

    public int getTotalWorkoutMinutes() {
        return totalWorkoutMinutes;
    }

    public void setTotalWorkoutMinutes(int v) {
        this.totalWorkoutMinutes = v;
    }

    public double getCalorieGoal() {
        return calorieGoal;
    }

    public void setCalorieGoal(double v) {
        this.calorieGoal = v;
    }

    public double getProteinGoal() {
        return proteinGoal;
    }

    public void setProteinGoal(double v) {
        this.proteinGoal = v;
    }

    public int getWaterGoal() {
        return waterGoal;
    }

    public void setWaterGoal(int v) {
        this.waterGoal = v;
    }

    public int getWorkoutGoal() {
        return workoutGoal;
    }

    public void setWorkoutGoal(int v) {
        this.workoutGoal = v;
    }

    public int getDaysCalorieGoalMet() {
        return daysCalorieGoalMet;
    }

    public void setDaysCalorieGoalMet(int v) {
        this.daysCalorieGoalMet = v;
    }

    public int getDaysProteinGoalMet() {
        return daysProteinGoalMet;
    }

    public void setDaysProteinGoalMet(int v) {
        this.daysProteinGoalMet = v;
    }

    public int getTotalMealsLogged() {
        return totalMealsLogged;
    }

    public void setTotalMealsLogged(int v) {
        this.totalMealsLogged = v;
    }

    public String getMostLoggedMealType() {
        return mostLoggedMealType;
    }

    public void setMostLoggedMealType(String v) {
        this.mostLoggedMealType = v;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final WeeklyStatsDto obj = new WeeklyStatsDto();

        public Builder userName(String v) {
            obj.userName = v;
            return this;
        }

        public Builder userEmail(String v) {
            obj.userEmail = v;
            return this;
        }

        public Builder avgDailyCalories(double v) {
            obj.avgDailyCalories = v;
            return this;
        }

        public Builder avgDailyProtein(double v) {
            obj.avgDailyProtein = v;
            return this;
        }

        public Builder avgDailyCarbs(double v) {
            obj.avgDailyCarbs = v;
            return this;
        }

        public Builder avgDailyFat(double v) {
            obj.avgDailyFat = v;
            return this;
        }

        public Builder avgDailyFiber(double v) {
            obj.avgDailyFiber = v;
            return this;
        }

        public Builder avgDailyWaterMl(double v) {
            obj.avgDailyWaterMl = v;
            return this;
        }

        public Builder daysHydrationGoalMet(int v) {
            obj.daysHydrationGoalMet = v;
            return this;
        }

        public Builder totalWorkouts(int v) {
            obj.totalWorkouts = v;
            return this;
        }

        public Builder totalCaloriesBurned(double v) {
            obj.totalCaloriesBurned = v;
            return this;
        }

        public Builder totalWorkoutMinutes(int v) {
            obj.totalWorkoutMinutes = v;
            return this;
        }

        public Builder calorieGoal(double v) {
            obj.calorieGoal = v;
            return this;
        }

        public Builder proteinGoal(double v) {
            obj.proteinGoal = v;
            return this;
        }

        public Builder waterGoal(int v) {
            obj.waterGoal = v;
            return this;
        }

        public Builder workoutGoal(int v) {
            obj.workoutGoal = v;
            return this;
        }

        public Builder daysCalorieGoalMet(int v) {
            obj.daysCalorieGoalMet = v;
            return this;
        }

        public Builder daysProteinGoalMet(int v) {
            obj.daysProteinGoalMet = v;
            return this;
        }

        public Builder totalMealsLogged(int v) {
            obj.totalMealsLogged = v;
            return this;
        }

        public Builder mostLoggedMealType(String v) {
            obj.mostLoggedMealType = v;
            return this;
        }

        public WeeklyStatsDto build() {
            return obj;
        }
    }
}