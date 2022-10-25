import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Usuario } from "./entities/usuario.entity";
import { UsuarioService } from "./services/usuario.service";
import { Bcrypt } from "src/auth/bcrypt/bcrypt";
import { UsuarioController } from "./controllers/usuario.controller";


@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuarioService, Bcrypt],
  controllers: [UsuarioController],
  exports: [TypeOrmModule]

}) export class UsuarioModule {}