package com.itb.inf2cm.aprovest.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Vestibular")
@Getter
@Setter
public class Vestibular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVestibular;

    private String sigla;
    private String nome;
    private String instituicao;
}
