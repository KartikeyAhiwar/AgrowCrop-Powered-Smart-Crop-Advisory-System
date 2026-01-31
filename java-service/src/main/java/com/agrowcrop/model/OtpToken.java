package com.agrowcrop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "otp_tokens")
public class OtpToken {

    @Id
    private String id;
    private String phone;
    private String otp;
    private Instant expiresAt;
    private int attempts;

    public OtpToken(String phone, String otp, Instant expiresAt) {
        this.phone = phone;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.attempts = 0;
    }
}
