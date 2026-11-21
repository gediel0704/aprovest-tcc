package com.itb.inf2cm.aprovest.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itb.inf2cm.aprovest.model.entity.MensagemContato;

public interface MensagemContatoRepository extends JpaRepository<MensagemContato, Integer> {

    List<MensagemContato> findAllByOrderByDataEnvioDesc();

    long countByStatus(String status);
}
