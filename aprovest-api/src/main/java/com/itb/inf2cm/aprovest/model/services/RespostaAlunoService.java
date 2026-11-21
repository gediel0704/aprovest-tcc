package com.itb.inf2cm.aprovest.model.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.itb.inf2cm.aprovest.exceptions.BadRequest;
import com.itb.inf2cm.aprovest.model.entity.Alternativa;
import com.itb.inf2cm.aprovest.model.entity.Questao;
import com.itb.inf2cm.aprovest.model.entity.RespostaAluno;
import com.itb.inf2cm.aprovest.model.repository.RespostaAlunoRepository;

@Service
public class RespostaAlunoService {

    private final RespostaAlunoRepository respostaRepository;
    private final QuestaoService questaoService;
    private final UsuarioService usuarioService;

    public RespostaAlunoService(RespostaAlunoRepository respostaRepository, QuestaoService questaoService,
                                UsuarioService usuarioService) {
        this.respostaRepository = respostaRepository;
        this.questaoService = questaoService;
        this.usuarioService = usuarioService;
    }

    /** Registra a resposta do aluno e informa se ele acertou e qual era a alternativa correta. */
    public Map<String, Object> responder(Integer idUsuario, Integer idQuestao, String letra) {
        if (letra == null || letra.isBlank()) throw new BadRequest("Escolha uma alternativa.");
        usuarioService.buscar(idUsuario);
        Questao questao = questaoService.buscar(idQuestao);
        String correta = "";
        for (Alternativa a : questao.getAlternativas()) {
            if (Boolean.TRUE.equals(a.getCorreta())) correta = a.getLetra();
        }

        RespostaAluno resposta = new RespostaAluno();
        resposta.setIdUsuario(idUsuario);
        resposta.setIdQuestao(idQuestao);
        resposta.setLetraEscolhida(letra);
        resposta.setAcertou(correta.equals(letra));
        respostaRepository.save(resposta);

        Map<String, Object> retorno = new LinkedHashMap<>();
        retorno.put("acertou", resposta.getAcertou());
        retorno.put("letraCorreta", correta);
        return retorno;
    }

    /** Desempenho do aluno: total respondido, acertos, aproveitamento e resultado por matéria. */
    public Map<String, Object> desempenho(Integer idUsuario) {
        List<RespostaAluno> respostas = respostaRepository.findByIdUsuarioOrderByDataRespostaDesc(idUsuario);
        int acertos = 0;
        Map<String, int[]> porMateria = new LinkedHashMap<>();   // matéria -> [respondidas, acertos]
        for (RespostaAluno r : respostas) {
            String materia = nomeMateria(r);
            int[] contagem = porMateria.computeIfAbsent(materia, m -> new int[2]);
            contagem[0]++;
            if (Boolean.TRUE.equals(r.getAcertou())) {
                contagem[1]++;
                acertos++;
            }
        }

        List<Map<String, Object>> materias = new ArrayList<>();
        for (Map.Entry<String, int[]> e : porMateria.entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("materia", e.getKey());
            m.put("respondidas", e.getValue()[0]);
            m.put("acertos", e.getValue()[1]);
            materias.add(m);
        }

        List<Map<String, Object>> ultimas = new ArrayList<>();
        for (int i = 0; i < Math.min(8, respostas.size()); i++) {
            RespostaAluno r = respostas.get(i);
            Map<String, Object> u = new LinkedHashMap<>();
            u.put("idQuestao", r.getIdQuestao());
            u.put("materia", nomeMateria(r));
            u.put("letraEscolhida", r.getLetraEscolhida());
            u.put("acertou", r.getAcertou());
            u.put("dataResposta", r.getDataResposta());
            ultimas.add(u);
        }

        Map<String, Object> retorno = new LinkedHashMap<>();
        retorno.put("respondidas", respostas.size());
        retorno.put("acertos", acertos);
        retorno.put("aproveitamento", respostas.isEmpty() ? 0 : Math.round(acertos * 100.0 / respostas.size()));
        retorno.put("porMateria", materias);
        retorno.put("ultimas", ultimas);
        return retorno;
    }

    private String nomeMateria(RespostaAluno r) {
        if (r.getQuestao() == null || r.getQuestao().getMateria() == null) return "Outras";
        return r.getQuestao().getMateria().getNome();
    }
}
