package com.quadrinhos.hq.bancohq.controller;

import com.quadrinhos.hq.bancohq.exception.QuadrinhosNotFoundException;
import com.quadrinhos.hq.bancohq.model.Quadrinhos;
import com.quadrinhos.hq.bancohq.model.Usuarios;
import com.quadrinhos.hq.bancohq.repository.QuadrinhosRepository;
import com.quadrinhos.hq.bancohq.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.openmbean.OpenMBeanInfo;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

@RestController
@RequestMapping("/quadrinhos")
public class QuadrinhosController {

    @Autowired
    private QuadrinhosRepository repository;

    @Autowired
    private UsuariosRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<?> retornaQuadrinhos() {
        Iterable<Quadrinhos> quadrinhos = repository.findAll();


        return new ResponseEntity<>(quadrinhos, HttpStatus.OK);


    }

    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionaQuadrinho(@RequestBody Quadrinhos quadrinho) {

        repository.save(quadrinho);
        return new ResponseEntity<>(quadrinho, HttpStatus.OK);


    }

    @GetMapping("/{id}")
    public ResponseEntity<?> retornaPorId(@PathVariable(value = "id") Integer id) throws QuadrinhosNotFoundException {

        Optional<Quadrinhos> quadrinho = repository.findById(id);
        if (quadrinho.isPresent()) {

            return new ResponseEntity<>(quadrinho, HttpStatus.OK);

        } else {

            throw new QuadrinhosNotFoundException("Quadrinho não encontrado");
        }


    }

    @PutMapping("/alterar")
    public ResponseEntity<?> alterarQuadrinho(@RequestBody Quadrinhos quadrinhos)
            throws QuadrinhosNotFoundException {
        Optional<Quadrinhos> quadrinho = repository.findById(quadrinhos.getId());
        if (quadrinho.isPresent()) {
            Quadrinhos quadrinhoAlterado = new Quadrinhos();
            quadrinhoAlterado.setId(quadrinhos.getId());
            quadrinhoAlterado.setEditora(quadrinhos.getEditora());
            quadrinhoAlterado.setColecao(quadrinhos.getColecao());
            quadrinhoAlterado.setNomeEdicao(quadrinhos.getNomeEdicao());
            Optional<Usuarios> usuario = usuarioRepository.findById(quadrinhos.getUsuarios().getId());
            if (usuario.isEmpty()) {
                throw new QuadrinhosNotFoundException("Usuario do Quadrinho não existe!!!");
            }

            quadrinhoAlterado.setUsuarios(usuario.get());

            repository.save(quadrinhoAlterado);
            return new ResponseEntity<>(quadrinhoAlterado, HttpStatus.OK);

        } else {

            throw new QuadrinhosNotFoundException("Quadrinho não encontrado");
        }


    }

    @DeleteMapping("/deletar/{id}")

    public ResponseEntity<?> apagarQuadrinho(@PathVariable(value = "id") Integer id) throws QuadrinhosNotFoundException {
        Optional<Quadrinhos> quadrinho = repository.findById(id);
        if (quadrinho.isPresent()) {
            repository.delete(quadrinho.get());
            return new ResponseEntity<>(HttpStatus.OK);

        } else {
            throw new QuadrinhosNotFoundException("Quadrinho não encontrado");

        }


    }

    @GetMapping("/{campo}/{valor}")

    public ResponseEntity<?> obterPorColecao(@PathVariable(value = "campo") String campo,
                                             @PathVariable(value = "valor") String valor)
            throws QuadrinhosNotFoundException {
        List<Quadrinhos> quadrinhos;
        switch (campo) {
            case "colecao":
                quadrinhos = repository.findByColecaoIgnoreCaseContaining(valor);
                break;
            case "editora":
                quadrinhos = repository.findByEditoraIgnoreCaseContaining(valor);
                break;
            case "nome_edicao":
                quadrinhos = repository.findByNomeEdicaoIgnoreCaseContaining(valor);
                break;
            default:
                throw new QuadrinhosNotFoundException("Propriedade não existe ");


        }
        if (quadrinhos.isEmpty()) {
            throw new QuadrinhosNotFoundException("Coleção não encontrada");

        }
        return new ResponseEntity<>(quadrinhos, HttpStatus.OK);

    }

}
