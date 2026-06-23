package com.nutrilife.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    private String exerciseName;

    @NotBlank
    private String category; // CARDIO, STRENGTH, FLEXIBILITY, SPORTS

    @Min(1)
    private int durationMinutes;

    @Min(0)
    private double caloriesBurned;

    private String intensity; // LOW, MEDIUM, HIGH

    private int sets;
    private int reps;
    private double weightKg;

    private String notes;

    private LocalDateTime loggedAt = LocalDateTime.now();

    // Constructors
    public Workout() {
    }

    public Workout(Long id, User user, String exerciseName, String category, int durationMinutes, double caloriesBurned, String intensity, int sets, int reps, double weightKg, String notes, LocalDateTime loggedAt) {
        this.id = id;
        this.user = user;
        this.exerciseName = exerciseName;
        this.category = category;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.intensity = intensity;
        this.sets = sets;
        this.reps = reps;
        this.weightKg = weightKg;
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

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public String getIntensity() {
        return intensity;
    }

    public void setIntensity(String intensity) {
        this.intensity = intensity;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
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
        Workout workout = (Workout) o;
        return durationMinutes == workout.durationMinutes &&
                Double.compare(workout.caloriesBurned, caloriesBurned) == 0 &&
                sets == workout.sets &&
                reps == workout.reps &&
                Double.compare(workout.weightKg, weightKg) == 0 &&
                Objects.equals(id, workout.id) &&
                Objects.equals(user, workout.user) &&
                Objects.equals(exerciseName, workout.exerciseName) &&
                Objects.equals(category, workout.category) &&
                Objects.equals(intensity, workout.intensity) &&
                Objects.equals(notes, workout.notes) &&
                Objects.equals(loggedAt, workout.loggedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, exerciseName, category, durationMinutes, caloriesBurned, intensity, sets, reps, weightKg, notes, loggedAt);
    }

    @Override
    public String toString() {
        return "Workout{" +
                "id=" + id +
                ", user=" + user +
                ", exerciseName='" + exerciseName + '\'' +
                ", category='" + category + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", caloriesBurned=" + caloriesBurned +
                ", intensity='" + intensity + '\'' +
                ", sets=" + sets +
                ", reps=" + reps +
                ", weightKg=" + weightKg +
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
        private String exerciseName;
        private String category;
        private int durationMinutes;
        private double caloriesBurned;
        private String intensity;
        private int sets;
        private int reps;
        private double weightKg;
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

        public Builder exerciseName(String exerciseName) {
            this.exerciseName = exerciseName;
            return this;
        }

        public Builder category(String category) {
            this.category = category;
            return this;
        }

        public Builder durationMinutes(int durationMinutes) {
            this.durationMinutes = durationMinutes;
            return this;
        }

        public Builder caloriesBurned(double caloriesBurned) {
            this.caloriesBurned = caloriesBurned;
            return this;
        }

        public Builder intensity(String intensity) {
            this.intensity = intensity;
            return this;
        }

        public Builder sets(int sets) {
            this.sets = sets;
            return this;
        }

        public Builder reps(int reps) {
            this.reps = reps;
            return this;
        }

        public Builder weightKg(double weightKg) {
            this.weightKg = weightKg;
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

        public Workout build() {
            return new Workout(id, user, exerciseName, category, durationMinutes, caloriesBurned, intensity, sets, reps, weightKg, notes, loggedAt);
        }
    }
}