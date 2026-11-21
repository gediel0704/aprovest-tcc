package com.itb.inf2cm.aprovest.exceptions;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Transforma os erros em respostas JSON com a mensagem para o usuário: { "mensagem": "..." }
 */
@RestControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler(NotFound.class)
    public ResponseEntity<Map<String, String>> naoEncontrado(NotFound e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", e.getMessage()));
    }

    @ExceptionHandler(BadRequest.class)
    public ResponseEntity<Map<String, String>> requisicaoInvalida(BadRequest e) {
        return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
    }

    // erros das validações (@NotBlank, @Email...): devolve a primeira mensagem
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validacao(MethodArgumentNotValidException e) {
        String mensagem = e.getBindingResult().getFieldErrors().isEmpty()
                ? "Dados inválidos."
                : e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(Map.of("mensagem", mensagem));
    }
}
