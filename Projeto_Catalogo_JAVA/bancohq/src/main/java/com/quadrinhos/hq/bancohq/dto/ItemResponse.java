package com.quadrinhos.hq.bancohq.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItemResponse {

    private final Long id;
    private final String title;
    private final String author;
    private final String publisher;
    private final String description;
    private final BigDecimal price;
    private final LocalDate releaseDate;
    private final Integer stockQuantity;
}
