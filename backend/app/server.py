from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import psycopg2
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from psycopg2 import sql
import bcrypt
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

CLOUD_NAME = os.getenv("CLOUD_NAME")
API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

# Função para hash de senha
def hash_senha(senha):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(senha.encode(), salt).decode()

def verificar_senha(senha, hash_senha):
    return bcrypt.checkpw(senha.encode(), hash_senha.encode())

# Função de retorno padrão para sucesso e erro
def response_format(error, message, data=None):
    return jsonify({
        'error': error,
        'message': message,
        'data': data
    })

class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance._connect()
        return cls._instance

    def _connect(self):
        try:
            self.connection = psycopg2.connect(
                host=DB_HOST,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASS
            )
            print("Conexão ao banco de dados estabelecida.")
        except Exception as e:
            print(f"Erro ao conectar ao banco de dados: {e}")
            self.connection = None

    def get_connection(self):
        if self.connection is None or self.connection.closed:
            self._connect()
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
    con = None
    cur = None
    try:
        con = DatabaseConnection().get_connection()
        cur = con.cursor()
        cur.execute(query)
        recset = cur.fetchall()
        return recset
    except Exception as e:
        print(f"Erro na consulta: {e}")
        if con:
            con.rollback()
        return []
    finally:
        if cur:
            cur.close()
        if con and not con.closed:
            con.close()

def inserir_db(query):
    con = None
    cur = None
    try:
        con = DatabaseConnection().get_connection()
        cur = con.cursor()
        cur.execute(query)
        con.commit()
        return response_format(False, 'Sucesso!')
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Erro ao inserir no banco de dados: {error}")
        if con:
            con.rollback()
        return response_format(True, f"Erro ao inserir no banco de dados: {error}")
    finally:
        if cur:
            cur.close()
        if con and not con.closed:
            con.close()

# Inicializando o Flask
app = Flask(__name__)
CORS(app)

# Configurações do Cloudinary
cloudinary.config(
  cloud_name = CLOUD_NAME, 
  api_key = API_KEY, 
  api_secret = API_SECRET
)

def upload_image_pdf(file):
    try:
        # Verifica o tipo de arquivo pelo nome ou conteúdo
        if file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            # Caso seja uma imagem
            result = cloudinary.uploader.upload(file, resource_type="image")
        elif file.filename.lower().endswith('.pdf'):
            # Caso seja um PDF
            result = cloudinary.uploader.upload(file, resource_type="raw")
        else:
            raise Exception("Tipo de arquivo não suportado. Apenas imagens e PDFs são permitidos.")

        print("Resultado do upload:", result)  # Log para depuração
        image_url = result.get("secure_url")
        if not image_url:
            raise Exception("URL segura não encontrada no resultado do upload")
        return image_url
    except Exception as e:
        print(f"Erro ao fazer upload para o Cloudinary: {e}")
        return None


##################   ROTAS   ######################

@app.route('/api/cadastroCandidato', methods=['POST'])
def create_candidato():
    try:
        data = request.json
        nome = data['name']
        email = data['email']
        senha = data['password']

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
            
            inserir_db(query)

            print("Candidato criada com sucesso!")
            return response_format(False, 'Candidato criado com sucesso!', data)
        
    except Exception as e:
        print(f'Erro ao criar candidato: {str(e)}')
        return response_format(True, f'Erro ao criar candidato: {str(e)}')

@app.route('/api/cadastroEmpresa', methods=['POST'])
def create_empresa():
    try:
        data = request.json
        nome = data['name']
        email = data['email']
        cnpj = data['cnpj']
        senha = data['password']

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
            inserir_db(query)
            
            print("Empresa criada com sucesso!")
            return response_format(False, 'Empresa criada com sucesso!', data)
            
    except Exception as e:
        print(f'Erro ao criar empresa: {str(e)}')
        return response_format(True, f'Erro ao criar empresa: {str(e)}')

