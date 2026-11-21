package com.itb.inf2cm.aprovest.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidade associativa do relacionamento N:N entre Usuario (aluno) e Questao.
 */
@Entity
@Table(name = "RespostaAluno")
@Getter
@Setter
public class RespostaAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idResposta;

    private Integer idUsuario;
    private Integer idQuestao;
    private String letraEscolhida;
    private Boolean acertou;
    private LocalDateTime dataResposta;

    @ManyToOne
    @JoinColumn(name = "idQuestao", insertable = false, updatable = false)
    private Questao questao;

    @PrePersist
    void antesDeInserir() {
        if (dataResposta == null) dataResposta = LocalDateTime.now();
    }
}
