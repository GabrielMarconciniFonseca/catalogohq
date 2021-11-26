package com.quadrinhos.hq.bancohq.repository;

import com.quadrinhos.hq.bancohq.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;


public interface UsuariosRepository extends PagingAndSortingRepository<Usuarios, Integer> {

    @Query(
            value = "Select email from USUARIOS where email = ?1 and id <> ?2 ",
            nativeQuery = true
    )
    String findEmail(String email, Integer id);


}
