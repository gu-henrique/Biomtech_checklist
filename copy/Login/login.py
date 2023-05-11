from flask import Flask, request, render_template, url_for, redirect
import psycopg2

app = Flask(__name__)

# Rota para registrar um novo usuário
@app.route('/registrar', methods=['POST'])
def registrar_usuario():

    # Recebe os dados do formulário
    nome = request.form['username']
    email = request.form['email']
    senha = request.form['senha']

    # Cria uma conexão com o banco de dados
    conn = psycopg2.connect(
        dbname="baseLocalGustavo",
        user="postgres",
        password="gustavo.21",
        host="localhost",
        port="5432"
    )

    # Cria um cursor
    cur = conn.cursor()

    # Verifica se o usuário já existe no banco de dados
    select_query = """
    SELECT * FROM usuarios WHERE username = %s
    """
    cur.execute(select_query, (nome,))
    usuario_existente = cur.fetchone()

    if usuario_existente:
        # Se o usuário jáz existe, retorna uma mensagem de erro
        return render_template("login.html")

    else:
        # Se o usuário não existe, insere as informações na tabela
        insert_query = """
        INSERT INTO usuarios (username, email, senha)
        VALUES (%s, %s, %s)
        """
        print(insert_query, (nome, email, senha))
        cur.execute(insert_query, (nome, email, senha))

        # Confirma as alterações no banco de dados
        conn.commit()

        # Fecha o cursor e a conexão com o banco de dados
        cur.close()
        conn.close()

        # Retorna uma mensagem de sucesso para o usuário
        return redirect(url_for('list.html'))

# Rota para fazer login
@app.route('/login', methods=['POST'])
def fazer_login():
    # Recebe os dados do formulário
    nome = request.form['username']
    senha = request.form['senha']

    # Cria uma conexão com o banco de dados
    conn = psycopg2.connect(
        dbname="baseLocalGustavo",
        user="postgres",
        password="gustavo.21",
        host="localhost",
        port="5432"
    )

    # Cria um cursor
    cur = conn.cursor()

    # Verifica se o usuário existe no banco de dados
    select_query = """
    SELECT * FROM usuarios WHERE username = %s AND senha = %s
    """
    cur.execute(select_query, (nome, senha))
    usuario = cur.fetchone()

    if usuario:
        # Se o usuário existe, retorna uma mensagem de sucesso
        return render_template('list.html')

    else:
        # Se o usuário não existe ou a senha está incorreta, retorna uma mensagem de erro
        return render_template("login.html")

@app.route('/',methods = ['GET'])
def iniciar_login():
    return render_template("login.html")

if __name__ == '__main__':
    app.debug = True
    app.run()