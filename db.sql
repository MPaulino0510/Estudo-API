CREATE DATABASE if NOT EXISTS cadastros; 
-- Cria uma database nova (se caso já não existir uma database com esse nome).

USE cadastros;
-- Usa a database nova criada.

CREATE TABLE if NOT EXISTS alunos (
-- Cria uma tabela nova (se caso não exista numa tabela com esse nome).

id INT AUTO_INCREMENT PRIMARY KEY,
-- Adiciona uma variável (tipo INT) para chamar os Ids, o "AUTO_INCREMENT" serve para já adicionar um Id novo para cada usuário novo que estiver sendo criado, facilitando a busca pelo Id. A chave primária, basicamente ajuda a identificar de forma única cada linha de tabela, para auxiliar a ligar esse (no caso o Id) a outras chaves estrangeiras.

nome VARCHAR(100) NOT NULL,
-- Cria uma variável tipo "String" (no caso VARCHAR) com no máximo 100 caractéres, que não pode ficar vazia.

curso VARCHAR(100) NOT NULL
);

INSERT INTO alunos (nome, curso) VALUES
('Miguel', 'Música'),
('Cris', 'Coral'),
('Belinha', 'Pet');
-- Já adiciona de forma "Manual" algumas informações para a tabela.

SHOW TABLES;
-- Mostra todas as tabelas.

SELECT * FROM alunos;
-- Mostra todas informações das tabelas.