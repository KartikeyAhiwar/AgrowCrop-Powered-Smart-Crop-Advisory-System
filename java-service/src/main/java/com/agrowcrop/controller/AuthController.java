package com.agrowcrop.controller;

import com.agrowcrop.dto.AuthRequest;
import com.agrowcrop.dto.AuthResponse;
import com.agrowcrop.model.User;
import com.agrowcrop.repository.UserRepository;
import com.agrowcrop.service.CustomUserDetailsService;
import com.agrowcrop.service.OtpService;
import com.agrowcrop.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/send-otp")
    public ResponseEntity<java.util.Map<String, String>> sendOtp(@RequestBody AuthRequest request) {
        otpService.sendOrResendOtp(request.getPhone());
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "OTP sent successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody AuthRequest request) {
        boolean isValid = otpService.verifyOtp(request.getPhone(), request.getOtp());
        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired OTP");
        }

        // Create user if not exists
        User user = userRepo.findByPhone(request.getPhone())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhone(request.getPhone());
                    newUser.setRole("ROLE_FARMER");
                    newUser.setVerified(true);
                    return userRepo.save(newUser);
                });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getPhone());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
    }

    @PostMapping("/login-admin")
    public ResponseEntity<?> loginAdmin(@RequestBody AuthRequest request) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        // This is a simplified check, in production use AuthenticationManager
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
    }
}
