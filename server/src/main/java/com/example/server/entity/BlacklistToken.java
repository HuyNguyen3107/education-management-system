package com.example.server.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "blacklist_token")
public class BlacklistToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String token;

    public BlacklistToken() {
    }

    public BlacklistToken(String token) {
        this.token = token;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
