package com.quadrinhos.hq.bancohq.service.impl;

import com.quadrinhos.hq.bancohq.dto.RegisterRequest;
import com.quadrinhos.hq.bancohq.model.Role;
import com.quadrinhos.hq.bancohq.model.UserAccount;
import com.quadrinhos.hq.bancohq.repository.UserAccountRepository;
import com.quadrinhos.hq.bancohq.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserAccount register(final RegisterRequest request) {
        String normalizedUsername = request.getUsername().toLowerCase();
        if (userAccountRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Usuário já cadastrado.");
        }
        UserAccount account = UserAccount.builder()
                .username(normalizedUsername)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)
                .build();
        return userAccountRepository.save(account);
    }

    @Override
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        return userAccountRepository.findByUsername(username.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));
    }
}
