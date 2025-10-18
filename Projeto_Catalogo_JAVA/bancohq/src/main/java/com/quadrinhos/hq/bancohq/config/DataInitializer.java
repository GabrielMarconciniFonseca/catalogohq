package com.quadrinhos.hq.bancohq.config;

import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ItemRepository itemRepository;

    @Override
    public void run(final String... args) {
        if (itemRepository.count() > 0) {
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
                        .build(),
                Item.builder()
                        .title("Batman: Ano Um")
                        .author("Frank Miller")
                        .publisher("DC Comics")
                        .description("Clássico que redefine a origem do Batman")
                        .price(new BigDecimal("34.90"))
                        .releaseDate(LocalDate.of(1987, 2, 1))
                        .stockQuantity(7)
                        .build()
        );
        itemRepository.saveAll(items);
    }
}
