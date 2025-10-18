package com.quadrinhos.hq.bancohq.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String store(MultipartFile file);

    void delete(String resourcePath);
}
