package com.itb.inf2cm.aprovest.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2cm.aprovest.model.entity.Usuario;
import com.itb.inf2cm.aprovest.model.services.UsuarioService;

import jakarta.validation.Valid;

/**
 * Login, cadastro e recuperação de senha.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> dados) {
        return usuarioService.login(dados.get("email"), dados.get("senha"));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastro(@RequestBody @Valid Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.cadastrar(usuario));
    }

    /** Recuperação de senha: nesta versão a tela existe, mas o envio de e-mail ainda não foi implementado. */
    @PostMapping("/esqueci-senha")
    public Map<String, String> esqueciSenha(@RequestBody Map<String, String> dados) {
        return Map.of("mensagem", "Pedido recebido. O envio do e-mail de recuperação de senha ainda está em desenvolvimento; "
                + "por enquanto, peça a troca da senha pelo Fale Conosco.");
    }
}
