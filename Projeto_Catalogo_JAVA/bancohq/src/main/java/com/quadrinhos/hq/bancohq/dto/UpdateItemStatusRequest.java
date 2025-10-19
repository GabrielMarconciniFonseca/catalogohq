package com.quadrinhos.hq.bancohq.dto;

import com.quadrinhos.hq.bancohq.model.ItemStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateItemStatusRequest {

    @NotNull
    private ItemStatus status;
}
