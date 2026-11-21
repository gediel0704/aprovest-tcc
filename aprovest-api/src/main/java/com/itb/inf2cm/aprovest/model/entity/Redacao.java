package com.itb.inf2cm.aprovest.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Redacao")
@Getter
@Setter
public class Redacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRedacao;

    @NotBlank(message = "Informe o título.")
    @Size(max = 150, message = "O título pode ter até 150 caracteres.")
    private String titulo;

    @NotBlank(message = "Informe o tema.")
    @Size(max = 200, message = "O tema pode ter até 200 caracteres.")
    private String tema;

    @NotBlank(message = "Escreva o texto da redação.")
    @Size(max = 5000, message = "O texto pode ter até 5000 caracteres.")
    private String texto;

    private String status;        // RASCUNHO, ENVIADA ou CORRIGIDA
    private Integer nota;
    private LocalDateTime dataCriacao;

    @NotNull(message = "Informe o aluno.")
    private Integer idUsuario;

    @PrePersist
    void antesDeInserir() {
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
        if (status == null) status = "RASCUNHO";
    }
}
