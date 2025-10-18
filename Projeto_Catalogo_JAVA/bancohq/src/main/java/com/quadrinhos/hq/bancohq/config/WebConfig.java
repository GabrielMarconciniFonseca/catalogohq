package com.quadrinhos.hq.bancohq.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(storageProperties.getLocation()).toAbsolutePath().normalize();
        String resourceLocation = uploadDir.toUri().toString();
        if (!resourceLocation.endsWith("/")) {
            resourceLocation = resourceLocation + "/";
        }

        registry.addResourceHandler("/files/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(3600);
    }
}
