package com.itb.inf2cm.aprovest.model.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.itb.inf2cm.aprovest.exceptions.BadRequest;
import com.itb.inf2cm.aprovest.exceptions.NotFound;
import com.itb.inf2cm.aprovest.model.entity.MensagemContato;
import com.itb.inf2cm.aprovest.model.repository.MensagemContatoRepository;

@Service
public class MensagemContatoService {

    private final MensagemContatoRepository mensagemRepository;

    public MensagemContatoService(MensagemContatoRepository mensagemRepository) {
        this.mensagemRepository = mensagemRepository;
    }

    /** Fale Conosco: grava a mensagem enviada pelo visitante. */
    public MensagemContato enviar(MensagemContato mensagem) {
        mensagem.setIdMensagem(null);
        mensagem.setStatus("NOVA");
        mensagem.setDataEnvio(null);
        return mensagemRepository.save(mensagem);
    }

    public List<MensagemContato> listar() {
        return mensagemRepository.findAllByOrderByDataEnvioDesc();
    }

    public MensagemContato alterarStatus(Integer id, String status) {
        if (!List.of("NOVA", "LIDA", "RESPONDIDA").contains(status)) {
            throw new BadRequest("Status inválido.");
        }
        MensagemContato mensagem = buscar(id);
        mensagem.setStatus(status);
        return mensagemRepository.save(mensagem);
    }

    public void excluir(Integer id) {
        mensagemRepository.delete(buscar(id));
    }

    private MensagemContato buscar(Integer id) {
        return mensagemRepository.findById(id)
                .orElseThrow(() -> new NotFound("Mensagem não encontrada."));
    }
}
