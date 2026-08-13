# 💰 Finance Dashboard

Aplicação web para controle financeiro pessoal, desenvolvida com HTML, CSS e JavaScript puro.

O projeto permite cadastrar, visualizar, editar e excluir receitas e despesas, além de calcular automaticamente receitas, despesas e saldo financeiro.

Também possui filtros por tipo, categoria e descrição, permitindo ao usuário encontrar rapidamente uma determinada transação.

---

## 📌 Sobre o projeto

O Finance Dashboard foi desenvolvido como um projeto de portfólio com o objetivo de demonstrar conhecimentos em:

- HTML5
- CSS3
- JavaScript
- Manipulação do DOM
- Manipulação de arrays e objetos
- CRUD
- LocalStorage
- Eventos
- Funções
- Filtros e busca
- Cálculos financeiros
- Organização de código

A proposta do projeto não é criar um sistema financeiro empresarial completo, mas construir uma aplicação pequena que utilize diferentes conceitos importantes de desenvolvimento Front-End.

---

## 🎯 Objetivo

O objetivo principal é permitir que o usuário tenha uma visão simples de sua movimentação financeira.

A aplicação permite:

- Cadastrar receitas
- Cadastrar despesas
- Visualizar transações
- Editar transações
- Excluir transações
- Calcular receitas
- Calcular despesas
- Calcular saldo
- Filtrar transações
- Pesquisar transações
- Persistir os dados no navegador

---

## 🚀 Funcionalidades

### Cadastro de transações

O usuário pode cadastrar uma nova transação informando:

- Tipo
- Categoria
- Descrição
- Valor
- Data

Exemplo:

```text
Tipo: Receita
Categoria: Salário
Descrição: Salário mensal
Valor: R$ 5.000,00
Data: 12/08/2026
```

---

### 📋 Listagem

As transações cadastradas são exibidas dinamicamente na interface.

Cada transação apresenta:

- Descrição
- Categoria
- Data
- Valor
- Ações disponíveis

Exemplo:

```text
Salário
Salário - 12/08/2026
+ R$ 5.000,00

[Editar] [Excluir]
```

---

### ✏️ Edição

O usuário pode selecionar uma transação existente através do botão **Editar**.

Os dados da transação são carregados novamente no formulário.

Depois de alterar os dados, o usuário pode salvar a alteração.

Fluxo:

```text
Transação
    ↓
Editar
    ↓
Dados carregados no formulário
    ↓
Usuário altera os dados
    ↓
Salvar alteração
    ↓
Atualização do array
    ↓
Atualização do LocalStorage
    ↓
Atualização da interface
```

---

### 🗑️ Exclusão

O usuário pode excluir uma transação.

Antes da exclusão é apresentada uma confirmação:

```text
Deseja excluir "Mercado"?
```

Caso o usuário confirme, a transação é removida do array e do LocalStorage.

---

### 💰 Resumo financeiro

A aplicação calcula automaticamente:

- Saldo
- Total de receitas
- Total de despesas

A fórmula utilizada para o saldo é:

```text
Saldo = Receitas - Despesas
```

Exemplo:

```text
Receitas:  R$ 5.000,00
Despesas:  R$ 1.500,00
----------------------
Saldo:     R$ 3.500,00
```

---

### 🔎 Filtros

A aplicação possui filtros por:

- Tipo
- Categoria
- Descrição

Os filtros são aplicados através do botão:

```text
Aplicar filtros
```

Exemplo:

```text
Tipo: Despesas
Categoria: Alimentação
Buscar: mercado

        ↓

Aplicar filtros

        ↓

Resultado
```

Os filtros podem ser combinados.

---

## 🧠 Conceitos de JavaScript utilizados

Este projeto foi desenvolvido propositalmente utilizando JavaScript puro para demonstrar domínio dos fundamentos da linguagem.

### Arrays

As transações são armazenadas em um array:

```javascript
let transactions = [];
```

Cada transação é representada por um objeto:

```javascript
const transaction = {
    id: Date.now(),
    type: "expense",
    category: "food",
    description: "Mercado",
    amount: 300,
    date: "2026-08-12"
};
```

---

### `find()`

Utilizado para localizar uma transação específica pelo ID.

