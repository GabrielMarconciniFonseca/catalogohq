package com.quadrinhos.hq.bancohq.model;

import java.util.Arrays;

public enum ItemStatus {
    OWNED,
    WISHLIST,
    ORDERED,
    LENT;

    public static ItemStatus fromString(final String value) {
        if (value == null || value.isBlank()) {
            return ItemStatus.OWNED;
        }
        return Arrays.stream(values())
                .filter(status -> status.name().equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Status inválido: " + value));
    }
}
