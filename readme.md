# Top 5 Tião Carreiro

## Desenvolvedor
**Luciano Felli Nakasone**
- E-mail: inbox@lfelli.com
- Telefone: 11 976055660
- Site: https://lfelli.com
- Linkedin: https://www.linkedin.com/in/lfellidev/

## Descrição
Top 5 Tião Carreiro é um projeto de um site de música, onde o usuário pode criar uma conta, fazer login, adicionar músicas, curtir músicas, comentar músicas e ver as músicas mais curtidas.
O projeto foi desenvolvido em React/Vite no Front-end e com Laravel 11.31 no back-end.

## Pré-requisitos
Requerimento: Docker, Docker Compose

## Inicialização
No terminal(prompt), execute o seguinte comando para inicializar o projeto:
```bash
docker-compose up --build -d
```

Para acessar o projeto, acesse pelo navegador:
```bash
http://localhost:3000
```
## Usuários pré-definidos
#### Administrador
- email: admin@admin.com
- senha: admin1234

#### Usuário comun
- email: inbox@lfelli.com
- senha: 12341234


## Testes
### back-end (Laravel)
Dentro da pasta ./backend execute:
```bash
php artisan test
```

### front-end (React)
Dentro da pasta ./frontend execute:
```bash
npm run test
```
