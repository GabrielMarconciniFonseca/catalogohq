package com.quadrinhos.hq.bancohq.repository;


import com.quadrinhos.hq.bancohq.model.Quadrinhos;
import com.quadrinhos.hq.bancohq.model.Usuarios;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface QuadrinhosRepository extends PagingAndSortingRepository<Quadrinhos, Integer> {


    List<Quadrinhos> findByColecaoIgnoreCaseContaining(String colecao);

    List<Quadrinhos> findByEditoraIgnoreCaseContaining(String editora);

    List<Quadrinhos> findByNomeEdicaoIgnoreCaseContaining(String nome);


    @Query(
            value = "select * from QUADRINHOS where usuarios_id = ?1",
            nativeQuery = true
    )
    List<Quadrinhos>apagarUsuarios(Integer idUsuario);


}
