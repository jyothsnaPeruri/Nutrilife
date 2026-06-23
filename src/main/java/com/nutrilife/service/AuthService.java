package com.nutrilife.service;

import com.nutrilife.dto.*;
import com.nutrilife.model.User;
import com.nutrilife.repository.UserRepository;
import com.nutrilife.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authManager;

        public AuthResponse register(AuthRequest request) {
                System.out.println(">>> REGISTER called: " + request.getEmail());

                if (userRepository.existsByEmail(request.getEmail()))
                        throw new RuntimeException("Email already registered");

                System.out.println(">>> Building user...");
                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(User.Role.USER)
                                .build();

                System.out.println(">>> Saving user...");
                User savedUser = userRepository.save(user);
                System.out.println(">>> Saved! ID: " + savedUser.getId() + " Role: " + savedUser.getRole());

                System.out.println(">>> Generating token...");
                String token = jwtUtil.generateToken(savedUser.getEmail());
                System.out.println(">>> Done!");

                return new AuthResponse(
                                token,
                                savedUser.getName(),
                                savedUser.getEmail(),
                                savedUser.getRole().name());
        }

        public AuthResponse login(AuthRequest request) {
                System.out.println(">>> LOGIN called: " + request.getEmail());
                authManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(), request.getPassword()));
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                String token = jwtUtil.generateToken(user.getEmail());
                return new AuthResponse(
                                token,
                                user.getName(),
                                user.getEmail(),
                                user.getRole().name());
        }
}