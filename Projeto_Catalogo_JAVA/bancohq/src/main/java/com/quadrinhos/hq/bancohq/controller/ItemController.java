package com.quadrinhos.hq.bancohq.controller;

import com.quadrinhos.hq.bancohq.dto.ItemFilter;
import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.dto.UpdateItemStatusRequest;
import com.quadrinhos.hq.bancohq.model.ItemStatus;
import com.quadrinhos.hq.bancohq.service.FileStorageService;
import com.quadrinhos.hq.bancohq.service.ItemService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Validated
public class ItemController {

    private final ItemService itemService;
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemResponse> create(@Valid @RequestBody final ItemRequest request) {
        normalizeImageField(request);
        ItemResponse response = itemService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemResponse> createWithCover(@Valid @RequestPart("item") final ItemRequest request,
            @RequestPart(value = "cover", required = false) final MultipartFile cover) {
        prepareCover(request, cover);
        ItemResponse response = itemService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemResponse> update(@PathVariable final Long id,
            @Valid @RequestBody final ItemRequest request) {
        ItemResponse existing = itemService.findById(id);
        normalizeImageField(request);
        ItemResponse response = itemService.update(id, request);
        removePreviousImageIfNecessary(existing.getImageUrl(), response.getImageUrl());
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemResponse> updateWithCover(@PathVariable final Long id,
            @Valid @RequestPart("item") final ItemRequest request,
            @RequestPart(value = "cover", required = false) final MultipartFile cover) {
        ItemResponse existing = itemService.findById(id);
        prepareCover(request, cover);
        ItemResponse response = itemService.update(id, request);
        removePreviousImageIfNecessary(existing.getImageUrl(), response.getImageUrl());
        return ResponseEntity.ok(response);
    }

    @PatchMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ItemResponse> updateStatus(@PathVariable final Long id,
            @Valid @RequestBody final UpdateItemStatusRequest request) {
        ItemResponse response = itemService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> findById(@PathVariable final Long id) {
        ItemResponse response = itemService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse>> findAll(
            @RequestParam(name = "term", required = false) final String term,
            @RequestParam(name = "publisher", required = false) final String publisher,
            @RequestParam(name = "series", required = false) final String series,
            @RequestParam(name = "status", required = false) final String status,
            @RequestParam(name = "tags", required = false) final List<String> tags) {
        ItemFilter filter = ItemFilter.builder()
                .term(term)
                .publisher(publisher)
                .series(series)
                .status(parseStatus(status))
                .tags(parseTags(tags))
                .build();
        List<ItemResponse> response = itemService.search(filter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<ItemResponse>> findWishlist() {
        ItemFilter filter = ItemFilter.builder().status(ItemStatus.WISHLIST).build();
        List<ItemResponse> response = itemService.search(filter);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ItemResponse>> importCsv(@RequestPart("file") final MultipartFile file)
            throws IOException {
        List<ItemResponse> response = itemService.importFromCsv(file.getInputStream());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable final Long id) {
        ItemResponse existing = itemService.findById(id);
        itemService.delete(id);
        removePreviousImageIfNecessary(existing.getImageUrl(), null);
        return ResponseEntity.noContent().build();
    }

    private void prepareCover(final ItemRequest request, final MultipartFile cover) {
        if (cover != null && !cover.isEmpty()) {
            String imageUrl = fileStorageService.store(cover);
            request.setImageUrl(imageUrl);
        } else {
            normalizeImageField(request);
        }
    }

    private void normalizeImageField(final ItemRequest request) {
        if (request.getImageUrl() != null && request.getImageUrl().isBlank()) {
            request.setImageUrl(null);
        }
    }

    private void removePreviousImageIfNecessary(final String previousImageUrl, final String currentImageUrl) {
        if (previousImageUrl != null && (currentImageUrl == null || !previousImageUrl.equals(currentImageUrl))) {
            fileStorageService.delete(previousImageUrl);
        }
    }

    private ItemStatus parseStatus(final String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        return ItemStatus.fromString(status);
    }

    private Set<String> parseTags(final List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return Set.of();
        }
        return tags.stream()
                .flatMap(value -> {
                    if (value == null || value.isBlank()) {
                        return Set.<String>of().stream();
                    }
                    String[] split = value.split(",");
                    Set<String> normalized = new LinkedHashSet<>();
                    for (String part : split) {
                        String cleaned = part.trim();
                        if (!cleaned.isEmpty()) {
                            normalized.add(cleaned.toLowerCase(Locale.ROOT));
                        }
                    }
                    return normalized.stream();
                })
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
