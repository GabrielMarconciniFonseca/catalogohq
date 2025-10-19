package com.quadrinhos.hq.bancohq.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quadrinhos.hq.bancohq.dto.ItemRequest;
import com.quadrinhos.hq.bancohq.model.Item;
import com.quadrinhos.hq.bancohq.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ItemControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ItemRepository itemRepository;

    @BeforeEach
    void setUp() {
        itemRepository.deleteAll();
    }

    @Test
    void shouldCreateAndRetrieveItem() throws Exception {
        ItemRequest request = buildRequest();

        String response = mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode node = objectMapper.readTree(response);
        long id = node.get("id").asLong();
        assertThat(id).isPositive();

        mockMvc.perform(get("/api/items/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Sample Item"));
    }

    @Test
    void shouldUpdateItem() throws Exception {
        Item saved = itemRepository.save(Item.builder()
                .title("Old Title")
                .series("Old Series")
                .issueNumber("1")
                .publisher("Publisher")
                .description("Old Description")
                .status(com.quadrinhos.hq.bancohq.model.ItemStatus.OWNED)
                .build());

        ItemRequest request = buildRequest();
        request.setTitle("Updated Title");

        mockMvc.perform(put("/api/items/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void shouldReturnNotFoundWhenDeletingMissingItem() throws Exception {
        mockMvc.perform(delete("/api/items/999"))
                .andExpect(status().isNotFound());
    }

    private ItemRequest buildRequest() {
        ItemRequest request = new ItemRequest();
        request.setTitle("Sample Item");
        request.setSeries("Sample Series");
        request.setIssueNumber("1");
        request.setPublisher("Publisher");
        request.setLanguage("Portuguese");
        request.setCondition("Very Fine");
        request.setLocation("Shelf A");
        request.setDescription("Description");
        request.setImageUrl("http://example.com/image.jpg");
        request.setStatus(com.quadrinhos.hq.bancohq.model.ItemStatus.OWNED);
        return request;
    }
}
