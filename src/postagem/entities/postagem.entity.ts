import { IsNotEmpty } from "class-validator";
import { Tema } from "../../tema/entities/tema.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'tb_postagens'})
export class Postagem {

  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({length: 100, nullable: false})
  titulo: string;

  @IsNotEmpty()
  @Column({length: 1000, nullable: false})
  texto: string;

  @UpdateDateColumn()
  data: Date;

  @ManyToOne(() => Tema, (tema) => tema.postagem, {
    onDelete: "CASCADE"
  })
  tema: Tema;

  @ManyToOne (() => Usuario, (usuario)=> usuario.postagem,{
    onDelete: "CASCADE"})
  usuario: Usuario
}