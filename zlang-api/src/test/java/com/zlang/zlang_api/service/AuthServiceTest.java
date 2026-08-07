package com.zlang.zlang_api.service;
// Mokito allow us to test without any need of real DB
import com.zlang.zlang_api.dto.AuthResponse;
import com.zlang.zlang_api.dto.RegisterRequest;
import com.zlang.zlang_api.model.User;
import com.zlang.zlang_api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

//below annotation from JUnit 5, tells teh test runner to activate Mockito frmwrk
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock // creates a fake, controllable version of a class
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks // create real instance of authService class
    private AuthService authService;

    private RegisterRequest registerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setUsername("test@example.com");
        registerRequest.setPassword("password123");

        user = User.builder()
                .id("1")
                .name("Test User")
                .username("test@example.com")
                .password("hashedPassword123")
                .build();
    }

    @Test // actual test case
    @DisplayName("Should successfully register a new user")
    void shouldSuccessfullyRegisterUser() {
//        IMP - always follow this structure called - "ARRANGE , ACT, ASSERT" pattern

//        ARRANGE
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("mockJwtToken");

//        ACT
        AuthResponse authResponse = authService.register(registerRequest);

//        ASSERT -- checks if result of ACT step is what we expected
        assertNotNull(authResponse); // here asserted that the method returned an obj and no null
        assertEquals("mockJwtToken", authResponse.getToken()); // token inside the response obj is exact same token that jwtservice (mocked) was prgmed to rtrn
    }
}