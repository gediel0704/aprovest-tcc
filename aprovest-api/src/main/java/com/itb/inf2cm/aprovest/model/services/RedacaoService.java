package com.itb.inf2cm.aprovest.model.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.itb.inf2cm.aprovest.exceptions.BadRequest;
import com.itb.inf2cm.aprovest.exceptions.NotFound;
import com.itb.inf2cm.aprovest.model.entity.Redacao;
import com.itb.inf2cm.aprovest.model.repository.RedacaoRepository;

@Service
public class RedacaoService {

    private final RedacaoRepository redacaoRepository;
    private final UsuarioService usuarioService;

    public RedacaoService(RedacaoRepository redacaoRepository, UsuarioService usuarioService) {
        this.redacaoRepository = redacaoRepository;
        this.usuarioService = usuarioService;
    }

    public List<Redacao> listarDoAluno(Integer idUsuario) {
        return redacaoRepository.findByIdUsuarioOrderByDataCriacaoDesc(idUsuario);
    }

    public Redacao buscar(Integer id) {
        return redacaoRepository.findById(id)
                .orElseThrow(() -> new NotFound("Redação não encontrada."));
    }

    public Redacao cadastrar(Redacao redacao) {
        usuarioService.buscar(redacao.getIdUsuario());
        validarStatus(redacao.getStatus());
        redacao.setIdRedacao(null);
        redacao.setNota(null);
        return redacaoRepository.save(redacao);
    }

    public Redacao alterar(Integer id, Redacao dados) {
        Redacao redacao = buscar(id);
        if ("CORRIGIDA".equals(redacao.getStatus())) {
            throw new BadRequest("Uma redação já corrigida não pode ser alterada.");
        }
        validarStatus(dados.getStatus());
        redacao.setTitulo(dados.getTitulo());
        redacao.setTema(dados.getTema());
        redacao.setTexto(dados.getTexto());
        if (dados.getStatus() != null) redacao.setStatus(dados.getStatus());
        return redacaoRepository.save(redacao);
    }

    public void excluir(Integer id) {
        redacaoRepository.delete(buscar(id));
    }

    // o aluno só pode salvar como rascunho ou enviar; "CORRIGIDA" fica para a correção
    private void validarStatus(String status) {
        if (status != null && !"RASCUNHO".equals(status) && !"ENVIADA".equals(status)) {
            throw new BadRequest("Status inválido.");
        }
    }
}
