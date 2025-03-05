from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import pandas as pd
import psycopg2
from datetime import datetime
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            try:
                cls._instance = super(DatabaseConnection, cls).__new__(cls)
                cls._instance.connection = psycopg2.connect(
                    host='localhost',
                    database='OpportunaBD',
                    user='postgres',
                    password='147258'
                )
                print("Conexão ao banco de dados estabelecida.")
            except Exception as e:
                print(f"Erro ao conectar ao banco de dados: {e}")
                cls._instance = None
        return cls._instance

    def get_connection(self):
        return self.connection

class QueryFactory:
    
    @staticmethod
    def select_query(table, columns='*', where_clause=None, order_by=None):
        query = f"SELECT {columns} FROM {table}"
        if where_clause:
            query += f" WHERE {where_clause}"
        if order_by:
            query += f" ORDER BY {order_by}"
        return query

    @staticmethod
    def insert_query(table, columns, values):
        columns_str = ', '.join(columns)
        values_str = ', '.join([f"'{v}'" for v in values])
        return f"INSERT INTO {table} ({columns_str}) VALUES ({values_str})"

    @staticmethod
    def update_query(table, updates, where_clause=None):
        updates_str = ', '.join([f"{col} = '{val}'" for col, val in updates.items()])
        query = f"UPDATE {table} SET {updates_str}"
        if where_clause:
            query += f" WHERE {where_clause}"
        return query

    @staticmethod
    def delete_query(table, where_clause):
        return f"DELETE FROM {table} WHERE {where_clause}"

# Funções auxiliares para manipulação do banco de dados
def consultar_db(query):
    try:
        con = DatabaseConnection().get_connection()
        cur = con.cursor()
        cur.execute(query)
        recset = cur.fetchall()
        cur.close()
        return recset
    except Exception as e:
        print(f"Erro na consulta: {e}")
        con.rollback()  # Rollback da transação em caso de erro
        cur.close()
        return []

def inserir_db(query):
    con = None
    cur = None
    try:
        con = DatabaseConnection().get_connection()
        cur = con.cursor()
        cur.execute(query)
        con.commit()
        return response_format(True, 'Sucesso!')
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Erro ao inserir no banco de dados: {error}")
        if con:
            con.rollback()  # Rollback da transação em caso de erro
        return response_format(True, f"Erro ao inserir no banco de dados: {error}")
    finally:
        if cur:
            cur.close()
        if con:
            con.close()


# Inicializando o Flask
app = Flask(__name__)
CORS(app)

# Configurações do Cloudinary
cloudinary.config(
  cloud_name = "dvks6kvfn", 
  api_key = "949973423629945", 
  api_secret = "uau5kTgXfthklnl1st74MoQzRA4"
)

def upload_image_pdf(img):
    result = cloudinary.uploader.upload(img)
    # O URL da imagem na nuvem será retornado
    image_url = result.get("secure_url")

    return image_url

# Função de retorno padrão para sucesso e erro
def response_format(error, message, data=None):
    return jsonify({
        'error': error,
        'message': message,
        'data': data
    })

##################   ROTAS   ######################

@app.route('/api/cadastroCandidato', methods=['POST'])
def create_candidato():
    try:
        data = request.json
        nome = data['nome']
        email = data['email']
        senha = data['senha']

        query = QueryFactory.select_query(
            'candidato', 
            where_clause=f"email_candidato = '{email}'")
        candidato = consultar_db(query)

        if len(candidato) > 0:
            print("Candidato já cadastrado!")
            return response_format(True, 'Candidato já cadastrado!')
        else:
            query = QueryFactory.insert_query(
                table='candidato',
                columns=['nome_candidato', 'email_candidato', 'senha_candidato'],
                values=[nome, email, senha]
            )
            result = inserir_db(query)
            if result.error == False:
                print("Candidato criada com sucesso!")
                return response_format(False, 'Candidato criado com sucesso!', data)
            else:
                print("Erro ao criar Candidato!")
                return response_format(True, result.message)
        
    except Exception as e:
        print(f'Erro ao criar candidato: {str(e)}')
        return response_format(True, f'Erro ao criar candidato: {str(e)}')

