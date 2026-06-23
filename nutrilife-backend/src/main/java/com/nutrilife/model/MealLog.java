package com.nutrilife.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "meal_logs")
public class MealLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    private String mealName;

    @NotBlank
    private String mealType; // BREAKFAST, LUNCH, DINNER, SNACK

    @Min(0)
    private double calories;

    @Min(0)
    private double protein;

    @Min(0)
    private double carbs;

    @Min(0)
    private double fat;

    @Min(0)
    private double fiber;

    private String notes;

    private LocalDateTime loggedAt = LocalDateTime.now();

    // Constructors
    public MealLog() {
    }

    public MealLog(Long id, User user, String mealName, String mealType, double calories, double protein, double carbs, double fat, double fiber, String notes, LocalDateTime loggedAt) {
        this.id = id;
        this.user = user;
        this.mealName = mealName;
        this.mealType = mealType;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.fiber = fiber;
        this.notes = notes;
        this.loggedAt = loggedAt;
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

    public String getMealName() {
        return mealName;
    }

    public void setMealName(String mealName) {
        this.mealName = mealName;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public double getCalories() {
        return calories;
    }

    public void setCalories(double calories) {
        this.calories = calories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getFiber() {
        return fiber;
    }

    public void setFiber(double fiber) {
        this.fiber = fiber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }

    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MealLog mealLog = (MealLog) o;
        return Double.compare(mealLog.calories, calories) == 0 &&
                Double.compare(mealLog.protein, protein) == 0 &&
                Double.compare(mealLog.carbs, carbs) == 0 &&
                Double.compare(mealLog.fat, fat) == 0 &&
                Double.compare(mealLog.fiber, fiber) == 0 &&
                Objects.equals(id, mealLog.id) &&
                Objects.equals(user, mealLog.user) &&
                Objects.equals(mealName, mealLog.mealName) &&
                Objects.equals(mealType, mealLog.mealType) &&
                Objects.equals(notes, mealLog.notes) &&
                Objects.equals(loggedAt, mealLog.loggedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, mealName, mealType, calories, protein, carbs, fat, fiber, notes, loggedAt);
    }

    @Override
    public String toString() {
        return "MealLog{" +
                "id=" + id +
                ", user=" + user +
                ", mealName='" + mealName + '\'' +
                ", mealType='" + mealType + '\'' +
                ", calories=" + calories +
                ", protein=" + protein +
                ", carbs=" + carbs +
                ", fat=" + fat +
                ", fiber=" + fiber +
                ", notes='" + notes + '\'' +
                ", loggedAt=" + loggedAt +
                '}';
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String mealName;
        private String mealType;
        private double calories;
        private double protein;
        private double carbs;
        private double fat;
        private double fiber;
        private String notes;
        private LocalDateTime loggedAt = LocalDateTime.now();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder mealName(String mealName) {
            this.mealName = mealName;
            return this;
        }

        public Builder mealType(String mealType) {
            this.mealType = mealType;
            return this;
        }

        public Builder calories(double calories) {
            this.calories = calories;
            return this;
        }

        public Builder protein(double protein) {
            this.protein = protein;
            return this;
        }

        public Builder carbs(double carbs) {
            this.carbs = carbs;
            return this;
        }

        public Builder fat(double fat) {
            this.fat = fat;
            return this;
        }

        public Builder fiber(double fiber) {
            this.fiber = fiber;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public Builder loggedAt(LocalDateTime loggedAt) {
            this.loggedAt = loggedAt;
            return this;
        }

        public MealLog build() {
            return new MealLog(id, user, mealName, mealType, calories, protein, carbs, fat, fiber, notes, loggedAt);
        }
    }
}