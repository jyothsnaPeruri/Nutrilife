package com.nutrilife.dto;

public class GoalProgressResponse {
    private double calorieGoal, calorieActual, caloriePercent;
    private double proteinGoal, proteinActual, proteinPercent;
    private double carbsGoal, carbsActual, carbsPercent;
    private double fatGoal, fatActual, fatPercent;
    private double fiberGoal, fiberActual, fiberPercent;
    private int waterGoal, waterActual;
    private double waterPercent;
    private int workoutGoal, workoutActual;
    private double workoutPercent;

    public double getCalorieGoal() {
        return calorieGoal;
    }

    public void setCalorieGoal(double v) {
        this.calorieGoal = v;
    }

    public double getCalorieActual() {
        return calorieActual;
    }

    public void setCalorieActual(double v) {
        this.calorieActual = v;
    }

    public double getCaloriePercent() {
        return caloriePercent;
    }

    public void setCaloriePercent(double v) {
        this.caloriePercent = v;
    }

    public double getProteinGoal() {
        return proteinGoal;
    }

    public void setProteinGoal(double v) {
        this.proteinGoal = v;
    }

    public double getProteinActual() {
        return proteinActual;
    }

    public void setProteinActual(double v) {
        this.proteinActual = v;
    }

    public double getProteinPercent() {
        return proteinPercent;
    }

    public void setProteinPercent(double v) {
        this.proteinPercent = v;
    }

    public double getCarbsGoal() {
        return carbsGoal;
    }

    public void setCarbsGoal(double v) {
        this.carbsGoal = v;
    }

    public double getCarbsActual() {
        return carbsActual;
    }

    public void setCarbsActual(double v) {
        this.carbsActual = v;
    }

    public double getCarbsPercent() {
        return carbsPercent;
    }

    public void setCarbsPercent(double v) {
        this.carbsPercent = v;
    }

    public double getFatGoal() {
        return fatGoal;
    }

    public void setFatGoal(double v) {
        this.fatGoal = v;
    }

    public double getFatActual() {
        return fatActual;
    }

    public void setFatActual(double v) {
        this.fatActual = v;
    }

    public double getFatPercent() {
        return fatPercent;
    }

    public void setFatPercent(double v) {
        this.fatPercent = v;
    }

    public double getFiberGoal() {
        return fiberGoal;
    }

    public void setFiberGoal(double v) {
        this.fiberGoal = v;
    }

    public double getFiberActual() {
        return fiberActual;
    }

    public void setFiberActual(double v) {
        this.fiberActual = v;
    }

    public double getFiberPercent() {
        return fiberPercent;
    }

    public void setFiberPercent(double v) {
        this.fiberPercent = v;
    }

    public int getWaterGoal() {
        return waterGoal;
    }

    public void setWaterGoal(int v) {
        this.waterGoal = v;
    }

    public int getWaterActual() {
        return waterActual;
    }

    public void setWaterActual(int v) {
        this.waterActual = v;
    }

    public double getWaterPercent() {
        return waterPercent;
    }

    public void setWaterPercent(double v) {
        this.waterPercent = v;
    }

    public int getWorkoutGoal() {
        return workoutGoal;
    }

    public void setWorkoutGoal(int v) {
        this.workoutGoal = v;
    }

    public int getWorkoutActual() {
        return workoutActual;
    }

    public void setWorkoutActual(int v) {
        this.workoutActual = v;
    }

    public double getWorkoutPercent() {
        return workoutPercent;
    }

    public void setWorkoutPercent(double v) {
        this.workoutPercent = v;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final GoalProgressResponse obj = new GoalProgressResponse();

        public Builder calorieGoal(double v) {
            obj.calorieGoal = v;
            return this;
        }

        public Builder calorieActual(double v) {
            obj.calorieActual = v;
            return this;
        }

        public Builder caloriePercent(double v) {
            obj.caloriePercent = v;
            return this;
        }

        public Builder proteinGoal(double v) {
            obj.proteinGoal = v;
            return this;
        }

        public Builder proteinActual(double v) {
            obj.proteinActual = v;
            return this;
        }

        public Builder proteinPercent(double v) {
            obj.proteinPercent = v;
            return this;
        }

        public Builder carbsGoal(double v) {
            obj.carbsGoal = v;
            return this;
        }

        public Builder carbsActual(double v) {
            obj.carbsActual = v;
            return this;
        }

        public Builder carbsPercent(double v) {
            obj.carbsPercent = v;
            return this;
        }

        public Builder fatGoal(double v) {
            obj.fatGoal = v;
            return this;
        }

        public Builder fatActual(double v) {
            obj.fatActual = v;
            return this;
        }

        public Builder fatPercent(double v) {
            obj.fatPercent = v;
            return this;
        }

        public Builder fiberGoal(double v) {
            obj.fiberGoal = v;
            return this;
        }

        public Builder fiberActual(double v) {
            obj.fiberActual = v;
            return this;
        }

        public Builder fiberPercent(double v) {
            obj.fiberPercent = v;
            return this;
        }

        public Builder waterGoal(int v) {
            obj.waterGoal = v;
            return this;
        }

        public Builder waterActual(int v) {
            obj.waterActual = v;
            return this;
        }

        public Builder waterPercent(double v) {
            obj.waterPercent = v;
            return this;
        }

        public Builder workoutGoal(int v) {
            obj.workoutGoal = v;
            return this;
        }

        public Builder workoutActual(int v) {
            obj.workoutActual = v;
            return this;
        }

        public Builder workoutPercent(double v) {
            obj.workoutPercent = v;
            return this;
        }

        public GoalProgressResponse build() {
            return obj;
        }
    }
}