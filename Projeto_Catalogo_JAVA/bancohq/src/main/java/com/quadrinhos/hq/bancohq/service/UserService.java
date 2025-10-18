package com.quadrinhos.hq.bancohq.service;

import com.quadrinhos.hq.bancohq.dto.RegisterRequest;
import com.quadrinhos.hq.bancohq.model.UserAccount;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    UserAccount register(RegisterRequest request);
}
