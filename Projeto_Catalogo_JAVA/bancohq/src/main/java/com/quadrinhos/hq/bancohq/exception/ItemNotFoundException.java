package com.quadrinhos.hq.bancohq.exception;

public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException(final Long id) {
        super(String.format("Item with id %d not found", id));
    }
}
