package com.quadrinhos.hq.bancohq.dto;

import com.quadrinhos.hq.bancohq.model.ItemStatus;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItemResponse {

    private final Long id;
    private final String title;
    private final String series;
    private final String issueNumber;
    private final String publisher;
    private final String language;
    private final String condition;
    private final String location;
    private final String description;
    private final String imageUrl;
    private final ItemStatus status;
    private final Set<String> tags;
}
