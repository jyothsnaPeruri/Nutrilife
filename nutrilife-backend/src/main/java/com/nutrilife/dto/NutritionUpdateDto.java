package com.nutrilife.dto;

public class NutritionUpdateDto {
    private String userEmail;
    private double totalCalories;
    private double totalProtein;
    private double totalCarbs;
    private double totalFat;
    private int totalMeals;
    private int totalWaterMl;
    private int totalWorkouts;
    private String updateType;

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String v) {
        this.userEmail = v;
    }

    public double getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(double v) {
        this.totalCalories = v;
    }

    public double getTotalProtein() {
        return totalProtein;
    }

    public void setTotalProtein(double v) {
        this.totalProtein = v;
    }

    public double getTotalCarbs() {
        return totalCarbs;
    }

    public void setTotalCarbs(double v) {
        this.totalCarbs = v;
    }

    public double getTotalFat() {
        return totalFat;
    }

    public void setTotalFat(double v) {
        this.totalFat = v;
    }

    public int getTotalMeals() {
        return totalMeals;
    }

    public void setTotalMeals(int v) {
        this.totalMeals = v;
    }

    public int getTotalWaterMl() {
        return totalWaterMl;
    }

    public void setTotalWaterMl(int v) {
        this.totalWaterMl = v;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(int v) {
        this.totalWorkouts = v;
    }

    public String getUpdateType() {
        return updateType;
    }

    public void setUpdateType(String v) {
        this.updateType = v;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final NutritionUpdateDto obj = new NutritionUpdateDto();

        public Builder userEmail(String v) {
            obj.userEmail = v;
            return this;
        }

        public Builder totalCalories(double v) {
            obj.totalCalories = v;
            return this;
        }

        public Builder totalProtein(double v) {
            obj.totalProtein = v;
            return this;
        }

        public Builder totalCarbs(double v) {
            obj.totalCarbs = v;
            return this;
        }

        public Builder totalFat(double v) {
            obj.totalFat = v;
            return this;
        }

        public Builder totalMeals(int v) {
            obj.totalMeals = v;
            return this;
        }

        public Builder totalWaterMl(int v) {
            obj.totalWaterMl = v;
            return this;
        }

        public Builder totalWorkouts(int v) {
            obj.totalWorkouts = v;
            return this;
        }

        public Builder updateType(String v) {
            obj.updateType = v;
            return this;
        }

        public NutritionUpdateDto build() {
            return obj;
        }
    }
}