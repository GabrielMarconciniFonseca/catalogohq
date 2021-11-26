package com.quadrinhos.hq.bancohq.controller;


import com.quadrinhos.hq.bancohq.exception.UsuarioNotFoundException;
import com.quadrinhos.hq.bancohq.model.Quadrinhos;
import com.quadrinhos.hq.bancohq.model.Usuarios;
import com.quadrinhos.hq.bancohq.repository.QuadrinhosRepository;
import com.quadrinhos.hq.bancohq.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.support.Repositories;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosRepository repository;

    @Autowired
    private QuadrinhosRepository quadrinhosRepository;


    @GetMapping
    public ResponseEntity<?> retornaTodosUsuarios(@PageableDefault(size = 2) Pageable page) {
        Page<Usuarios> usuarios = repository.findAll(page);

        return new ResponseEntity<>(usuarios, HttpStatus.OK);


    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> retornaPorId(@PathVariable(value = "id") Integer id) throws UsuarioNotFoundException {

        Optional<Usuarios> user = repository.findById(id);
        if (user.isPresent()) {

            return new ResponseEntity<Usuarios>(user.get(), HttpStatus.OK);

        } else {

            throw new UsuarioNotFoundException("Usuario não encontrado");

        }


    }

    @PostMapping("/adicionar")

    public ResponseEntity<?> adicionaUsuario(@RequestBody Usuarios usuarios) throws UsuarioNotFoundException {
        validaDados(usuarios);
        repository.save(usuarios);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);

    }

    @PutMapping("/alterar")
    public ResponseEntity<?> alterarUsuario(@RequestBody Usuarios usuarios) throws UsuarioNotFoundException {


        Optional<Usuarios> user = repository.findById(usuarios.getId());
        if (user.isPresent()) {
            validaDados(usuarios);
            user.get().setNome(usuarios.getNome());
            user.get().setEmail(usuarios.getEmail());
            user.get().setSenha(usuarios.getSenha());
            repository.save(user.get());
            return new ResponseEntity<Usuarios>(user.get(), HttpStatus.OK);

        } else {

            throw new UsuarioNotFoundException("Usuario não encontrado");

        }

    }

    @DeleteMapping("deletar/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable(value = "id") Integer id) throws UsuarioNotFoundException {
        Optional<Usuarios> user = repository.findById(id);
        if (user.isPresent()){
            List<Quadrinhos> quadrinhos= quadrinhosRepository.apagarUsuarios(user.get().getId());
            if (!quadrinhos.isEmpty()){
                quadrinhos.forEach(quadrinho->{
                    quadrinhosRepository.delete(quadrinho);
                });
            }
            repository.delete(user.get());
            return new ResponseEntity<>(HttpStatus.OK);

        }else{
            throw  new UsuarioNotFoundException("Usuario não encontrado");
        }
    }


    private void validaDados(Usuarios usuarios) throws UsuarioNotFoundException {

        Integer id = usuarios.getId() == null ? 0 : usuarios.getId();
        String email = repository.findEmail(usuarios.getEmail(), id);
        if (email != null) {
            throw new UsuarioNotFoundException("Email já existente ");
        }


    }


}