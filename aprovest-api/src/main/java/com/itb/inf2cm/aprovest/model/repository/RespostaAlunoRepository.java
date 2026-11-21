package com.itb.inf2cm.aprovest.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itb.inf2cm.aprovest.model.entity.RespostaAluno;

public interface RespostaAlunoRepository extends JpaRepository<RespostaAluno, Integer> {

    List<RespostaAluno> findByIdUsuarioOrderByDataRespostaDesc(Integer idUsuario);
}