@app.route('/api/cadastroEmpresa', methods=['POST'])
def create_empresa():
    try:
        data = request.json
        nome = data['nome']
        email = data['email']
        cnpj = data['cnpj']
        senha = data['senha']

        query = QueryFactory.select_query(
            'empresa', 
            where_clause=f"cnpj_empresa = '{cnpj}'")
        empresa = consultar_db(query)

        if len(empresa) > 0:
            print("Empresa já cadastrada!")
            return response_format(True, 'Empresa já cadastrada!')
        else:
            query = QueryFactory.insert_query(
                table='empresa',
                columns=['nome_empresa', 'email_empresa', 'senha_empresa', 'cnpj_empresa'],
                values=[nome, email, senha, cnpj]
            )
            result = inserir_db(query)
            if result.error == False:
                print("Empresa criada com sucesso!")
                return response_format(False, 'Empresa criada com sucesso!', data)
            else:
                print("Erro ao criar empresa!")
                return response_format(True, result.message)
    except Exception as e:
        print(f'Erro ao criar empresa: {str(e)}')
        return response_format(True, f'Erro ao criar empresa: {str(e)}')

@app.route('/api/loginCandidato', methods=['POST'])
def send_data_candidato():
    try:
        data = request.json
        login = data['login']
        senha = data['senha']
        
        query = QueryFactory.select_query(
            table='candidato', 
            where_clause=f"email_candidato = '{login}' AND senha_candidato = '{senha}'"
        )
        
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_candidato', 'nome_candidato', 'email_candidato', 'telefone_candidato', 'cargo_candidato', 
                'formacao_candidato', 'procura_candidato', 'imagem_candidato', 'curriculo_candidato'])
            df_dict = df_bd.to_dict(orient='records')[0]  # Pega apenas o primeiro resultado
            print(df_dict)
            return response_format(False, 'Login bem-sucedido', {'data': df_bd})
        else:
            print('Não foi possível encontrar o candidato')
            return response_format(True, 'Não foi possível encontrar o candidato')
    except Exception as e:
        print(f'Erro ao processar login: {str(e)}')
        return response_format(True, f'Erro ao processar login: {str(e)}')
    
@app.route('/api/loginEmpresa', methods=['POST'])
def send_data_empresa():
    try:
        data = request.json
        login = data['login']
        senha = data['senha']
        
        query = QueryFactory.select_query(
            table='empresa', 
            where_clause=f"email_empresa = '{login}' AND senha_empresa = '{senha}'"
        )
        
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_empresa', 'nome_empresa', 'email_empresa', 'cnpj_empresa'])
            df_dict = df_bd.to_dict(orient='records')[0]  # Pega apenas o primeiro resultado
            print(df_dict)
            return response_format(False, 'Login bem-sucedido', {'data': df_bd})
        else:
            return response_format(True, 'Não foi possível encontrar a empresa')
    except Exception as e:
        return response_format(True, f'Erro ao processar login: {str(e)}')

@app.route('/api/editarPerfil', methods=['POST'])
def edit_perfil():
    try:

#        //Ao submeter o formulário de criação de usuário
#  //Tratamento diferente devido ao envio de arquivo para o back 
#  const handleSubmitModal = (event) => { # type: ignore
#    event.preventDefault();

