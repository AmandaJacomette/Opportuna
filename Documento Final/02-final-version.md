# **CSI606-2024-02 - Trabalho Final - Resultados**

## *Discente: Amanda Jacomettte Dias Barbosa*

### Resumo

O sistema proposto consiste em um site para divulgação, controle e candidatura a vagas de emprego. Nele, há duas possibilidades de perfil: Empresa e Candidato.

- O perfil **Empresa** pode ter funcionários que cadastram vagas, gerenciam suas etapas, acompanham inscrições e movimentam candidatos entre etapas.
- O perfil **Candidato** busca vagas, se candidata, acompanha suas inscrições e verifica o status de cada etapa.

### 1. Funcionalidades implementadas

#### Para Empresas
- Cadastro e login de empresas.
- Criação e exclusão de vagas.
- Visualização de candidatos inscritos em cada vaga.
- Atualização da etapa de candidatura (ex.: "Entrevista com RH", "Aprovado").
- Upload de imagens e documentos relacionados às vagas.

#### Para Candidatos
- Cadastro e login de candidatos.
- Visualização de vagas disponíveis.
- Candidatura a vagas.
- Acompanhamento do status de suas candidaturas.
- Upload de currículo (PDF) e foto de perfil.
- Edição de informações de perfil.

### 2. Funcionalidades previstas e não implementadas

#### Para Empresas
- Edição de vagas.

*(Justificativa: Por restrições de tempo, essa funcionalidade não foi desenvolvida, mas poderá ser incluída em futuras versões.)*

### 3. Outras funcionalidades implementadas

- Upload e armazenamento de arquivos em nuvem.
- Hash de senhas com bcrypt para maior segurança.

### 4. Arquitetura do Projeto

#### Backend
- **Framework**: Flask.
- **Banco de Dados**: PostgreSQL.
- **Serviços Externos**:
  - *Cloudinary*: Upload e armazenamento de arquivos (imagens e PDFs).
- **Segurança**:
  - Hash de senhas com bcrypt.
  - Uso de variáveis de ambiente para proteger credenciais sensíveis.
- **APIs REST**:
  - Rotas organizadas para atender às necessidades de empresas e candidatos.
  - Respostas padronizadas com mensagens de sucesso ou erro.

#### Frontend
- **Framework**: React ou Next.js.
- **Componentização**:
  - Componentes reutilizáveis para listas de vagas, candidatos e formulários.
- **Estilização**:
  - Uso de CSS modular para manter o estilo consistente e organizado.
- **Interatividade**:
  - Botões para ações como "Editar", "Excluir", "Salvar" e "Candidatar-se".
  - Inputs dinâmicos para edição de informações.
- **Integração**:
  - Comunicação entre frontend e backend via APIs REST.
  - Upload de arquivos diretamente para o Cloudinary, com links públicos retornados para o frontend.

### 5. Instruções para instalação e execução

#### 1. Pré-requisitos
Certifique-se de que os seguintes softwares estejam instalados:
- Python 3.8+
- Node.js 16+ (para o frontend)
- PostgreSQL (para o banco de dados)
- Git (para clonar o repositório)
- Gerenciador de pacotes Python: pip
- Gerenciador de pacotes Node.js: npm ou yarn

#### 2. Clonar o Repositório
Clone o repositório do projeto para seu computador:
```bash
 git clone https://github.com/seu-usuario/seu-repositorio.git
 cd seu-repositorio
```

#### 3. Configuração do Backend

##### 3.1. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na pasta do backend e adicione:
```env
DB_HOST=localhost
DB_NAME=opportuna
DB_USER=seu_usuario
DB_PASS=sua_senha

CLOUD_NAME=seu_cloudinary_nome
API_KEY=seu_cloudinary_api_key
API_SECRET=seu_cloudinary_api_secret
```

##### 3.2. Instalar Dependências
```bash
 cd backend/app
 pip install -r requirements.txt
```

##### 3.3. Executar o Backend
```bash
 python server.py
```
O backend estará disponível em: [http://localhost:5000](http://localhost:5000).

#### 4. Configuração do Frontend

##### 4.1. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na pasta do frontend e adicione:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

##### 4.2. Instalar Dependências
```bash
 cd frontend/opportuna
 npm install
 # ou, se estiver usando yarn:
 yarn install
```

##### 4.3. Executar o Frontend
```bash
 npm run dev
 # ou, se estiver usando yarn:
 yarn dev
```
O frontend estará disponível em: [http://localhost:3000](http://localhost:3000).

#### 5. Testar a Aplicação
1. Acesse o frontend em [http://localhost:3000](http://localhost:3000).
2. Realize o cadastro de um candidato ou empresa.
3. Teste funcionalidades como criação de vagas, candidatura e upload de arquivos.

### 6. Estrutura do Projeto

**Backend**
- **Local**: `app`
- **Linguagem**: Python (Flask)
- **Porta padrão**: `5000`

**Frontend**
- **Local**: `opportuna`
- **Linguagem**: JavaScript/TypeScript (provavelmente Next.js ou React)
- **Porta padrão**: `3000`

### 7. Comandos Úteis

#### Backend
- **Instalar dependências:**
```bash
 pip install -r requirements.txt
```
- **Executar o servidor:**
```bash
 python server.py
```

#### Frontend
- **Instalar dependências:**
```bash
 npm install
```
- **Executar o servidor de desenvolvimento:**
```bash
 npm run dev
```
- **Construir para produção:**
```bash
 npm run build
```

---

Este documento apresenta um resumo do trabalho desenvolvido, funcionalidades implementadas e instruções detalhadas para instalação e execução do sistema.

