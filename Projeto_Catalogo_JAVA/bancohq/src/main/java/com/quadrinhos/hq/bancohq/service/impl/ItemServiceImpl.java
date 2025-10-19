package com.quadrinhos.hq.bancohq.service.impl;

import com.quadrinhos.hq.bancohq.dto.ItemFilter;
import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.exception.ItemNotFoundException;
import com.quadrinhos.hq.bancohq.mapper.ItemMapper;
import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.model.ItemStatus;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import com.quadrinhos.hq.bancohq.service.ItemService;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemServiceImpl implements ItemService {

    private static final CSVFormat CSV_FORMAT = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .setIgnoreEmptyLines(true)
            .setTrim(true)
            .build();

    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;

    @Override
    @Transactional
    public ItemResponse create(final ItemRequest request) {
        Item item = itemMapper.toEntity(request);
        Item saved = itemRepository.save(item);
        return itemMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ItemResponse update(final Long id, final ItemRequest request) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        itemMapper.updateEntity(item, request);
        Item updated = itemRepository.save(item);
        return itemMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public ItemResponse updateStatus(final Long id, final ItemStatus status) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        item.setStatus(status);
        Item updated = itemRepository.save(item);
        return itemMapper.toResponse(updated);
    }

    @Override
    public ItemResponse findById(final Long id) {
        return itemRepository.findById(id)
                .map(itemMapper::toResponse)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    @Override
    public List<ItemResponse> findAll() {
        return search(ItemFilter.builder().build());
    }

    @Override
    public List<ItemResponse> search(final ItemFilter filter) {
        ItemFilter effectiveFilter = Optional.ofNullable(filter).orElse(ItemFilter.builder().build());
        return itemRepository.findAll()
                .stream()
                .filter(item -> matchesFilter(item, effectiveFilter))
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ItemResponse> importFromCsv(final InputStream inputStream) {
        if (inputStream == null) {
            return List.of();
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
                CSVParser parser = CSV_FORMAT.parse(reader)) {
            List<ItemResponse> responses = new ArrayList<>();
            for (CSVRecord record : parser) {
                ItemRequest request = toRequest(record);
                Item item = itemMapper.toEntity(request);
                Item saved = itemRepository.save(item);
                responses.add(itemMapper.toResponse(saved));
            }
            return responses;
        } catch (IOException | IllegalArgumentException exception) {
            throw new IllegalArgumentException("Não foi possível importar o arquivo CSV.", exception);
        }
    }

    @Override
    @Transactional
    public void delete(final Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException(id);
        }
        itemRepository.deleteById(id);
    }

    private boolean matchesFilter(final Item item, final ItemFilter filter) {
        String normalizedTerm = filter.normalizedTerm();
        if (normalizedTerm != null && !matchesTerm(item, normalizedTerm)) {
            return false;
        }

        String normalizedPublisher = filter.normalizedPublisher();
        if (normalizedPublisher != null && !matchesPublisher(item, normalizedPublisher)) {
            return false;
        }

        String normalizedSeries = filter.normalizedSeries();
        if (normalizedSeries != null && !matchesSeries(item, normalizedSeries)) {
            return false;
        }

        if (filter.getStatus() != null && item.getStatus() != filter.getStatus()) {
            return false;
        }

        Set<String> normalizedTags = filter.normalizedTags();
        if (!normalizedTags.isEmpty() && !matchesTags(item, normalizedTags)) {
            return false;
        }

        return true;
    }

    private boolean matchesTerm(final Item item, final String term) {
        return contains(item.getTitle(), term)
                || contains(item.getSeries(), term)
                || contains(item.getPublisher(), term)
                || contains(item.getDescription(), term)
                || contains(item.getLocation(), term)
                || contains(item.getLanguage(), term)
                || containsTags(item, term);
    }

    private boolean matchesPublisher(final Item item, final String publisher) {
        return contains(item.getPublisher(), publisher);
    }

    private boolean matchesSeries(final Item item, final String series) {
        return contains(item.getSeries(), series);
    }

    private boolean matchesTags(final Item item, final Set<String> tags) {
        if (item.getTags() == null || item.getTags().isEmpty()) {
            return false;
        }
        Set<String> normalizedItemTags = item.getTags().stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(tag -> tag.trim().toLowerCase(Locale.ROOT))
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return normalizedItemTags.containsAll(tags);
    }

    private boolean containsTags(final Item item, final String term) {
        if (item.getTags() == null) {
            return false;
        }
        return item.getTags().stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(tag -> tag.trim().toLowerCase(Locale.ROOT))
                .anyMatch(tag -> tag.contains(term));
    }

    private boolean contains(final String value, final String term) {
        if (value == null) {
            return false;
        }
        return value.toLowerCase(Locale.ROOT).contains(term);
    }

    private ItemRequest toRequest(final CSVRecord record) {
        ItemRequest request = new ItemRequest();
        request.setTitle(record.get("title"));
        request.setSeries(getOptional(record, "series"));
        request.setIssueNumber(record.get("issueNumber"));
        request.setPublisher(record.get("publisher"));
        request.setLanguage(getOptional(record, "language"));
        request.setCondition(getOptional(record, "condition"));
        request.setLocation(getOptional(record, "location"));
        request.setDescription(getOptional(record, "description"));
        request.setImageUrl(getOptional(record, "imageUrl"));
        request.setStatus(ItemStatus.fromString(getOptional(record, "status")));
        request.setTags(parseTags(getOptional(record, "tags")));
        return request;
    }

    private String getOptional(final CSVRecord record, final String column) {
        if (!record.isMapped(column) || record.get(column) == null) {
            return null;
        }
        String value = record.get(column).trim();
        return value.isEmpty() ? null : value;
    }

    private Set<String> parseTags(final String columnValue) {
        if (columnValue == null || columnValue.isBlank()) {
            return Set.of();
        }
        String[] parts = columnValue.split(",");
        Set<String> tags = new LinkedHashSet<>();
        for (String part : parts) {
            String cleaned = part.trim();
            if (!cleaned.isEmpty()) {
                tags.add(cleaned);
            }
        }
        return tags;
    }
}
