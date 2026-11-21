package com.itb.inf2cm.aprovest.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Alternativa")
@Getter
@Setter
public class Alternativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAlternativa;

    private String letra;     // A, B, C, D ou E
    private String texto;
    private Boolean correta;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "idQuestao")
    private Questao questao;
}