@app.route('/api/loginCandidato', methods=['POST'])
def send_data_candidato():
    try:
        data = request.json
        login = data['username']
        senha = data['password']
        
        query = QueryFactory.select_query(
            table='candidato',
            columns="id_candidato, nome_candidato, email_candidato, telefone_candidato, cargo_candidato, "
                    "formacao_candidato, procura_candidato, imagem_candidato, curriculo_candidato",
            where_clause=f"email_candidato = '{login}' AND senha_candidato = '{senha}'"
        )
        
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_candidato', 'nome_candidato', 'email_candidato', 'telefone_candidato', 'cargo_candidato', 
                'formacao_candidato', 'procura_candidato', 'imagem_candidato', 'curriculo_candidato'])
            df_dict = df_bd.to_dict(orient='records')[0]  # Pega apenas o primeiro resultado
            df_dict['userType'] = 'Candidato'
            print(df_dict)
            return response_format(False, 'Login bem-sucedido', {'data': df_dict})
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
        login = data['username']
        senha = data['password']
        
        query = QueryFactory.select_query(
            table='empresa', 
            columns="id_empresa, nome_empresa, email_empresa, cnpj_empresa",
            where_clause=f"email_empresa = '{login}' AND senha_empresa = '{senha}'"
        )
        
        reg = consultar_db(query)
        if len(reg) > 0:
            df_bd = pd.DataFrame(
                reg, 
                columns=['id_empresa', 'nome_empresa', 'email_empresa', 'cnpj_empresa'])
            df_dict = df_bd.to_dict(orient='records')[0]  # Pega apenas o primeiro resultado
            df_dict['userType'] = 'Empresa'
            print(df_dict)
            return response_format(False, 'Login bem-sucedido', {'data': df_dict})
        else:
            return response_format(True, 'Não foi possível encontrar a empresa')
    except Exception as e:
        return response_format(True, f'Erro ao processar login: {str(e)}')

@app.route('/api/editarPerfil', methods=['POST'])
def edit_perfil():
    try:
        
        img = request.files['imagem_candidato']
        pdf = request.files['curriculo_candidato']
        email = request.form['email_candidato']
        nome = request.form['nome_candidato'] 
        cargo = request.form['cargo_candidato']
        telefone = request.form['telefone_candidato']
        formacao = request.form['formacao_candidato']
        procura = request.form['procura_candidato']
        
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
        print(update_query)
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
                columns=['id_vaga', 'nome_vaga', 'salario_vaga', 'tipo_vaga', 'descricao_vaga', 'requisitos_vaga', 'empresa'])

            # Processa os requisitos para transformá-los em arrays
            df_bd['requisitos_vaga'] = df_bd['requisitos_vaga'].apply(lambda x: x.split(', ') if isinstance(x, str) else [])

            # Consulta o nome da empresa para cada vaga
            empresa_ids = df_bd['empresa'].unique()  # Obtém IDs únicos de empresas
            empresa_query = QueryFactory.select_query(
                table='empresa',
                columns="id_empresa, nome_empresa",
                where_clause=f"id_empresa IN ({', '.join(map(str, empresa_ids))})"
            )
            empresas = consultar_db(empresa_query)
            
            # Cria um dicionário para mapear IDs de empresas para seus nomes
            empresa_dict = {emp[0]: emp[1] for emp in empresas}
            print(df_bd['empresa'].map(empresa_dict))
            # Adiciona o nome da empresa ao DataFrame
            df_bd['nome_empresa'] = df_bd['empresa'].map(empresa_dict)

            # Converte o DataFrame para um dicionário
            df_dict = df_bd.to_dict(orient='records')
            
            return response_format(False, 'Vagas encontradas', {'data': df_dict})
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

        # Consulta para buscar as vagas relacionadas às candidaturas do candidato
        query = QueryFactory.select_query(
            table='candidatura INNER JOIN vaga ON candidatura.vaga = vaga.id_vaga',
            columns="candidatura.id_candidatura, candidatura.etapa, vaga.id_vaga, vaga.nome_vaga, vaga.salario_vaga, vaga.tipo_vaga, vaga.descricao_vaga, vaga.requisitos_vaga, vaga.empresa",
            where_clause=f"candidatura.candidato = '{candidato}'"
        )
        reg = consultar_db(query)

        if len(reg) > 0:
            # Converte os resultados em um DataFrame
            df_bd = pd.DataFrame(
                reg,
                columns=['id_candidatura', 'etapa', 'id_vaga', 'nome_vaga', 'salario_vaga', 'tipo_vaga', 'descricao_vaga', 'requisitos_vaga', 'empresa']
            )

            # Processa os requisitos para transformá-los em arrays
            df_bd['requisitos_vaga'] = df_bd['requisitos_vaga'].apply(lambda x: x.split(', ') if isinstance(x, str) else [])

            # Consulta o nome da empresa para cada vaga
            empresa_ids = df_bd['empresa'].unique()  # Obtém IDs únicos de empresas
            empresa_query = QueryFactory.select_query(
                table='empresa',
                columns="id_empresa, nome_empresa",
                where_clause=f"id_empresa IN ({', '.join(map(str, empresa_ids))})"
            )
            empresas = consultar_db(empresa_query)

            # Cria um dicionário para mapear IDs de empresas para seus nomes
            empresa_dict = {emp[0]: emp[1] for emp in empresas}

            # Adiciona o nome da empresa ao DataFrame
            df_bd['nome_empresa'] = df_bd['empresa'].map(empresa_dict)

            # Converte o DataFrame para um dicionário
            df_dict = df_bd.to_dict(orient='records')

            return response_format(False, 'Vagas encontradas', {'data': df_dict})
        else:
            return response_format(True, 'Não foi possível encontrar as vagas')
    except Exception as e:
        print(f"Erro ao buscar vagas: {str(e)}")
        return response_format(True, f"Erro ao buscar vagas: {str(e)}")
    
