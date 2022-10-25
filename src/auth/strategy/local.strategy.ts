import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor (private authService: AuthService){
    super({
      usernameField: 'usuario',
      passwordField: 'senha'
    })
   }
  async validate (username: string, password: string): Promise<any> {
    const  user = await this.authService.validateUser(username, password);
    if (!user){
      throw new UnauthorizedException();
    }
    return user;
   }
   
}