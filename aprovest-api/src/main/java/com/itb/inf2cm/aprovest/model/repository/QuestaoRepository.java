package com.itb.inf2cm.aprovest.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.itb.inf2cm.aprovest.model.entity.Questao;

public interface QuestaoRepository extends JpaRepository<Questao, Integer> {

    // Consulta com filtros opcionais (quando o filtro vem vazio, ele é ignorado)
    @Query("""
            SELECT q FROM Questao q
            WHERE (:idMateria IS NULL OR q.idMateria = :idMateria)
              AND (:idVestibular IS NULL OR q.idVestibular = :idVestibular)
              AND (:busca IS NULL OR LOWER(q.enunciado) LIKE LOWER(CONCAT('%', :busca, '%')))
            ORDER BY q.idQuestao DESC
            """)
    List<Questao> pesquisar(@Param("idMateria") Integer idMateria,
                            @Param("idVestibular") Integer idVestibular,
                            @Param("busca") String busca);

    List<Questao> findByStatus(String status);

    long countByStatus(String status);
}
