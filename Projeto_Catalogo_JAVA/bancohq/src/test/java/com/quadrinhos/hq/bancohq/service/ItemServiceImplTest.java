package com.quadrinhos.hq.bancohq.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.dto.ItemResponse;
import com.quadrinhos.hq.bancohq.exception.ItemNotFoundException;
import com.quadrinhos.hq.bancohq.mapper.ItemMapper;
import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import com.quadrinhos.hq.bancohq.service.impl.ItemServiceImpl;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ItemServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private ItemMapper itemMapper;

    @InjectMocks
    private ItemServiceImpl itemService;

    private ItemRequest request;
    private Item entity;

    @BeforeEach
    void setUp() {
        request = new ItemRequest();
        request.setTitle("Sample");
        request.setAuthor("Author");
        request.setPublisher("Publisher");
        request.setDescription("Description");
        request.setPrice(new BigDecimal("19.90"));
        request.setReleaseDate(LocalDate.now());
        request.setStockQuantity(5);

        entity = Item.builder()
                .id(1L)
                .title("Sample")
                .author("Author")
                .publisher("Publisher")
                .description("Description")
                .price(new BigDecimal("19.90"))
                .releaseDate(request.getReleaseDate())
                .stockQuantity(5)
                .build();
    }

    @Test
    void shouldCreateItem() {
        when(itemMapper.toEntity(request)).thenReturn(entity);
        when(itemRepository.save(any(Item.class))).thenReturn(entity);
        when(itemMapper.toResponse(entity)).thenReturn(buildResponse(entity));

        ItemResponse response = itemService.create(request);

        assertThat(response.getId()).isEqualTo(1L);
        verify(itemRepository).save(any(Item.class));
    }

    @Test
    void shouldUpdateExistingItem() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(entity));
        doNothing().when(itemMapper).updateEntity(entity, request);
        when(itemRepository.save(entity)).thenReturn(entity);
        when(itemMapper.toResponse(entity)).thenReturn(buildResponse(entity));

        ItemResponse response = itemService.update(1L, request);

        assertThat(response.getTitle()).isEqualTo("Sample");
        verify(itemMapper).updateEntity(entity, request);
    }

    @Test
    void shouldThrowWhenUpdatingNonExistingItem() {
        when(itemRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.update(2L, request))
                .isInstanceOf(ItemNotFoundException.class);
    }

    @Test
    void shouldFindItemById() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(itemMapper.toResponse(entity)).thenReturn(buildResponse(entity));

        ItemResponse response = itemService.findById(1L);

        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    void shouldThrowWhenItemNotFoundById() {
        when(itemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.findById(1L))
                .isInstanceOf(ItemNotFoundException.class);
    }

    @Test
    void shouldFindAllItems() {
        when(itemRepository.findAll()).thenReturn(Arrays.asList(entity));
        when(itemMapper.toResponse(entity)).thenReturn(buildResponse(entity));

        List<ItemResponse> responses = itemService.findAll();

        assertThat(responses).hasSize(1);
    }

    @Test
    void shouldDeleteExistingItem() {
        when(itemRepository.existsById(1L)).thenReturn(true);
        doNothing().when(itemRepository).deleteById(eq(1L));

        itemService.delete(1L);

        verify(itemRepository).deleteById(1L);
    }

    @Test
    void shouldThrowWhenDeletingNonExistingItem() {
        when(itemRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> itemService.delete(99L))
                .isInstanceOf(ItemNotFoundException.class);
    }

    private ItemResponse buildResponse(final Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .author(item.getAuthor())
                .publisher(item.getPublisher())
                .description(item.getDescription())
                .price(item.getPrice())
                .releaseDate(item.getReleaseDate())
                .stockQuantity(item.getStockQuantity())
                .build();
    }
}