#    const data = new FormData();
#    data.append('nome', formSignIn.nome);
#    data.append('usuario', formSignIn.usuario);
#    data.append('senha', formSignIn.senha);
#    data.append('foto', formSignIn.foto);
##
#    axios.post(URL_API + 'criaUsuario', data, {
#      headers: {
#        'Content-Type': 'multipart/form-data',
#      },
#    })
#    .then(response => {
#      console.log('Resposta do servidor:', response.data);
#      setButtonPopup(false);
#      window.alert("Usuário Criado!");
#      clearForm();
#    })
#    .catch(error => {
#      console.error('Erro ao enviar dados:', error);
#    });
#  };

        img = request.files['foto']
        pdf = request.files['curriculo']
        email = request.form['usuario']
        nome = request.form['nome'] 
        cargo = request.form['cargo']
        telefone = request.form['telefone']
        formacao = request.form['formacao']
        procura = request.form['procura']
        
        updates = {}

        if nome:
            updates['nome_candidato'] = nome
        if email:
            updates['email_candidato'] = email
        if telefone:
            updates['telefone_candidato'] = telefone
        if cargo:
            updates['cargo_candidato'] = cargo
        if formacao:
            updates['formacao_candidato'] = formacao  
        if procura:
            updates['procura_candidato'] = procura    
        if img:
            img_link = upload_image_pdf(img)
            updates['imagem_candidato'] = img_link
        if pdf:
            pdf_link = upload_image_pdf(pdf)
            updates['curriculo_candidato'] = pdf_link    

        update_query = QueryFactory.update_query(
            table='candidato',
            updates=updates,
            where_clause=f"email_candidato = '{email}'"
        )
        
        inserir_db(update_query)
        
        return response_format(False, 'Candidato atualizado com sucesso')
    except Exception as e:
        return response_format(True, f'Erro ao atualizar candidato: {str(e)}')

@app.route('/api/novaVaga', methods=['POST'])
def create_vaga():
    try:
        data = request.json
        nome = data['nome']
        salario = data['salario']
        tipo = data['modelo']
        descricao = data['descricao']
        requisitos = data['requisitos']
        empresa = data['empresa']

        query = QueryFactory.insert_query(
            table='vaga',
            columns=['empresa', 'nome_vaga', 'salario_vaga', 'tipo_vaga', 'descricao_vaga', 'requisitos_vaga'],
            values=[empresa, nome, salario, tipo, descricao, requisitos]
        )
        inserir_db(query)
        return response_format(False, 'Vaga criada com sucesso!', data)
        
    except Exception as e:
        return response_format(True, f'Erro ao criar vaga: {str(e)}')

#buscar todas as vagas
@app.route('/api/buscarVagas', methods=['GET'])
def get_vagas():
    try:
        query = QueryFactory.select_query(
            table='vaga'
        )
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_vaga', 'empresa', 'nome_vaga', 'salario_vaga', 'tipo_vaga', 'descricao_vaga', 'requisitos_vaga'])
            df_dict = df_bd.to_dict(orient='records')
            return response_format(False, 'Vagas encontradas', {'data': df_bd})
        else:
            return response_format(True, 'Não foi possível encontrar as vagas')
    except Exception as e:
        return response_format(True, f'Erro ao buscar vagas: {str(e)}')

#buscar todas as vagas de uma empresa
@app.route('/api/buscarVagasEmpresa', methods=['POST'])
def get_vagas_empresa():
    try:
        data = request.json
        empresa = data['empresa']
        query = QueryFactory.select_query(
            table='vaga',
            where_clause=f"empresa = '{empresa}'"
        )
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_vaga', 'empresa', 'nome_vaga', 'salario_vaga', 'tipo_vaga', 'descricao_vaga', 'requisitos_vaga'])
            df_dict = df_bd.to_dict(orient='records')
            return response_format(False, 'Vagas encontradas', {'data': df_bd})
        else:
            return response_format(True, 'Não foi possível encontrar as vagas')
    except Exception as e:
        return response_format(True, f'Erro ao buscar vagas: {str(e)}')

#buscar todas as vagas de um candidato
@app.route('/api/buscarVagasCandidato', methods=['POST'])
def get_vagas_candidato():
    try:
        data = request.json
        candidato = data['candidato']
        query = QueryFactory.select_query(
            table='candidatura',
            where_clause=f"candidato = '{candidato}'"
        )
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_candidato_vaga', 'candidato', 'vaga', 'status'])
            df_dict = df_bd.to_dict(orient='records')
            return response_format(False, 'Vagas encontradas', {'data': df_bd})
        else:
            return response_format(True, 'Não foi possível encontrar as vagas')
    except Exception as e:
        return response_format(True, f'Erro ao buscar vagas: {str(e)}')

# Rodando a aplicação
if __name__ == '__main__':
    app.run(debug=True)
