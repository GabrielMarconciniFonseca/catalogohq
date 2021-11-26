package com.quadrinhos.hq.bancohq.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class UsuarioNotFoundException extends Exception {


    private static final long serialVersionUID=1L;

    public UsuarioNotFoundException(String message){
        super (message);
    }


}
