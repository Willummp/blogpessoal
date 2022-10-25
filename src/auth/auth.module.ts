import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt/dist";
import { PassportModule } from "@nestjs/passport";
import { UsuarioModule } from "src/usuario/usuario.module";
import { Bcrypt } from "./bcrypt/bcrypt";
import { jwtConstants } from "./constants/constants";
import { AuthService } from "./services/auth.service";
import { LocalStrategy } from "./strategy/local.strategy";


@Module({
    imports: [
        UsuarioModule, 
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '24h'}
        })
    ],
    providers: [Bcrypt, AuthService, LocalStrategy],
    controllers: [],
    exports: [Bcrypt]
})
export class AuthModule {} //Ligar ele no app.module