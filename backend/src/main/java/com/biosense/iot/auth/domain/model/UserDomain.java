package com.biosense.iot.auth.domain.model;

import java.time.Instant;

public class UserDomain {
    private Integer id;
    private String email;
    private String fullName;
    private String googleId;
    private String password;
    private Instant createdAt;

    public UserDomain() {}

    public UserDomain(Integer id, String email, String fullName, String googleId, String password, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.googleId = googleId;
        this.password = password;
        this.createdAt = createdAt;
    }

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public void updateInfo(String newEmail, String newName) {
        if (newEmail != null) this.email = newEmail;
        if (newName != null) this.fullName = newName;
    }
}
