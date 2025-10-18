package com.quadrinhos.hq.bancohq.mapper;

import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.model.Item;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {

    public Item toEntity(final ItemRequest request) {
        return Item.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .publisher(request.getPublisher())
                .description(request.getDescription())
                .price(request.getPrice())
                .releaseDate(request.getReleaseDate())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .build();
    }

    public void updateEntity(final Item item, final ItemRequest request) {
        item.setTitle(request.getTitle());
        item.setAuthor(request.getAuthor());
        item.setPublisher(request.getPublisher());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setReleaseDate(request.getReleaseDate());
        item.setStockQuantity(request.getStockQuantity());
        item.setImageUrl(request.getImageUrl());
    }

    public ItemResponse toResponse(final Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .author(item.getAuthor())
                .publisher(item.getPublisher())
                .description(item.getDescription())
                .price(item.getPrice())
                .releaseDate(item.getReleaseDate())
                .stockQuantity(item.getStockQuantity())
                .imageUrl(item.getImageUrl())
                .build();
    }
}
