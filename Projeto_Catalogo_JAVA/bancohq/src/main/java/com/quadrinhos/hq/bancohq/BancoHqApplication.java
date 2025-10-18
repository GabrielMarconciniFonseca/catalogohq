package com.quadrinhos.hq.bancohq;

import com.quadrinhos.hq.bancohq.config.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class BancoHqApplication {

        public static void main( String[] args) {

                SpringApplication.run(BancoHqApplication.class, args);

	}



}
