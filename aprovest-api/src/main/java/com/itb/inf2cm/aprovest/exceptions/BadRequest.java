package com.itb.inf2cm.aprovest.exceptions;

/** Dados inválidos ou regra de negócio não atendida (HTTP 400). */
public class BadRequest extends RuntimeException {
    public BadRequest(String mensagem) {
        super(mensagem);
    }
}
