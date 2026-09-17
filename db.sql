CREATE DATABASE if NOT EXISTS cadastros;

USE cadastros;

CREATE TABLE if NOT EXISTS alunos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
curso VARCHAR(100) NOT NULL
);

INSERT INTO alunos (nome, curso) VALUES
('Miguel', 'Música'),
('Cris', 'Coral'),
('Belinha', 'Pet');

SHOW TABLES;
SELECT * FROM alunos;