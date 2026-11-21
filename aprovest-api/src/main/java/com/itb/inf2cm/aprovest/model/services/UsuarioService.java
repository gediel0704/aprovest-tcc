package com.itb.inf2cm.aprovest.model.services;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import com.itb.inf2cm.aprovest.exceptions.BadRequest;
import com.itb.inf2cm.aprovest.exceptions.NotFound;
import com.itb.inf2cm.aprovest.model.entity.Usuario;
import com.itb.inf2cm.aprovest.model.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    public UsuarioService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder,
                          EntityManager entityManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
    }

    /** Cadastro de aluno pela tela "Criar conta". */
    @Transactional
    public Usuario cadastrar(Usuario usuario) {
        if (usuario.getSenha() == null || usuario.getSenha().length() < 6) {
            throw new BadRequest("A senha deve ter pelo menos 6 caracteres.");
        }
        String email = usuario.getEmail().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new BadRequest("Já existe uma conta com este e-mail.");
        }
        usuario.setIdUsuario(null);
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setTipo("ALUNO");      // pelo site, só é possível criar conta de aluno
        usuario.setStatus("ATIVO");
        Usuario salvo = usuarioRepository.saveAndFlush(usuario);
        entityManager.refresh(salvo);   // relê do banco para trazer o nome do vestibular
        return salvo;
    }

    /** Login: confere o e-mail e a senha criptografada. */
    public Usuario login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email == null ? "" : email.trim().toLowerCase())
                .orElseThrow(() -> new BadRequest("E-mail ou senha incorretos."));
        if (senha == null || !passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new BadRequest("E-mail ou senha incorretos.");
        }
        if ("INATIVO".equals(usuario.getStatus())) {
            throw new BadRequest("Esta conta está inativa. Fale com o administrador.");
        }
        return usuario;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAllByOrderByNomeAsc();
    }

    public Usuario buscar(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFound("Usuário não encontrado."));
    }

    /** Perfil: o aluno altera o nome e o vestibular que quer prestar. */
    @Transactional
    public Usuario atualizarPerfil(Integer id, Usuario dados) {
        Usuario usuario = buscar(id);
        if (dados.getNome() == null || dados.getNome().isBlank()) {
            throw new BadRequest("Informe o nome.");
        }
        usuario.setNome(dados.getNome().trim());
        usuario.setIdVestibularMeta(dados.getIdVestibularMeta());
        usuarioRepository.saveAndFlush(usuario);
        entityManager.refresh(usuario);
        return usuario;
    }

    /** Administrador ativa ou inativa uma conta. */
    public Usuario alterarStatus(Integer id, String status) {
        if (!"ATIVO".equals(status) && !"INATIVO".equals(status)) {
            throw new BadRequest("Status inválido.");
        }
        Usuario usuario = buscar(id);
        usuario.setStatus(status);
        return usuarioRepository.save(usuario);
    }
}
