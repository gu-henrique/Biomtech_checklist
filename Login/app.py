from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Rota para exibir o formulário de login
@app.route('/')
def login():
    return render_template('login.html')

# Rota para autenticar o usuário
#@app.route('/auth', methods=['GET', 'POST'])
@app.route('/', methods=['POST'])
def auth():
    # Recupera os dados do formulário
    nome = request.form['nome']
    senha = request.form['senha']

    # Conecta ao banco de dados
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()

    # Executa a consulta para buscar o usuário
    cursor.execute("SELECT email, senha FROM usuarios WHERE email = ? AND senha = ?", (nome, senha))
    user = cursor.fetchone()

    # Fecha a conexão com o banco de dados
    conn.close()

    # Verifica se o usuário foi encontrado
    if user is not None:
        return redirect(url_for('home'))
    else:
        return redirect(url_for('login'))

# Rota para exibir a página inicial após o login
@app.route('/home')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run()