#buscar todas as candidaturas de uma vaga
@app.route('/api/buscarCandidatosVaga', methods=['POST'])
def get_candidatos_vaga():
    try:
        data = request.json
        vaga = data['vaga']
         # Consulta para buscar os candidatos relacionados à vaga
        query = QueryFactory.select_query(
            table='candidatura INNER JOIN candidato ON candidatura.candidato = candidato.id_candidato',
            columns="candidato.id_candidato, candidato.nome_candidato, candidato.formacao_candidato, "
                    "candidato.cargo_candidato, candidato.procura_candidato, candidato.curriculo_candidato, "
                    "candidatura.etapa",
            where_clause=f"candidatura.vaga = '{vaga}'"
        )
        reg = consultar_db(query)

        if len(reg) > 0:
            # Converte os resultados em um DataFrame
            df_bd = pd.DataFrame(
                reg,
                columns=['id_candidato', 'nome_candidato', 'formacao_candidato', 'cargo_candidato',
                         'procura_candidato', 'curriculo_candidato', 'etapa']
            )

            df_dict = df_bd.to_dict(orient='records')
            return response_format(False, 'Candidatos encontrados', {'data': df_dict})
        else:
            return response_format(True, 'Não foi possível encontrar os candidatos')
    except Exception as e:
        return response_format(True, f'Erro ao buscar candidatos: {str(e)}')
    
#atualizar status de candidatura
@app.route('/api/atualizarStatusCandidatura', methods=['POST'])
def update_status_candidatura():
    try:
        data = request.json
        id_candidatura = data['id_candidatura']
        status = data['status']

        query = QueryFactory.update_query(
            table='candidatura',
            updates={'etapa': status},
            where_clause=f"id_candidato_vaga = {id_candidatura}"
        )
        inserir_db(query)
        
        return response_format(False, 'Status atualizado com sucesso')
    except Exception as e:
        return response_format(True, f'Erro ao atualizar status: {str(e)}')

# Candidatar-se a uma vaga
@app.route('/api/candidatarVaga', methods=['POST'])
def candidatar_vaga():

    try:
        data = request.json
        candidato = data['candidato']
        vaga = data['vaga']

        # Verifica se o candidato já se candidatou à vaga
        query_verificar = QueryFactory.select_query(
            table='candidatura',
            where_clause=f"candidato = '{candidato}' AND vaga = '{vaga}'"
        )
        candidatura_existente = consultar_db(query_verificar)
        
        if len(candidatura_existente) > 0:
            return response_format(True, 'Você já se candidatou a esta vaga.')

        query = QueryFactory.insert_query(
            table='candidatura',
            columns=['candidato', 'vaga', 'etapa'],
            values=[candidato, vaga, 'Análise de Curriculo']
        )
        inserir_db(query)
        
        return response_format(False, 'Candidatura realizada com sucesso')
    except Exception as e:
        return response_format(True, f'Erro ao se candidatar: {str(e)}')

#excluir vaga
@app.route('/api/excluirVaga', methods=['POST'])
def delete_vaga():
    try:
        data = request.json
        vaga = data['id_vaga']

        query = QueryFactory.delete_query(
            table='vaga',
            where_clause=f"id_vaga = {vaga}"
        )
        inserir_db(query)
        
        return response_format(False, 'Vaga excluída com sucesso')
    except Exception as e:
        return response_format(True, f'Erro ao excluir vaga: {str(e)}')    

#excluir candidatura
@app.route('/api/excluirCandidatura', methods=['POST'])
def delete_candidatura():
    try:
        data = request.json
        candidatura = data['id_candidato']

        query = QueryFactory.delete_query(
            table='candidatura',
            where_clause=f"candidato = {candidatura}"
        )
        inserir_db(query)
        
        return response_format(False, 'Candidatura excluída com sucesso')
    except Exception as e:
        return response_format(True, f'Erro ao excluir candidatura: {str(e)}')

#editar etapa de candidatura
@app.route('/api/editarEtapaCandidatura', methods=['POST'])
def edit_etapa_candidatura():
    try:
        data = request.json
        candidatura = data['id_candidato']
        etapa = data['etapa']

        query = QueryFactory.update_query(
            table='candidatura',
            updates={'etapa': etapa},
            where_clause=f"candidato = {candidatura}"
        )
        inserir_db(query)
        
        return response_format(False, 'Etapa de candidatura atualizada com sucesso')
    except Exception as e:
        return response_format(True, f'Erro ao atualizar etapa: {str(e)}')


# Rodando a aplicação
if __name__ == '__main__':
    app.run(debug=True)
