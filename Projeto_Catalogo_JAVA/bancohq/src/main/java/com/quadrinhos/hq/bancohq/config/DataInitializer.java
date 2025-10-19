package com.quadrinhos.hq.bancohq.config;

import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.model.ItemStatus;
import com.quadrinhos.hq.bancohq.model.Role;
import com.quadrinhos.hq.bancohq.model.UserAccount;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import com.quadrinhos.hq.bancohq.repository.UserAccountRepository;
import java.util.Arrays;
import java.util.LinkedHashSet;
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
        if (itemRepository.count() == 0) {
            seedItems();
        }
        initializeUsers();
    }

    private void seedItems() {
        List<Item> items = Arrays.asList(
                Item.builder()
                        .title("Homem-Aranha: Coleção Definitiva")
                        .series("Homem-Aranha")
                        .issueNumber("1")
                        .publisher("Marvel")
                        .language("Português")
                        .condition("Excelente")
                        .location("Estante A")
                        .description("Edição de colecionador com capa dura e extras.")
                        .status(ItemStatus.OWNED)
                        .tags(new LinkedHashSet<>(List.of("marvel", "spider-man", "coleção")))
                        .build(),
                Item.builder()
                        .title("Batman: Ano Um")
                        .series("Batman")
                        .issueNumber("1")
                        .publisher("DC Comics")
                        .language("Português")
                        .condition("Bom")
                        .location("Estante B")
                        .description("Clássico que redefine a origem do Cavaleiro das Trevas.")
                        .status(ItemStatus.WISHLIST)
                        .tags(new LinkedHashSet<>(List.of("dc", "frank miller")))
                        .build());
        itemRepository.saveAll(items);
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
