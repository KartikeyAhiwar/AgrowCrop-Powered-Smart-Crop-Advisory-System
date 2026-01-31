package com.agrowcrop.service.sms;

public interface SmsSender {
    void sendOtp(String phone, String otp);
}
