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

// O .env, é uma forma de deixar o código mais seguro, afinal, ele cria uma variável com sua senha, nome da sua database, usuário, sua host e porta, e "esconde ela" de possíveis bots no próprio github, que poderiam eventualmente roubar sua senha. Ela é extremamente importante, provavelmente a informação mais útil relacionada a repositórios e banco de dados.