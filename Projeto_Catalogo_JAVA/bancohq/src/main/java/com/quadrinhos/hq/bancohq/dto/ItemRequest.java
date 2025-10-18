package com.quadrinhos.hq.bancohq.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    @Size(max = 120)
    private String author;

    @NotBlank
    @Size(max = 120)
    private String publisher;

    @NotBlank
    @Size(max = 200)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull
    @PastOrPresent
    private LocalDate releaseDate;

    @NotNull
    @PositiveOrZero
    private Integer stockQuantity;

    @Size(max = 255)
    private String imageUrl;
}