```javascript
const transaction = transactions.find(
    function (transaction) {
        return transaction.id === id;
    }
);
```

É utilizado principalmente durante a edição e exclusão.

---

### `findIndex()`

Utilizado para descobrir a posição de uma transação dentro do array.

```javascript
const transactionIndex =
    transactions.findIndex(
        function (transaction) {
            return transaction.id === id;
        }
    );
```

Isso permite substituir uma transação existente.

---

### `filter()`

Utilizado para:

- Filtrar receitas
- Filtrar despesas
- Filtrar categorias
- Realizar pesquisas
- Excluir transações

Exemplo:

```javascript
const expenses = transactions.filter(
    function (transaction) {
        return transaction.type === "expense";
    }
);
```

---

### `reduce()`

Utilizado para calcular os valores financeiros.

Exemplo:

```javascript
const totalIncome =
    transactions
        .filter(function (transaction) {
            return transaction.type === "income";
        })
        .reduce(function (total, transaction) {
            return total + transaction.amount;
        }, 0);
```

O `reduce()` transforma vários valores em um único resultado.

Neste projeto, ele é utilizado para calcular os totais financeiros.

---

### `includes()`

Utilizado para realizar a pesquisa por descrição.

```javascript
transaction.description
    .toLowerCase()
    .includes(searchTerm);
```

Assim, uma pesquisa por:

```text
mercado
```

pode encontrar:

```text
Compra no Mercado
```

---

### Spread Operator

Utilizado para criar uma cópia do array antes de aplicar os filtros:

```javascript
let filteredTransactions = [
    ...transactions
];
```

Isso permite trabalhar com uma versão filtrada sem modificar diretamente o array original.

---

## 💾 Persistência dos dados

Os dados são armazenados utilizando:

```text
localStorage
```

Isso permite que as transações permaneçam disponíveis mesmo depois que o usuário atualiza a página.

Como o LocalStorage trabalha com strings, utilizamos:

### `JSON.stringify()`

Para transformar o array em texto:

```javascript
localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);
```

### `JSON.parse()`

Para transformar novamente o texto em um array:

```javascript
const transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];
```

Fluxo:

```text
Objeto JavaScript
       ↓
      JSON
       ↓
  LocalStorage
       ↓
      JSON
       ↓
Objeto JavaScript
```

---

## 🏗️ Estrutura do projeto

```text
finance-dashboard/
│
├── index.html
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

### `index.html`

Responsável pela estrutura da aplicação.

Contém:

- Dashboard
- Formulário
- Campos de entrada
- Filtros
- Lista de transações
- Botões

---

### `css/style.css`

Responsável pela apresentação visual da aplicação.

Contém:

- Layout
- Cards
- Formulários
- Botões
- Lista de transações
- Filtros
- Responsividade

---

### `js/app.js`

Responsável pela lógica da aplicação.

Principais responsabilidades:

```text
Cadastro
Edição
Exclusão
Listagem
Filtros
Busca
Cálculos
LocalStorage
Eventos
Manipulação do DOM
```

---

## 🔄 Fluxo da aplicação

### Cadastro

```text
Usuário
   ↓
Formulário
   ↓
JavaScript
   ↓
Objeto da transação
   ↓
Array transactions
   ↓
LocalStorage
   ↓
Renderização
```

### Edição

```text
Usuário
   ↓
Editar
   ↓
find()
   ↓
Dados carregados no formulário
   ↓
Alteração
   ↓
findIndex()
   ↓
Array atualizado
   ↓
LocalStorage
   ↓
Interface atualizada
```

### Exclusão

```text
Usuário
   ↓
Excluir
   ↓
Confirmação
   ↓
filter()
   ↓
Array atualizado
   ↓
LocalStorage
   ↓
Interface atualizada
```

### Filtros

```text
transactions
      ↓
Filtro por tipo
      ↓
Filtro por categoria
      ↓
Busca por descrição
      ↓
filteredTransactions
      ↓
