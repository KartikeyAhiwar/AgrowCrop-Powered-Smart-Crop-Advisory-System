package com.agrowcrop.service.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Profile("!prod") // Active in local/dev/default
public class ConsoleSmsSender implements SmsSender {

    @Override
    public void sendOtp(String phone, String otp) {
        log.info("------------------------------------------------");
        log.info("SIMULATED SMS (Local): OTP for {} is -> {}", phone, otp);
        log.info("------------------------------------------------");

        System.out.println("\n(LOCAL MODE) 🔐 OTP FOR " + phone + ": " + otp + "\n");
    }
}
