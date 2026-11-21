package com.itb.inf2cm.aprovest.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2cm.aprovest.model.entity.Usuario;
import com.itb.inf2cm.aprovest.model.services.RespostaAlunoService;
import com.itb.inf2cm.aprovest.model.services.UsuarioService;

/**
 * Usuários: lista (administrador), perfil e desempenho (aluno).
 */
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final RespostaAlunoService respostaService;

    public UsuarioController(UsuarioService usuarioService, RespostaAlunoService respostaService) {
        this.usuarioService = usuarioService;
        this.respostaService = respostaService;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Integer id) {
        return usuarioService.buscar(id);
    }

    @PutMapping("/{id}")
    public Usuario atualizarPerfil(@PathVariable Integer id, @RequestBody Usuario dados) {
        return usuarioService.atualizarPerfil(id, dados);
    }

    /** { "status": "INATIVO" } */
    @PutMapping("/{id}/status")
    public Usuario alterarStatus(@PathVariable Integer id, @RequestBody Map<String, String> dados) {
        return usuarioService.alterarStatus(id, dados.get("status"));
    }

    @GetMapping("/{id}/desempenho")
    public Map<String, Object> desempenho(@PathVariable Integer id) {
        usuarioService.buscar(id);
        return respostaService.desempenho(id);
    }
}
