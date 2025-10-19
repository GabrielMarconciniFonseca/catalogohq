package com.quadrinhos.hq.bancohq.service;

import com.quadrinhos.hq.bancohq.dto.ItemFilter;
import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.model.ItemStatus;
import java.io.InputStream;
import java.util.List;

public interface ItemService {

    ItemResponse create(ItemRequest request);

    ItemResponse update(Long id, ItemRequest request);

    ItemResponse updateStatus(Long id, ItemStatus status);

    ItemResponse findById(Long id);

    List<ItemResponse> findAll();

    List<ItemResponse> search(ItemFilter filter);

    List<ItemResponse> importFromCsv(InputStream inputStream);

    void delete(Long id);
}
