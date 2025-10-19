package com.quadrinhos.hq.bancohq.mapper;

import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.model.Item;
import java.util.Collections;
import java.util.HashSet;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {

    public Item toEntity(final ItemRequest request) {
        return Item.builder()
                .title(normalize(request.getTitle()))
                .series(normalize(request.getSeries()))
                .issueNumber(normalize(request.getIssueNumber()))
                .publisher(normalize(request.getPublisher()))
                .language(normalize(request.getLanguage()))
                .condition(normalize(request.getCondition()))
                .location(normalize(request.getLocation()))
                .description(normalize(request.getDescription()))
                .imageUrl(normalize(request.getImageUrl()))
                .status(request.getStatus())
                .tags(new HashSet<>(defaultTags(request)))
                .build();
    }

    public void updateEntity(final Item item, final ItemRequest request) {
        item.setTitle(normalize(request.getTitle()));
        item.setSeries(normalize(request.getSeries()));
        item.setIssueNumber(normalize(request.getIssueNumber()));
        item.setPublisher(normalize(request.getPublisher()));
        item.setLanguage(normalize(request.getLanguage()));
        item.setCondition(normalize(request.getCondition()));
        item.setLocation(normalize(request.getLocation()));
        item.setDescription(normalize(request.getDescription()));
        item.setImageUrl(normalize(request.getImageUrl()));
        item.setStatus(request.getStatus());
        item.setTags(new HashSet<>(defaultTags(request)));
    }

    public ItemResponse toResponse(final Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .series(item.getSeries())
                .issueNumber(item.getIssueNumber())
                .publisher(item.getPublisher())
                .language(item.getLanguage())
                .condition(item.getCondition())
                .location(item.getLocation())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .status(item.getStatus())
                .tags(item.getTags())
                .build();
    }

    private static String normalize(final String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static Iterable<String> defaultTags(final ItemRequest request) {
        if (request.getTags() == null) {
            return Collections.emptySet();
        }
        return request.getTags();
    }
}
