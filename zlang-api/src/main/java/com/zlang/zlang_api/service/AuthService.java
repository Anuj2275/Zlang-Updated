package com.zlang.zlang_api.service;

import com.zlang.zlang_api.dto.AuthRequest;
import com.zlang.zlang_api.dto.AuthResponse;
import com.zlang.zlang_api.dto.RegisterRequest;
import com.zlang.zlang_api.model.User;
import com.zlang.zlang_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service //service component, business rules
@RequiredArgsConstructor // auto creation of constructor and injects dependencies declared with private final (DI),(like userRepo,passwrEnco)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request){
        var user = User.builder() // create new user obj, data comes from req DTO
                .name(request.getName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword())) // hashed pass is gener... when logging in hashes are compared
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);// goes to JWT service
        return AuthResponse.builder().token(jwtToken).build();
    }

// first finds the user in DB where it uses user details service bean
// once it has user obj(include hashed pass) now we to verify pass typed by user   -- here it uses passwordEncoder
    public AuthResponse login(AuthRequest request){
        try {
            authenticationManager.authenticate( // this tiggers spring security's entire authentication prscs... --> creates UsernamePasswordAuthenticationToken (temp login req) and hand it off to AuthenticationManager
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            System.out.println("!!! AUTHENTICATION FAILED !!!");
            System.out.println("Error Type: " + e.getClass().getSimpleName());
            System.out.println("Error Message: " + e.getMessage());
            throw e;
        }

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}