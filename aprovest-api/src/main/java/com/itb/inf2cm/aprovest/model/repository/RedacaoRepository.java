package com.itb.inf2cm.aprovest.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itb.inf2cm.aprovest.model.entity.Redacao;

public interface RedacaoRepository extends JpaRepository<Redacao, Integer> {

    List<Redacao> findByIdUsuarioOrderByDataCriacaoDesc(Integer idUsuario);

    long countByStatus(String status);
}
