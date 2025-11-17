# Sistema de Tarefas

Sistema simples de gerenciamento de tarefas desenvolvido durante meu estágio. É basicamente uma lista de to-do onde você pode criar uma conta, fazer login e gerenciar suas tarefas do dia a dia.

## O que o sistema faz

Criei um sistema bem direto ao ponto. Você consegue se cadastrar, fazer login e gerenciar suas tarefas. Dá pra adicionar descrições, colocar prazos e marcar quando concluir alguma tarefa. Também tem uns filtros pra facilitar a visualização.

Funcionalidades principais:
- Cadastro e login de usuários
- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Adicionar prazos nas tarefas
- Filtrar por status (todas, pendentes ou concluídas)
- Sistema de alerta visual quando o prazo está próximo

## Tecnologias que usei

No frontend eu mantive simples, sem frameworks pesados:
- HTML, CSS e JavaScript puro
- LocalStorage pra guardar o token de autenticação
- Fetch API pra comunicação com o backend

O backend (que não está nesse repositório) foi feito em Python com FastAPI e usa JWT pra autenticação.

## Como está organizado

```
projeto/
├── index.html          - tela de login
├── register.html       - tela de cadastro
├── dashboard.html      - tela principal com as tarefas
├── css/
│   └── styles.css      - todos os estilos
└── js/
    └── scripts.js      - toda a lógica e comunicação com API
```

Eu sei que poderia ter separado melhor o CSS e o JavaScript em arquivos menores, mas como o projeto é pequeno, achei que assim ficaria mais fácil de entender.

## Como rodar o projeto

### O que você precisa ter instalado

- Um navegador atualizado (Chrome, Firefox, qualquer um serve)
- O servidor backend rodando na porta 8000

### Configurando

1. Primeiro, certifique-se que o backend está rodando em `http://127.0.0.1:8000`

2. Se o seu backend estiver em outra porta ou endereço, é só editar o arquivo `js/scripts.js` na linha 2:
```javascript
const API_URL = 'http://127.0.0.1:8000';
```

3. Depois é só abrir o arquivo `index.html` no navegador. Você pode clicar duas vezes nele ou usar alguma extensão tipo Live Server se estiver usando o VSCode.

### Sobre o backend

O backend precisa ter esses endpoints funcionando:

**Autenticação:**
- POST `/auth/signup` - pra criar conta nova
- POST `/auth/login` - pra fazer login

**Tarefas:**
- GET `/tasks` - busca todas as tarefas
- POST `/tasks` - cria uma tarefa nova
- PUT `/tasks/{id}` - atualiza uma tarefa
- DELETE `/tasks/{id}` - deleta uma tarefa

Todos os endpoints de tarefas precisam do header `Authorization: Bearer {token}`.

## Como usar

### Primeira vez usando

1. Abra o `register.html`
2. Coloque seu nome, email e uma senha (mínimo 6 caracteres)
3. Clica em cadastrar
4. Você vai ser redirecionado pro login automaticamente

### Usando o sistema

Depois de fazer login, você vai ver a tela principal. É bem intuitivo:

- Pra adicionar uma tarefa, preenche o formulário no topo e clica em "Adicionar"
- Pra marcar como concluída, é só clicar no checkbox do lado esquerdo
- Pra editar, clica no ícone de lápis
- Pra excluir, clica na lixeira (vai pedir confirmação)
- Usa os botões de filtro pra ver só o que você quer

## Detalhes técnicos

### Sistema de cores dos prazos

Implementei um sistema visual pra ajudar a identificar tarefas urgentes:
- Cor padrão quando o prazo está tranquilo (mais de 3 dias)
- Amarelo quando está próximo (1 a 3 dias)
- Vermelho quando está muito perto (menos de 24h)
- Fica marcado como "Atrasada" quando passou do prazo

### Validações

Coloquei validações básicas:
- Email tem que ter formato válido
- Senha mínima de 6 caracteres
- Nome mínimo de 3 caracteres
- Título da tarefa é obrigatório

### Segurança

O token JWT fica salvo no LocalStorage. Eu sei que tem discussões sobre isso ser 100% seguro ou não, mas pra um projeto de estudos achei que estava ok. Em produção dá pra melhorar isso usando cookies httpOnly.

Quando o token expira ou é inválido, o sistema redireciona automaticamente pro login.

## Responsividade

Tentei deixar o sistema funcional em celular também. Fiz alguns breakpoints em:
- 768px - ajusta layout pra tablets
- 480px - ajusta pra celulares menores

Não ficou perfeito, mas dá pra usar tranquilo no celular.

## Problemas conhecidos

Algumas coisas que eu sei que poderiam ser melhores:

- O código JavaScript poderia estar mais organizado em módulos
- Falta tratamento de erro em alguns casos específicos
- Não tem loading state em todas as operações
- Poderia ter mais feedback visual em algumas ações
- O modal de edição poderia ter animação de saída

## Ideias pra futuro

Se eu tivesse mais tempo, gostaria de adicionar:

- Sistema de categorias ou tags
- Busca de tarefas
- Possibilidade de reordenar as tarefas
- Modo escuro
- Estatísticas tipo "tarefas concluídas essa semana"
- Exportar tarefas pra PDF ou CSV

## Considerações finais

Foi meu primeiro projeto fullstack completo. Aprendi bastante sobre comunicação entre frontend e backend, autenticação com JWT e gerenciamento de estado no JavaScript puro.

O código não está perfeito e sei que tem várias coisas que dá pra melhorar, mas pra um projeto de aprendizado acho que ficou legal.

Qualquer feedback ou sugestão é bem-vinda!

---
