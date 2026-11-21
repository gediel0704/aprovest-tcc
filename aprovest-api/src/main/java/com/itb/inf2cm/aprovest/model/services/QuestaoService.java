package com.itb.inf2cm.aprovest.model.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf2cm.aprovest.exceptions.BadRequest;
import com.itb.inf2cm.aprovest.exceptions.NotFound;
import com.itb.inf2cm.aprovest.model.entity.Alternativa;
import com.itb.inf2cm.aprovest.model.entity.Questao;
import com.itb.inf2cm.aprovest.model.repository.QuestaoRepository;

@Service
public class QuestaoService {

    private final QuestaoRepository questaoRepository;
    private final EntityManager entityManager;

    public QuestaoService(QuestaoRepository questaoRepository, EntityManager entityManager) {
        this.questaoRepository = questaoRepository;
        this.entityManager = entityManager;
    }

    // relê a questão do banco para devolver os nomes atualizados do vestibular e da matéria
    private Questao salvarERecarregar(Questao questao) {
        Questao salva = questaoRepository.saveAndFlush(questao);
        entityManager.refresh(salva);
        return salva;
    }

    public List<Questao> listar(Integer idMateria, Integer idVestibular, String busca) {
        String texto = (busca == null || busca.isBlank()) ? null : busca.trim();
        return questaoRepository.pesquisar(idMateria, idVestibular, texto);
    }

    public Questao buscar(Integer id) {
        return questaoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Questão não encontrada."));
    }

    @Transactional
    public Questao cadastrar(Questao questao) {
        validarAlternativas(questao.getAlternativas());
        questao.setIdQuestao(null);
        for (Alternativa a : questao.getAlternativas()) {
            a.setIdAlternativa(null);
            a.setQuestao(questao);
        }
        return salvarERecarregar(questao);
    }

    @Transactional
    public Questao alterar(Integer id, Questao dados) {
        validarAlternativas(dados.getAlternativas());
        Questao questao = buscar(id);
        questao.setEnunciado(dados.getEnunciado());
        questao.setAno(dados.getAno());
        questao.setFonte(dados.getFonte());
        questao.setDificuldade(dados.getDificuldade());
        questao.setIdVestibular(dados.getIdVestibular());
        questao.setIdMateria(dados.getIdMateria());
        if (dados.getStatus() != null) questao.setStatus(dados.getStatus());
        // substitui as alternativas: as antigas são apagadas (orphanRemoval) e as novas inseridas
        questao.getAlternativas().clear();
        questaoRepository.saveAndFlush(questao);
        for (Alternativa a : dados.getAlternativas()) {
            a.setIdAlternativa(null);
            a.setQuestao(questao);
            questao.getAlternativas().add(a);
        }
        return salvarERecarregar(questao);
    }

    public void excluir(Integer id) {
        questaoRepository.delete(buscar(id));
    }

    /** Banca de questões: sorteia questões ativas para o aluno resolver. */
    public List<Questao> sortear(Integer idMateria, int quantidade) {
        List<Questao> lista = new ArrayList<>();
        for (Questao q : questaoRepository.findByStatus("ATIVO")) {
            if (idMateria == null || q.getIdMateria().equals(idMateria)) lista.add(q);
        }
        Collections.shuffle(lista);
        return lista.subList(0, Math.min(quantidade, lista.size()));
    }

    // Regras: de 2 a 5 alternativas, todas com texto, letras diferentes e exatamente uma correta
    private void validarAlternativas(List<Alternativa> alternativas) {
        if (alternativas == null || alternativas.size() < 2 || alternativas.size() > 5) {
            throw new BadRequest("A questão deve ter de 2 a 5 alternativas.");
        }
        int corretas = 0;
        for (Alternativa a : alternativas) {
            if (a.getTexto() == null || a.getTexto().isBlank()) {
                throw new BadRequest("Preencha o texto da alternativa " + a.getLetra() + ".");
            }
            if (Boolean.TRUE.equals(a.getCorreta())) corretas++;
        }
        if (corretas != 1) {
            throw new BadRequest("Marque exatamente uma alternativa correta.");
        }
        long letras = alternativas.stream().map(Alternativa::getLetra).distinct().count();
        if (letras != alternativas.size()) {
            throw new BadRequest("As alternativas devem ter letras diferentes.");
        }
    }
}
