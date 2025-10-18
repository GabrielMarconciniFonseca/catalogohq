package com.quadrinhos.hq.bancohq.config;

import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.model.Role;
import com.quadrinhos.hq.bancohq.model.UserAccount;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import com.quadrinhos.hq.bancohq.repository.UserAccountRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ItemRepository itemRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(final String... args) {
        if (itemRepository.count() > 0) {
            initializeUsers();
            return;
        }
        List<Item> items = Arrays.asList(
                Item.builder()
                        .title("Homem-Aranha: De Volta ao Lar")
                        .author("Stan Lee")
                        .publisher("Marvel")
                        .description("Edição especial do Homem-Aranha")
                        .price(new BigDecimal("29.90"))
                        .releaseDate(LocalDate.of(2017, 7, 5))
                        .stockQuantity(10)
                        .imageUrl(null)
                        .build(),
                Item.builder()
                        .title("Batman: Ano Um")
                        .author("Frank Miller")
                        .publisher("DC Comics")
                        .description("Clássico que redefine a origem do Batman")
                        .price(new BigDecimal("34.90"))
                        .releaseDate(LocalDate.of(1987, 2, 1))
                        .stockQuantity(7)
                        .imageUrl(null)
                        .build()
        );
        itemRepository.saveAll(items);
        initializeUsers();
    }

    private void initializeUsers() {
        if (userAccountRepository.count() == 0) {
            UserAccount admin = UserAccount.builder()
                    .username("admin")
                    .fullName("Administrador")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userAccountRepository.save(admin);
        }
    }
}
