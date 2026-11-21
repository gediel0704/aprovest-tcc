package com.itb.inf2cm.aprovest.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2cm.aprovest.model.entity.MensagemContato;
import com.itb.inf2cm.aprovest.model.services.MensagemContatoService;

import jakarta.validation.Valid;

/**
 * Fale Conosco: o visitante envia a mensagem e o administrador acompanha.
 */
@RestController
@RequestMapping("/api/v1/mensagens")
public class MensagemContatoController {

    private final MensagemContatoService mensagemService;

    public MensagemContatoController(MensagemContatoService mensagemService) {
        this.mensagemService = mensagemService;
    }

    @PostMapping
    public ResponseEntity<MensagemContato> enviar(@RequestBody @Valid MensagemContato mensagem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mensagemService.enviar(mensagem));
    }

    @GetMapping
    public List<MensagemContato> listar() {
        return mensagemService.listar();
    }

    /** { "status": "RESPONDIDA" } */
    @PutMapping("/{id}/status")
    public MensagemContato alterarStatus(@PathVariable Integer id, @RequestBody Map<String, String> dados) {
        return mensagemService.alterarStatus(id, dados.get("status"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        mensagemService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
