import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";

@Injectable()
  export class UsuarioService {
    constructor(
      @InjectRepository(Usuario)
      private usuarioRepository: Repository<Usuario>,
      private bcrypt: Bcrypt
    ){}

    async findByUsuario (usuario: string): Promise<Usuario>{
      return await this.usuarioRepository.findOne({
        where: {usuario: usuario}
      });
    }

    async findAll (): Promise<Usuario[]> {
      return await this.usuarioRepository.find({
        relations: {postagem: true}
      })
    }

    async findbyId (id: number): Promise<Usuario> {
      let buscaUsuario =  await this.usuarioRepository.findOne({
        where: {id},
        relations: {postagem: true}})

      if (!buscaUsuario)
        throw new HttpException('Usuario nao encontrado', HttpStatus.NOT_FOUND)
      return buscaUsuario;
    }

    async create (usuario: Usuario): Promise<Usuario>{
      let buscaUsuario = await this.findByUsuario(usuario.usuario)

      if(!buscaUsuario){
        usuario.senha = await this.bcrypt.criptSenha(usuario.senha);
        return await this.usuarioRepository.save(usuario)
      }
      throw new HttpException('O USUARIO EXISTE', HttpStatus.BAD_REQUEST)
    }

    async update (usuario: Usuario): Promise<Usuario>{
      let updateUsuario: Usuario = await this.findbyId(usuario.id);
      let buscaUsuario = await this.findByUsuario(usuario.usuario);

      if (!updateUsuario)
        throw new HttpException('Usuario nao encontrado"', HttpStatus.NOT_FOUND);
      if(buscaUsuario && buscaUsuario.id != usuario.id)
        throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST)

      usuario.senha = await this.bcrypt.criptSenha(usuario.senha);
      return await this.usuarioRepository.save(usuario);
    }
}
