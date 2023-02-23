import sqlite3

# cria uma conexão com o banco de dados
conn = sqlite3.connect('banco.db')

# cria uma tabela chamada "usuarios"
conn.execute('''CREATE TABLE if not exists usuarios
               (id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                senha TEXT NOT NULL)''')

# insere um novo usuário na tabela
conn.execute("INSERT INTO usuarios (nome, email, senha) VALUES ('João', 'joao@exemplo.com', 'senha123')")

conn.commit()

# busca todos os usuários na tabela
cursor = conn.execute("SELECT * FROM usuarios")
for linha in cursor:
    print(linha)
