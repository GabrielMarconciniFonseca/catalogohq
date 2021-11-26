package com.quadrinhos.hq.bancohq.model;

import com.sun.istack.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.hibernate.annotations.NotFound;

import javax.persistence.*;

@Entity(name = "QUADRINHOS")
@Data
@Getter
@Setter
public class Quadrinhos {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "editora")
    private String editora;
    @Column(name = "colecao")
    private String colecao;
    @Column(name = "nome_edicao")
    private String nomeEdicao;

    @ManyToOne
    @JoinColumn(name = "usuarios_id")
    private Usuarios usuarios;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEditora() {
        return editora;
    }

    public void setEditora(String editora) {
        this.editora = editora;
    }

    public String getColecao() {
        return colecao;
    }

    public void setColecao(String colecao) {
        this.colecao = colecao;
    }

    public String getNomeEdicao() {
        return nomeEdicao;
    }

    public void setNomeEdicao(String nomeEdicao) {
        this.nomeEdicao = nomeEdicao;
    }

    public Usuarios getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Usuarios usuarios) {
        this.usuarios = usuarios;
    }
}
