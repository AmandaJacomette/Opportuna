'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Definição do tipo dos dados do usuário
interface CandidatoData {
  userType?: 'Candidato';
  id_candidato: number;
  nome_candidato: string;
  email_candidato: string;
  telefone_candidato?: string | null;
  cargo_candidato?: string | null;
  formacao_candidato?: string | null;
  procura_candidato?: string | null;
  imagem_candidato?: string | File | null;
  curriculo_candidato?: string | File | null;
}

interface EmpresaData {
    userType?: 'Empresa';
    id_empresa: number;
    nome_empresa: string;
    email_empresa: string;
    cnpj_empresa: string;
  }
  
  // Definição do tipo do usuário, que pode ser Candidato ou Empresa
  type UserData = CandidatoData | EmpresaData;

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Carregar o usuário do LocalStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função para login
  const login = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Salva no LocalStorage
  };

  // Função para logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove do LocalStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
