package com.agrowcrop.service;

import com.agrowcrop.model.OtpToken;
import com.agrowcrop.repository.OtpRepository;
import com.agrowcrop.service.sms.SmsSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepo;
    private final SmsSender smsSender; // Use interface
    private final java.security.SecureRandom random = new java.security.SecureRandom();
    private static final int MAX_ATTEMPTS = 5;

    public void sendOrResendOtp(String phone) {
        validatePhone(phone); // Strict check

        Optional<OtpToken> existing = otpRepo.findByPhone(phone);

        // If OTP exists and not expired, reuse it
        if (existing.isPresent() && !isExpired(existing.get())) {
            smsSender.sendOtp(phone, existing.get().getOtp());
            return;
        }

        // Otherwise generate new OTP
        String otp = generateOtp();
        OtpToken token = new OtpToken(phone, otp, Instant.now().plusSeconds(300)); // 5 minutes expiry
        // attempts initialized to 0 in constructor

        otpRepo.deleteByPhone(phone); // Clear existing
        otpRepo.save(token);

        smsSender.sendOtp(phone, otp);
    }

    public boolean verifyOtp(String phone, String otp) {
        validatePhone(phone);
        Optional<OtpToken> tokenOpt = otpRepo.findByPhone(phone);

        if (tokenOpt.isPresent()) {
            OtpToken token = tokenOpt.get();

            if (isExpired(token)) {
                otpRepo.deleteByPhone(phone);
                return false;
            }

            if (token.getAttempts() >= MAX_ATTEMPTS) {
                log.warn("OTP attempts exceeded for phone: {}", phone);
                otpRepo.deleteByPhone(phone); // Burn it
                return false;
            }

            if (token.getOtp().equals(otp)) {
                otpRepo.deleteByPhone(phone); // Validated, remove it
                return true;
            } else {
                // Increment attempts
                token.setAttempts(token.getAttempts() + 1);
                otpRepo.save(token);
            }
        }
        return false;
    }

    private String generateOtp() {
        return String.valueOf(100000 + random.nextInt(900000));
    }

    private boolean isExpired(OtpToken token) {
        return token.getExpiresAt().isBefore(Instant.now());
    }

    private void validatePhone(String phone) {
        if (phone == null || !phone.matches("^\\+91[6-9]\\d{9}$")) {
            // Check if it's a raw 10 digit number and auto-fix it for dev convenience, or
            // be strict
            // Per user request: STRICT regex for Indian numbers
            if (phone != null && phone.matches("^[6-9]\\d{9}$")) {
                // Allow 10-digit if user forgot +91, but let's be strict as requested or maybe
                // lenient for UX?
                // Plan said: "Strictly validate Indian mobile numbers (+91)"
                // User regex: ^\+91[6-9]\d{9}$
                throw new IllegalArgumentException("Invalid phone number. Must be in +91XXXXXXXXXX format.");
            }
            throw new IllegalArgumentException("Invalid Indian mobile number. Format: +91XXXXXXXXXX");
        }
    }
}
