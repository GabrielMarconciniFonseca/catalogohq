package com.quadrinhos.hq.bancohq.service.impl;

import com.quadrinhos.hq.bancohq.config.StorageProperties;
import com.quadrinhos.hq.bancohq.service.FileStorageService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileSystemStorageService implements FileStorageService {

    private final StorageProperties storageProperties;

    private Path rootLocation;

    @PostConstruct
    void init() {
        this.rootLocation = Paths.get(storageProperties.getLocation()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException ex) {
            throw new IllegalStateException("Não foi possível criar o diretório de armazenamento", ex);
        }
    }

    @Override
    public String store(final MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Nome do arquivo não pode ser nulo");
        }
        originalFilename = StringUtils.cleanPath(originalFilename);
        String extension = "";
        int extIndex = originalFilename.lastIndexOf('.');
        if (extIndex >= 0) {
            extension = originalFilename.substring(extIndex);
        }
        String filename = UUID.randomUUID() + extension;
        Path destination = rootLocation.resolve(filename);
        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("Falha ao salvar arquivo de imagem", ex);
        }
        return "/files/" + filename;
    }

    @Override
    public void delete(final String resourcePath) {
        if (!StringUtils.hasText(resourcePath) || !resourcePath.startsWith("/files/")) {
            return;
        }
        String filename = resourcePath.substring("/files/".length());
        Path destination = rootLocation.resolve(filename);
        try {
            Files.deleteIfExists(destination);
        } catch (IOException ex) {
            // Ignorar falha de exclusão para evitar bloquear a operação principal
        }
    }
}
