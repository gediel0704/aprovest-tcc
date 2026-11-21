package com.itb.inf2cm.aprovest.exceptions;

/** Registro não encontrado (HTTP 404). */
public class NotFound extends RuntimeException {
    public NotFound(String mensagem) {
        super(mensagem);
    }
}
