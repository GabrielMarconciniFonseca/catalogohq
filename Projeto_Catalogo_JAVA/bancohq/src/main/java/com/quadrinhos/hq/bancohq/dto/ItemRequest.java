package com.quadrinhos.hq.bancohq.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;
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
}
