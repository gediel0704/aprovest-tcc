package com.itb.inf2cm.aprovest.model.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Usuario")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @NotBlank(message = "Informe o nome.")
    @Size(max = 100)
    private String nome;

    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "E-mail inválido.")
    private String email;

    // a senha só é recebida (cadastro); nunca é devolvida nas respostas da API
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    private String tipo;               // ALUNO ou ADMIN
    private Integer idVestibularMeta;  // vestibular que o aluno quer prestar
    private LocalDateTime dataCadastro;
    private String status;             // ATIVO ou INATIVO

    // usado só para mostrar o nome do vestibular nas telas
    @ManyToOne
    @JoinColumn(name = "idVestibularMeta", insertable = false, updatable = false)
    private Vestibular vestibularMeta;

    @PrePersist
    void antesDeInserir() {
        if (dataCadastro == null) dataCadastro = LocalDateTime.now();
        if (tipo == null) tipo = "ALUNO";
        if (status == null) status = "ATIVO";
    }
}
