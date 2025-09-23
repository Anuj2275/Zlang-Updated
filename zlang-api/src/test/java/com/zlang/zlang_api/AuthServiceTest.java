package com.zlang.zlang_api;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.zlang.zlang_api.dto.AuthRequest;
import com.zlang.zlang_api.dto.AuthResponse;
import com.zlang.zlang_api.dto.RegisterRequest;
import com.zlang.zlang_api.model.User;
import com.zlang.zlang_api.repository.UserRepository;
import com.zlang.zlang_api.service.AuthService;
import com.zlang.zlang_api.service.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegisterUser_Success() {
        // Given
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password123");
        User user = new User("123", "Test User", "test@example.com", "hashedPassword");
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("fake.jwt.token");

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertNotNull(response.getToken());
        assertEquals("fake.jwt.token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_UserExists() {
        // Given
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "Password123");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(new User()));

        // When/Then
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void testLogin_Success() {
        // Given
        AuthRequest request = new AuthRequest("test@example.com", "Password123");
        User user = new User("123", "Test User", "test@example.com", "hashedPassword");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(User.class))).thenReturn("new.fake.jwt.token");

        // When
        AuthResponse response = authService.login(request);

        // Then
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertNotNull(response.getToken());
        assertEquals("new.fake.jwt.token", response.getToken());
    }
}