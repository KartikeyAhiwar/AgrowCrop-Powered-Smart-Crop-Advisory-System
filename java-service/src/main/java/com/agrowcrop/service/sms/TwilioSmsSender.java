package com.agrowcrop.service.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Profile("prod") // Active only in prod
public class TwilioSmsSender implements SmsSender {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String fromNumber;

    @Override
    public void sendOtp(String phone, String otp) {
        if (accountSid.isEmpty() || authToken.isEmpty()) {
            log.warn("Twilio credentials missing in PROD profile. OTP for {} -> {}", phone, otp);
            return;
        }

        try {
            // Placeholder for actual Twilio SDK call
            // Message.creator(new PhoneNumber(phone), new PhoneNumber(fromNumber), "Your
            // AgroCrop OTP is: " + otp).create();
            log.info("Sending REAL SMS to {} via Twilio (Implement SDK here)", phone);
        } catch (Exception e) {
            log.error("Failed to send SMS to {}", phone, e);
        }
    }
}
