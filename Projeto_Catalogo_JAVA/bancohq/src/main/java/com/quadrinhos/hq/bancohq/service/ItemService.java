package com.quadrinhos.hq.bancohq.service;

import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import java.util.List;

public interface ItemService {

    ItemResponse create(ItemRequest request);

    ItemResponse update(Long id, ItemRequest request);

    ItemResponse findById(Long id);

    List<ItemResponse> findAll();

    void delete(Long id);
}
