package com.quadrinhos.hq.bancohq.dto;

import com.quadrinhos.hq.bancohq.model.ItemStatus;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItemFilter {

    private final String term;
    private final String publisher;
    private final String series;
    private final ItemStatus status;
    private final Set<String> tags;

    public String normalizedTerm() {
        return Optional.ofNullable(term).map(value -> value.trim().toLowerCase(Locale.ROOT)).orElse(null);
    }

    public String normalizedPublisher() {
        return Optional.ofNullable(publisher).map(value -> value.trim().toLowerCase(Locale.ROOT)).orElse(null);
    }

    public String normalizedSeries() {
        return Optional.ofNullable(series).map(value -> value.trim().toLowerCase(Locale.ROOT)).orElse(null);
    }

    public Set<String> normalizedTags() {
        if (tags == null || tags.isEmpty()) {
            return Collections.emptySet();
        }
        Set<String> normalized = new LinkedHashSet<>();
        for (String tag : tags) {
            if (tag != null && !tag.isBlank()) {
                normalized.add(tag.trim().toLowerCase(Locale.ROOT));
            }
        }
        return normalized;
    }
}
