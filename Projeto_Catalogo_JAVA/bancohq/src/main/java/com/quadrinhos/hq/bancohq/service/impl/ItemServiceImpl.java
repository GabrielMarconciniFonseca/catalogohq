package com.quadrinhos.hq.bancohq.service.impl;

import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.exception.ItemNotFoundException;
import com.quadrinhos.hq.bancohq.mapper.ItemMapper;
import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import com.quadrinhos.hq.bancohq.service.ItemService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemServiceImpl implements ItemService {

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
    public ItemResponse findById(final Long id) {
        return itemRepository.findById(id)
                .map(itemMapper::toResponse)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    @Override
    public List<ItemResponse> findAll() {
        return itemRepository.findAll()
                .stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(final Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException(id);
        }
        itemRepository.deleteById(id);
    }
}
