package com.quadrinhos.hq.bancohq.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private final String token;
    private final String username;
    private final String fullName;
    private final String role;
}
