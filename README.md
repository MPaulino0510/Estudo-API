
---
# Documentação do Projeto - API de Alunos

Este repositório contém os arquivos de configuração do banco de dados, scripts SQL e o servidor principal da API.

---

## 1. Configuração do Banco de Dados (`db.js`)

```javascript
require("dotenv").config();
const mysql = require("mysql2/promise");
const conexao = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
module.exports = conexao;

```

> **Comentários do Código:**
> O .env, é uma forma de deixar o código mais seguro, afinal, ele cria uma variável com sua senha, nome da sua database, usuário, sua host e porta, e "esconde ela" de possíveis bots no próprio github, que poderiam eventualmente roubar sua senha. Ela é extremamente importante, provavelmente a informação mais útil relacionada a repositórios e banco de dados.

---

## 2. Script do Banco de Dados (`db.sql`)

```sql
CREATE DATABASE if NOT EXISTS cadastros; 

```

> **Comentários do Código:**
> Cria uma database nova (se caso já não existir uma database com esse nome).

```sql
USE cadastros;

```

> **Comentários do Código:**
> Usa a database nova criada.

```sql
CREATE TABLE if NOT EXISTS alunos (

```

> **Comentários do Código:**
> Cria uma tabela nova (se caso não exista numa tabela com esse nome).

```sql
id INT AUTO_INCREMENT PRIMARY KEY,

```

> **Comentários do Código:**
> Adiciona uma variável (tipo INT) para chamar os Ids, o "AUTO_INCREMENT" serve para já adicionar um Id novo para cada usuário novo que estiver sendo criado, facilitando a busca pelo Id. A chave primária, basicamente ajuda a identificar de forma única cada linha de tabela, para auxiliar a ligar esse (no caso o Id) a outras chaves estrangeiras.

```sql
nome VARCHAR(100) NOT NULL,

```

> **Comentários do Código:**
> Cria uma variável tipo "String" (no caso VARCHAR) com no máximo 100 caractéres, que não pode ficar vazia.

```sql
curso VARCHAR(100) NOT NULL
);

INSERT INTO alunos (nome, curso) VALUES
('Miguel', 'Música'),
('Cris', 'Coral'),
('Belinha', 'Pet');

```

> **Comentários do Código:**
> Já adiciona de forma "Manual" algumas informações para a tabela.

```sql
SHOW TABLES;

```

> **Comentários do Código:**
> Mostra todas as tabelas.

```sql
SELECT * FROM alunos;

```

> **Comentários do Código:**
> Mostra todas informações das tabelas.

---

## 3. Servidor e Rotas da API (`server.js`)

### 3.1. Importações e Configurações Iniciais

```javascript
const express = require("express"); 

```

> **Comentários do Código:**
> Estamos "pedindo" as ferramentas do express, que são necessárias para a API.

```javascript
const cors = require("cors"); 

```

> **Comentários do Código:**
> Mesma coisa que o express, "pedimos" as ferramentas do cors, mas o cors diferente da função do express, nos ajuda a ligar o front-end com o back-end.
> Para exemplificar, o express é um framework, ou seja, ele é um meio utilizado para simplificar os códigos que permitem que uma API funcione. São um meio mais fácil que ajudam a fazer o trabalho de T.I.
> O cors por outro lado, serve como um meio de fazer com que o frond-end converse com uma API, mesmo com uma porta diferente. Ou seja, se um endereço é: 127.0.0.1:5500, e o outro localhost:3000, o cors, mesmo que sejam endereços diferentes, pode fazer o frond-end mesmo assim se comunicar com a API.

```javascript
const conexao = require("./db.js"); 

```

> **Comentários do Código:**
> Seria quase que um pleonasmo ter que explicar esse código: ele pede para utilizar o banco de dados, apenas. Banco de dados este, que está no "db.js".

```javascript
const app = express(); 

```

> **Comentários do Código:**
> É uma constante que ajuda a chamar as "ferramentas" do express, sempre que chamarmos app, ela é a oficina toda de ferramentas já pronta.

```javascript
app.use(cors()); 

```

