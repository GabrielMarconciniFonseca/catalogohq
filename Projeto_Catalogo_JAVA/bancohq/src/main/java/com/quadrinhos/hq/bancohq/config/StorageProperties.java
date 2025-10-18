package com.quadrinhos.hq.bancohq.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "catalogo.storage")
public class StorageProperties {

    private String location = "uploads";
}
