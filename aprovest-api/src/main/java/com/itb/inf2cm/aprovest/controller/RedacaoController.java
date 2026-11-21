package com.itb.inf2cm.aprovest.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2cm.aprovest.model.entity.Redacao;
import com.itb.inf2cm.aprovest.model.services.RedacaoService;

import jakarta.validation.Valid;

/**
 * CRUD das redações do aluno.
 */
@RestController
@RequestMapping("/api/v1/redacoes")
public class RedacaoController {

    private final RedacaoService redacaoService;

    public RedacaoController(RedacaoService redacaoService) {
        this.redacaoService = redacaoService;
    }

    @GetMapping
    public List<Redacao> listar(@RequestParam Integer usuario) {
        return redacaoService.listarDoAluno(usuario);
    }

    @GetMapping("/{id}")
    public Redacao buscar(@PathVariable Integer id) {
        return redacaoService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<Redacao> cadastrar(@RequestBody @Valid Redacao redacao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(redacaoService.cadastrar(redacao));
    }

    @PutMapping("/{id}")
    public Redacao alterar(@PathVariable Integer id, @RequestBody @Valid Redacao redacao) {
        return redacaoService.alterar(id, redacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        redacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
