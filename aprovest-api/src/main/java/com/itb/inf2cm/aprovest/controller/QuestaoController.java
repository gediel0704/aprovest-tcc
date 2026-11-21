package com.itb.inf2cm.aprovest.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf2cm.aprovest.model.entity.Alternativa;
import com.itb.inf2cm.aprovest.model.entity.Questao;
import com.itb.inf2cm.aprovest.model.services.QuestaoService;
import com.itb.inf2cm.aprovest.model.services.RespostaAlunoService;

import jakarta.validation.Valid;

/**
 * CRUD de questões (administrador) e banca de questões (aluno).
 */
@RestController
@RequestMapping("/api/v1/questoes")
public class QuestaoController {

    private final QuestaoService questaoService;
    private final RespostaAlunoService respostaService;

    public QuestaoController(QuestaoService questaoService, RespostaAlunoService respostaService) {
        this.questaoService = questaoService;
        this.respostaService = respostaService;
    }

    // ---------------- CRUD (administrador) ----------------

    @GetMapping
    public List<Questao> listar(@RequestParam(required = false) Integer materia,
                                @RequestParam(required = false) Integer vestibular,
                                @RequestParam(required = false) String busca) {
        return questaoService.listar(materia, vestibular, busca);
    }

    @GetMapping("/{id}")
    public Questao buscar(@PathVariable Integer id) {
        return questaoService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<Questao> cadastrar(@RequestBody @Valid Questao questao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questaoService.cadastrar(questao));
    }

    @PutMapping("/{id}")
    public Questao alterar(@PathVariable Integer id, @RequestBody @Valid Questao questao) {
        return questaoService.alterar(id, questao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        questaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------- Banca de questões (aluno) ----------------

    /** Sorteia questões para o aluno. A alternativa correta NÃO é enviada (só aparece depois de responder). */
    @GetMapping("/banca")
    public List<Map<String, Object>> banca(@RequestParam(required = false) Integer materia,
                                           @RequestParam(defaultValue = "5") int quantidade) {
        List<Map<String, Object>> lista = new ArrayList<>();
        for (Questao q : questaoService.sortear(materia, quantidade)) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("idQuestao", q.getIdQuestao());
            item.put("enunciado", q.getEnunciado());
            item.put("ano", q.getAno());
            item.put("fonte", q.getFonte());
            item.put("materia", q.getMateria() != null ? q.getMateria().getNome() : "");
            item.put("vestibular", q.getVestibular() != null ? q.getVestibular().getSigla() : "");
            List<Map<String, String>> alternativas = new ArrayList<>();
            for (Alternativa a : q.getAlternativas()) {
                alternativas.add(Map.of("letra", a.getLetra(), "texto", a.getTexto()));
            }
            item.put("alternativas", alternativas);
            lista.add(item);
        }
        return lista;
    }

    /** O aluno responde uma questão: { "idUsuario": 2, "letra": "B" } */
    @PostMapping("/{id}/responder")
    public Map<String, Object> responder(@PathVariable Integer id, @RequestBody Map<String, Object> dados) {
        Integer idUsuario = Integer.valueOf(String.valueOf(dados.get("idUsuario")));
        return respostaService.responder(idUsuario, id, String.valueOf(dados.get("letra")));
    }
}