> **Comentários do Código:**
> Chama a ferramenta cors para ser utilizada, apenas. Agora o front-end conversa com a API.

```javascript
app.use(express.json()); 

```

> **Comentários do Código:**
> O json é um tipo de formato de texto fácil, que serve para basicamente para armazenar e transferir dados entre sistemas.

```javascript
let ALUNOS = [ 
    {id: 1, nome: "Miguel", curso: "Música"},
    {id: 2, nome: "Cris", curso: "Coral"},
    {id: 3, nome: "Belinha", curso: "Pet"}
]; 

```

> **Comentários do Código:**
> Aqui apenas criamos variás pessoas com seus cursos, mais futuramente podendo colocar isso no banco de dados e API.

---

### 3.2. Rotas e Endpoints

#### Rota Principal (`/`)

```javascript
app.get("/",(req, res)=>{
    res.json({
        mensagem: "API funcionando!"
    })
}); 

```

> **Comentários do Código:**
> O req, vem de requisição, é basicamente o usuário pedindo algo, e o res, seria a resposta que vamos dar se determinada requisição for feita
> Esse código é muito mais simples do que parece, ele basicamente diz: se colocar uma "/" do lado do endereço (exemplo: http//localhost:3000/), então, execute (res) uma mensagem dizendo que tá funcionando.

---

#### Listar Todos os Alunos (`GET /alunos`)

```javascript
app.get("/alunos", async (req, res) =>{
try {
    const [resultado] = await conexao.query("SELECT * FROM alunos");
    res.status(200).json(resultado)
} catch (error) {
    res.status(500).json({
        mensagem: "Erro ao encontrar alunos"
    })
};
}); 

```

> **Comentários do Código:**
> Nesta linha, existem várias informações diferentes, mas que juntas se complementam de forma simples. Primeiro, seria melhor diferenciar o conceito de async e await. O await, diz praticamente para o sistema deixar funcionando outras informações enquanto o sistema procura pelas requisições dos usuários. Ou seja, enquanto o sistema tá procurando os alunos (conforme o exemplo da atividade), ele ainda funciona ao mesmo tempo pra deixar o front-end ligado (por exemplo...). Já o async, é a forma de avisar pro sistema que iremos usar o await, como se fosse um aviso e uma forma de chamar o await, só isso.
> O "conexao" conforme dito anteriormente, tem todas as informações da tabela "alunos" do banco de dados. o comando ".query", faz com que uma consulta ao banco de dados seja efetuada. O comando "SELECT * FROM alunos" serve para dizer que a consulta deve ser feita de todos alunos.
> res.status(200).json(resultado) diz apenas que a resposta para a requisição (req) (que foi a consulta de alunos), der certo (try), isto é, se conseguido achar os alunos, então, mostre uma mensagem de status 200 (status 200 significa que está tudo certo). E o ".json", apenas diz para as informações (no caso os alunos) aparecerem em formato json, só isso, apenas enviar as informações nesse formato.
> No caso de erro (ou seja catch), o status 500 significa que houve algum problema relacionado a consulta de alunos na tabela. Colocamos uma mensagem também para dizer que houve algum erro.

---

#### Buscar Aluno por ID (`GET /alunos/:id`)

```javascript
app.get("/alunos/:id", async (req, res) => {
    const id = Number(req.params.id)

try {
    const[resultado] = await conexao.query("SELECT * FROM alunos WHERE id = ?;", [id]);

    if (resultado.length === 0){
        return res.status(404).json({
            mensagem: "Aluno não encontrado!"
        })
    }

    res.status(200).json(resultado[0]) 

} catch (error) {
    console.log(error);
    res.status(500).json({
        mensagem: "Erro ao achar aluno"
    }) 
}
})

```

> **Comentários do Código:**
> *Sobre `const id = Number(req.params.id)`:*
> Essa linha, diz algo muito simples. Se acessarmos o campo "/:id", uma constante é criada, que, pega o id que foi escrito no http, e transforma em um parâmetro tipo Number. Parâmetros, são todos os dados que são enviados para o sistema. Nós colocamos "Number" do lado, porque queremos transformar essa informação em uma variável tipo número. e o "req" junto com o "id", significam que nós queremos pegar os dados da requisição (usuário pediu), mas especificamente o id.
> *Sobre `await conexao.query(...)`:*
> Essa linha diz basicamente que é pra tentar pegar o id de alunos, cujo id é "?", esse "?"" significa que é um espaço vazio por enquanto, nós o preenchemos esse espaço digitando [id] logo após, ou seja, é pra pegar o id que o usuário digitou anteriormente.
> *Sobre `if (resultado.length === 0)`:*
> Esse "if", serve para casos de erros de digitação: se o usuário digitar algum id errado, então, returna erro 404 (que significa exatamente não encontrado) e mais a mensagem no json.
> *Sobre `res.status(200).json(resultado[0])`:*
> Volta a informação se achada.
> *Sobre `catch (error)`:*
> Já explicamos essa linha anteriormente.

---

#### Cadastrar Aluno (`POST /alunos/cadastrar`)

```javascript
app.post("/alunos/cadastrar", async(req, res) => {
    const {nome, curso} = req.body;

    if(!nome || !curso){
        return res.status(400).json({
            mensagem: "Nome e curso precisam ser preenchidos."
        })
    }
    try {
        const[resultado] = await conexao.query("INSERT INTO alunos (nome, curso) VALUES (?, ?);", [nome, curso]);
        res.status(201).json({
            mensagem: "Aluno cadastrado com sucesso!",
            id: resultado.insertId
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar aluno!"
        });
    }
});

```

> **Comentários do Código:**
> A mensagem 201 significa que uma nova informação foi criada, o "INSERT INTO" tenta colocar o nome e curso criados no body (lá no ThunderClient) dentro do banco de dados. O insertId serve para colocar um Id imediatamente no usuário que foi criado, automaticamente, como se fosse o auto increment lá do banco de dados.

---

#### Atualizar Aluno (`PUT /alunos/:id`)

```javascript
app.put("/alunos/:id", async (req, res) =>{
    const id = Number(req.params.id);
    const {nome, curso} = req.body;

    if(!nome || !curso){
        return res.status(400).json({
            mensagem: "Nome e curso obrigatórios!"
        })
    }
    try {
        const[resultado] = await conexao.query("UPDATE alunos SET nome = ?, curso = ? WHERE id = ?;", [nome, curso, id]);

        if(resultado.affectedRows === 0){
            return res.status(404).json({
                mensagem: "Id de aluno não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Aluno atualizado com sucesso!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        mensagem: "Erro ao atualizar aluno!"
        });
    }
});

```

> **Comentários do Código:**
> O affectedRows, pergunta pro banco de dados, se o Id que o usuário está querendo modificar existe na tabela. Se caso existir, o affectedRows será maior que 0, ou seja, o if não acontecerá. Agora, caso o Id não exista na tabela, então, o affectedRows será igual a 0, assim aparecendo a mensagem acima.

---

#### Deletar Aluno (`DELETE /alunos/:id`)

```javascript
app.delete("/alunos/:id", async(req, res) =>{
    const id = Number(req.params.id)
    
    try {
        const[resultado] = await conexao.query("DELETE FROM alunos WHERE ID = ?;", [id]);

        if(resultado.affectedRows === 0){
            res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Aluno deletado com sucesso!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensagem:"Erro ao deletar aluno"
        });
    }
})

```

> **Comentários do Código:**
> Diria que essa linha é auto explicativa, ela faz o comando de apagar do banco de dados as informações.

---

### 3.3. Inicialização do Servidor

```javascript
const PORTA = 3000; 

```

> **Comentários do Código:**
> Define exatamente aonde vai ficar hospedado nosso servidor.

```javascript
app.listen(PORTA, () =>{ 
    console.log("Servidor iniciado com sucesso!");
    console.log(`http://localhost:${PORTA}`);
});

```

> **Comentários do Código:**
> Esse código basicamente liga o servidor.

```

```
