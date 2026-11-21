package com.itb.inf2cm.aprovest.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Questao")
@Getter
@Setter
public class Questao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idQuestao;

    @NotBlank(message = "Informe o enunciado.")
    private String enunciado;

    @NotNull(message = "Informe o ano.")
    private Integer ano;

    private String fonte;
    private String dificuldade;   // FACIL, MEDIA ou DIFICIL

    @NotNull(message = "Escolha o vestibular.")
    private Integer idVestibular;

    @NotNull(message = "Escolha a matéria.")
    private Integer idMateria;

    private LocalDateTime dataCadastro;
    private String status;        // ATIVO ou INATIVO

    // relacionamentos 1:N (somente leitura, para mostrar os nomes nas listagens)
    @ManyToOne
    @JoinColumn(name = "idVestibular", insertable = false, updatable = false)
    private Vestibular vestibular;

    @ManyToOne
    @JoinColumn(name = "idMateria", insertable = false, updatable = false)
    private Materia materia;

    // uma questão tem de 2 a 5 alternativas; ao excluir a questão, as alternativas também são excluídas
    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("letra")
    private List<Alternativa> alternativas = new ArrayList<>();

    @PrePersist
    void antesDeInserir() {
        if (dataCadastro == null) dataCadastro = LocalDateTime.now();
        if (dificuldade == null) dificuldade = "MEDIA";
        if (status == null) status = "ATIVO";
    }
}