Renderização
```

---

## 🖥️ Interface

A aplicação possui três indicadores principais:

```text
┌───────────────┬───────────────┬───────────────┐
│    SALDO      │   RECEITAS    │   DESPESAS    │
│               │               │               │
│ R$ 3.500,00   │ R$ 5.000,00   │ R$ 1.500,00   │
└───────────────┴───────────────┴───────────────┘
```

Além disso, possui:

```text
Nova transação
├── Tipo
├── Categoria
├── Descrição
├── Valor
└── Data

Filtros
├── Tipo
├── Categoria
├── Busca
└── Aplicar filtros

Transações
├── Editar
└── Excluir
```

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Estilização e responsividade |
| JavaScript | Lógica da aplicação |
| DOM API | Manipulação da interface |
| LocalStorage | Persistência dos dados |
| Git | Controle de versão |
| GitHub | Hospedagem do código |

---

## ▶️ Como executar

Não é necessário instalar dependências.

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entre na pasta

```bash
cd finance-dashboard
```

### 3. Execute o projeto

Abra o arquivo:

```text
index.html
```

Também é possível utilizar uma extensão como o **Live Server** no Visual Studio Code.

---

## 🧪 Testes realizados

### Transações

- [x] Criar receita
- [x] Criar despesa
- [x] Visualizar transações
- [x] Editar transação
- [x] Excluir transação
- [x] Cancelar edição

### Cálculos

- [x] Total de receitas
- [x] Total de despesas
- [x] Cálculo do saldo
- [x] Atualização após edição
- [x] Atualização após exclusão

### Persistência

- [x] Dados permanecem após atualizar a página
- [x] Dados são armazenados no LocalStorage
- [x] Alterações são persistidas
- [x] Exclusões são persistidas

### Filtros

- [x] Filtrar receitas
- [x] Filtrar despesas
- [x] Filtrar por categoria
- [x] Pesquisar por descrição
- [x] Combinar filtros
- [x] Exibir mensagem quando nenhum resultado é encontrado

---

## 📚 Principais aprendizados

Durante o desenvolvimento deste projeto foram praticados conceitos importantes de desenvolvimento Front-End, principalmente relacionados à manipulação de dados.

Os principais aprendizados foram:

- Estruturação de uma aplicação sem framework
- Manipulação do DOM
- Criação e atualização de elementos dinamicamente
- Manipulação de arrays e objetos
- Implementação de CRUD
- Persistência utilizando LocalStorage
- Uso de métodos como `find`, `findIndex`, `filter` e `reduce`
- Delegação de eventos
- Implementação de filtros combinados
- Separação entre dados originais e dados filtrados
- Atualização da interface após alterações no estado da aplicação

---

## 🔐 Considerações sobre segurança

Este projeto utiliza `localStorage` apenas para fins educacionais.

As informações armazenadas no LocalStorage não devem ser consideradas seguras para aplicações reais.

Em uma aplicação financeira real, seria necessário utilizar:

- Backend
- Banco de dados
- Autenticação
- Autorização
- Criptografia quando apropriado
- Validação no servidor
- Controle de acesso
- Proteção contra XSS
- HTTPS

O projeto utiliza JavaScript no navegador propositalmente para demonstrar conceitos de Front-End.

---

## 🚧 Próximas melhorias

O projeto continuará sendo evoluído gradualmente.

### Planejado

- [ ] Ordenação por data
- [ ] Ordenação por valor
- [ ] Formatação amigável das datas
- [ ] Gráficos financeiros
- [ ] Dashboard com indicadores adicionais
- [ ] Filtro por período
- [ ] Melhor tratamento de erros
- [ ] Melhorias de acessibilidade
- [ ] Refatoração de partes do código
- [ ] Testes automatizados

---

## 📌 Objetivo de portfólio

Este projeto faz parte de uma série de projetos desenvolvidos para demonstrar evolução prática em desenvolvimento de software.

A proposta é priorizar projetos relativamente pequenos, porém com funcionalidades suficientes para demonstrar:

```text
Lógica de programação
        +
Manipulação de dados
        +
Interface
        +
Persistência
        +
Organização de código
        +
Boas práticas
```

---

## 👨‍💻 Autor

**Glauber Bandeira**

Projeto desenvolvido para fins de estudo, prática e portfólio profissional.

---

⭐ Se este projeto foi útil para você, considere deixar uma estrela no repositório.
