package com.zlang.zlang_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//token after login
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class
AuthResponse {
    private String token;
}