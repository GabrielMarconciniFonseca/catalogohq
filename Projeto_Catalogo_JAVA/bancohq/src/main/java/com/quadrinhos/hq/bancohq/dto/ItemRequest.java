package com.quadrinhos.hq.bancohq.dto;

import com.quadrinhos.hq.bancohq.model.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @Size(max = 150)
    private String series;

    @NotBlank
    @Size(max = 30)
    private String issueNumber;

    @NotBlank
    @Size(max = 120)
    private String publisher;

    @Size(max = 80)
    private String language;

    @Size(max = 80)
    private String condition;

    @Size(max = 120)
    private String location;

    @Size(max = 200)
    private String description;

    @Size(max = 255)
    private String imageUrl;

    @NotNull
    private ItemStatus status;

    @Size(max = 10)
    private Set<@NotEmpty @Size(max = 40) String> tags = new LinkedHashSet<>();
}
