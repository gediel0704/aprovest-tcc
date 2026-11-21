package com.itb.inf2cm.aprovest.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2cm.aprovest.model.entity.Materia;
import com.itb.inf2cm.aprovest.model.entity.Vestibular;
import com.itb.inf2cm.aprovest.model.repository.MateriaRepository;
import com.itb.inf2cm.aprovest.model.repository.MensagemContatoRepository;
import com.itb.inf2cm.aprovest.model.repository.QuestaoRepository;
import com.itb.inf2cm.aprovest.model.repository.RedacaoRepository;
import com.itb.inf2cm.aprovest.model.repository.RespostaAlunoRepository;
import com.itb.inf2cm.aprovest.model.repository.UsuarioRepository;
import com.itb.inf2cm.aprovest.model.repository.VestibularRepository;

/**
 * Rotas gerais: situação da API, listas usadas nos formulários e números dos painéis.
 */
@RestController
@RequestMapping("/api/v1")
public class IndexController {

    private final VestibularRepository vestibularRepository;
    private final MateriaRepository materiaRepository;
    private final QuestaoRepository questaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RedacaoRepository redacaoRepository;
    private final MensagemContatoRepository mensagemRepository;
    private final RespostaAlunoRepository respostaRepository;

    public IndexController(VestibularRepository vestibularRepository, MateriaRepository materiaRepository,
                           QuestaoRepository questaoRepository, UsuarioRepository usuarioRepository,
                           RedacaoRepository redacaoRepository, MensagemContatoRepository mensagemRepository,
                           RespostaAlunoRepository respostaRepository) {
        this.vestibularRepository = vestibularRepository;
        this.materiaRepository = materiaRepository;
        this.questaoRepository = questaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.redacaoRepository = redacaoRepository;
        this.mensagemRepository = mensagemRepository;
        this.respostaRepository = respostaRepository;
    }

    @GetMapping("/index")
    public Map<String, Object> index() {
        Map<String, Object> retorno = new LinkedHashMap<>();
        retorno.put("aplicacao", "AproVest TCC");
        retorno.put("versao", "1.0.0");
        retorno.put("status", "no ar");
        return retorno;
    }

    @GetMapping("/vestibulares")
    public List<Vestibular> vestibulares() {
        return vestibularRepository.findAll();
    }

    @GetMapping("/materias")
    public List<Materia> materias() {
        return materiaRepository.findAll();
    }

    /** Números da página inicial (consulta o banco). */
    @GetMapping("/publico/numeros")
    public Map<String, Object> numeros() {
        Map<String, Object> retorno = new LinkedHashMap<>();
        retorno.put("questoes", questaoRepository.countByStatus("ATIVO"));
        retorno.put("vestibulares", vestibularRepository.count());
        retorno.put("materias", materiaRepository.count());
        retorno.put("alunos", usuarioRepository.countByTipo("ALUNO"));
        return retorno;
    }

    /** Números do painel do administrador. */
    @GetMapping("/admin/resumo")
    public Map<String, Object> resumoAdmin() {
        Map<String, Object> retorno = new LinkedHashMap<>();
        retorno.put("questoes", questaoRepository.count());
        retorno.put("alunos", usuarioRepository.countByTipo("ALUNO"));
        retorno.put("mensagensNovas", mensagemRepository.countByStatus("NOVA"));
        retorno.put("redacoesEnviadas", redacaoRepository.countByStatus("ENVIADA"));
        retorno.put("respostas", respostaRepository.count());
        return retorno;
    }
}
