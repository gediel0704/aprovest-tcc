package com.itb.inf2cm.aprovest.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "MensagemContato")
@Getter
@Setter
public class MensagemContato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMensagem;

    @NotBlank(message = "Informe seu nome.")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "Informe seu e-mail.")
    @Email(message = "E-mail inválido.")
    private String email;

    @NotBlank(message = "Escolha o assunto.")
    private String assunto;

    @NotBlank(message = "Escreva a mensagem.")
    @Size(max = 1000, message = "A mensagem pode ter até 1000 caracteres.")
    private String mensagem;

    private String status;        // NOVA, LIDA ou RESPONDIDA
    private LocalDateTime dataEnvio;

    @PrePersist
    void antesDeInserir() {
        if (dataEnvio == null) dataEnvio = LocalDateTime.now();
        if (status == null) status = "NOVA";
    }
}
