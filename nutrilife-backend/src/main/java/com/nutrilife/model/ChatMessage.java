package com.nutrilife.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String senderEmail;
    private String content;
    private String room;
    private String type; // CHAT, JOIN, LEAVE

    private LocalDateTime sentAt = LocalDateTime.now();

    // Constructors
    public ChatMessage() {
    }

    public ChatMessage(Long id, String senderName, String senderEmail, String content, String room, String type, LocalDateTime sentAt) {
        this.id = id;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.content = content;
        this.room = room;
        this.type = type;
        this.sentAt = sentAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessage that = (ChatMessage) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(senderName, that.senderName) &&
                Objects.equals(senderEmail, that.senderEmail) &&
                Objects.equals(content, that.content) &&
                Objects.equals(room, that.room) &&
                Objects.equals(type, that.type) &&
                Objects.equals(sentAt, that.sentAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, senderName, senderEmail, content, room, type, sentAt);
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id=" + id +
                ", senderName='" + senderName + '\'' +
                ", senderEmail='" + senderEmail + '\'' +
                ", content='" + content + '\'' +
                ", room='" + room + '\'' +
                ", type='" + type + '\'' +
                ", sentAt=" + sentAt +
                '}';
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String senderName;
        private String senderEmail;
        private String content;
        private String room;
        private String type;
        private LocalDateTime sentAt = LocalDateTime.now();

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder senderName(String senderName) {
            this.senderName = senderName;
            return this;
        }

        public Builder senderEmail(String senderEmail) {
            this.senderEmail = senderEmail;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder room(String room) {
            this.room = room;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder sentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public ChatMessage build() {
            return new ChatMessage(id, senderName, senderEmail, content, room, type, sentAt);
        }
    }
}