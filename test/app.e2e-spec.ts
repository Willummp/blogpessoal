import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common/enums';

describe('Testagem dos módulos Usuário e Auth (e2e)', () => {
  let app: INestApplication;
  let token: any;
  let usuarioId: any

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'db_blogpessoal_test',
          autoLoadEntities: true,
          synchronize: true,
          logging: false, // nao vai mostrar log de bd
          dropSchema: true // o schema vai ser apagado
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // iniciando o Nest
    await app.init();//inicio


  });
  afterAll(async () => {
    await app.close();// depois de tudo rodar, ele vai fechar o programa
  });
  it('01 - Deverá cadastrar Usuário', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuario/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ''
      });
    expect(HttpStatus.CREATED) // ou usar expect(201)

    usuarioId = resposta.body.id;
  });

  it("02 - Deverá autenticar Usuário (login)", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/auth/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot'
      });
    expect(200)
    token = resposta.body.token;
  });
  it('03 - Não deverá duplicar o Usuário', async () => {
    request(app.getHttpServer())
      .post('/usuario/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'root',
        foto: ''
      })
    expect(400);
  });
  it('04- Deverá Listar todos os Usuários', async () => {
    request(app.getHttpServer())
      .get('/usuario/all')
      .set('Authorization', `${token}`)
      .send({})
    expect(HttpStatus.OK)
  });
  it('05 - Deverá atualizar um usuário', async () => {
    request(app.getHttpServer())
      .put('/usuario/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'root',
        foto: ''
      })
      .then(resposta => {
        expect('Root Atualizado').toEqual(resposta.body.name);
      })
    expect(HttpStatus.OK)
  })
});
