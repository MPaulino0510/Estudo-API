const express = require("express"); // Estamos "pedindo" as ferramentas do express, que são necessárias para a API.
const cors = require("cors"); // Mesma coisa que o express, "pedimos" as ferramentas do cors, mas o cors diferente da função do express, nos ajuda a ligar o front-end com o back-end.

// Para exemplificar, o express é um framework, ou seja, ele é um meio utilizado para simplificar os códigos que permitem que uma API funcione. São um meio mais fácil que ajudam a fazer o trabalho de T.I.

// O cors por outro lado, serve como um meio de fazer com que o frond-end converse com uma API, mesmo com uma porta diferente. Ou seja, se um endereço é: 127.0.0.1:5500, e o outro localhost:3000, o cors, mesmo que sejam endereços diferentes, pode fazer o frond-end mesmo assim se comunicar com a API.

const conexao = require("./db.js"); // Seria quase que um pleonasmo ter que explicar esse código: ele pede para utilizar o banco de dados, apenas. Banco de dados este, que está no "db.js". 

const app = express(); // É uma constante que ajuda a chamar as "ferramentas" do express, sempre que chamarmos app, ela é a oficina toda de ferramentas já pronta.

app.use(cors()); // Chama a ferramenta cors para ser utilizada, apenas. Agora o front-end conversa com a API.
app.use(express.json()); // O json é um tipo de formato de texto fácil, que serve para basicamente para armazenar e transferir dados entre sistemas.

let ALUNOS = [ 
    {id: 1, nome: "Miguel", curso: "Música"},
    {id: 2, nome: "Cris", curso: "Coral"},
    {id: 3, nome: "Belinha", curso: "Pet"}
]; // Aqui apenas criamos variás pessoas com seus cursos, mais futuramente podendo colocar isso no banco de dados e API.

app.get("/",(req, res)=>{
    res.json({
        mensagem: "API funcionando!"
    })
}); // O req, vem de requisição, é basicamente o usuário pedindo algo, e o res, seria a resposta que vamos dar se determinada requisição for feita

// Esse código é muito mais simples do que parece, ele basicamente diz: se colocar uma "/" do lado do endereço (exemplo: http//localhost:3000/), então, execute (res) uma mensagem dizendo que tá funcionando. 
app.get("/alunos", async (req, res) =>{
try {
    const [resultado] = await conexao.query("SELECT * FROM alunos");
    res.status(200).json(resultado)
} catch (error) {
    res.status(500).json({
        mensagem: "Erro ao encontrar alunos"
    })
};
}); // Nesta linha, existem várias informações diferentes, mas que juntas se complementam de forma simples. Primeiro, seria melhor diferenciar o conceito de async e await. O await, diz praticamente para o sistema deixar funcionando outras informações enquanto o sistema procura pelas requisições dos usuários. Ou seja, enquanto o sistema tá procurando os alunos (conforme o exemplo da atividade), ele ainda funciona ao mesmo tempo pra deixar o front-end ligado (por exemplo...). Já o async, é a forma de avisar pro sistema que iremos usar o await, como se fosse um aviso e uma forma de chamar o await, só isso.

// O "conexao" conforme dito anteriormente, tem todas as informações da tabela "alunos" do banco de dados. o comando ".query", faz com que uma consulta ao banco de dados seja efetuada. O comando "SELECT * FROM alunos" serve para dizer que a consulta deve ser feita de todos alunos.

// res.status(200).json(resultado) diz apenas que a resposta para a requisição (req) (que foi a consulta de alunos), der certo (try), isto é, se conseguido achar os alunos, então, mostre uma mensagem de status 200 (status 200 significa que está tudo certo). E o ".json", apenas diz para as informações (no caso os alunos) aparecerem em formato json, só isso, apenas enviar as informações nesse formato.

// No caso de erro (ou seja catch), o status 500 significa que houve algum problema relacionado a consulta de alunos na tabela. Colocamos uma mensagem também para dizer que houve algum erro.

app.get("/alunos/:id", async (req, res) => {
    const id = Number(req.params.id)

    // Essa linha, diz algo muito simples. Se acessarmos o campo "/:id", uma constante é criada, que, pega o id que foi escrito no http, e transforma em um parâmetro tipo Number. Parâmetros, são todos os dados que são enviados para o sistema. Nós colocamos "Number" do lado, porque queremos transformar essa informação em uma variável tipo número. e o "req" junto com o "id", significam que nós queremos pegar os dados da requisição (usuário pediu), mas especificamente o id.

try {
    const[resultado] = await conexao.query("SELECT * FROM alunos WHERE id = ?;", [id]);

    // Essa linha diz basicamente que é pra tentar pegar o id de alunos, cujo id é "?", esse "?"" significa que é um espaço vazio por enquanto, nós o preenchemos esse espaço digitando [id] logo após, ou seja, é pra pegar o id que o usuário digitou anteriormente.

    if (resultado.length === 0){
        return res.status(404).json({
            mensagem: "Aluno não encontrado!"
        })
    }

    // Esse "if", serve para casos de erros de digitação: se o usuário digitar algum id errado, então, returna erro 404 (que significa exatamente não encontrado) e mais a mensagem no json.

    res.status(200).json(resultado[0]) // Volta a informação se achada.

} catch (error) {
    console.log(error);
    res.status(500).json({
        mensagem: "Erro ao achar aluno"
    }) // Já explicamos essa linha anteriormente.
}
})

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

            // A mensagem 201 significa que uma nova informação foi criada, o "INSERT INTO" tenta colocar o nome e curso criados no body (lá no ThunderClient) dentro do banco de dados. O insertId serve para colocar um Id imediatamente no usuário que foi criado, automaticamente, como se fosse o auto increment lá do banco de dados.

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar aluno!"
        });
    }
});

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

                // O affectedRows, pergunta pro banco de dados, se o Id que o usuário está querendo modificar existe na tabela. Se caso existir, o affectedRows será maior que 0, ou seja, o if não acontecerá. Agora, caso o Id não exista na tabela, então, o affectedRows será igual a 0, assim aparecendo a mensagem acima.

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

app.delete("/alunos/:id", async(req, res) =>{
    const id = Number(req.params.id)
    
    try {
        const[resultado] = await conexao.query("DELETE FROM alunos WHERE ID = ?;", [id]);

        // Diria que essa linha é auto explicativa, ela faz o comando de apagar do banco de dados as informações.

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

const PORTA = 3000; // Define exatamente aonde vai ficar hospedado nosso servidor.

app.listen(PORTA, () =>{ //= Esse código basicamente liga o servidor.

    console.log("Servidor iniciado com sucesso!");
    console.log(`http://localhost:${PORTA}`);
});
