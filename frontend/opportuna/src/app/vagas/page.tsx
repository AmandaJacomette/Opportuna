'use client';
/* Usage Example */
import VagaListComponent from "@/components/vagas/vagas";
import styles from "@/components/candidaturas/candidaturas.module.css";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

const JobPage = () => {
  const { user } = useAuth(); // Obtém o usuário do contexto de autenticação
  const userType = user?.userType as string || "Candidato"; // Define o tipo de usuário (padrão: "Candidato")
//fazer usar o user type aqui para definir o que renderizar

const [vagas, setVagas] = useState([]); // Estado para armazenar as vagas
const [loading, setLoading] = useState(true); // Estado para indicar carregamento
const [error, setError] = useState<string | null>(null); // Estado para erros

useEffect(() => {
  const fetchVagas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/buscarVagas");
      if (response.data && response.data.data && response.data.data.data.length > 0) {
        setVagas(response.data.data.data); // Atualiza o estado com as vagas recebidas
        console.log("Vagas recebidas:", response.data.data); // Log para depuração
        setLoading(false);
      } else {
        setVagas([]); // Define o estado como um array vazio
        setError("Nenhuma vaga encontrada."); // Define uma mensagem de erro apropriada
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro ao buscar vagas:", err);
      setError("Erro ao carregar vagas. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  fetchVagas();
}, []);

if (loading) {
  return <div className={styles.loading}>Carregando vagas...</div>;
}

if (error) {
  return <div className={styles.error}>{error}</div>;
}

if (vagas.length === 0) {
  return (
    <div className={styles.noVagas}>
      <h2>Nenhuma vaga disponível no momento</h2>
      <p>Por favor, volte mais tarde para verificar novas oportunidades.</p>
    </div>
  );
}

  return (
    <VagaListComponent
      vagas={vagas}
      isEmpresa={userType === 'Empresa'} 
      headerItems={[
        ...(userType === 'Empresa'
          ? [{ type: 'link' as const, label: 'Início', href: '/dashboard?type=empresa' }]
          : [{ type: 'link' as const, label: 'Início', href: '/dashboard?type=candidato' }]),
        { type: 'link' as const, label: 'Vagas', href: '/vagas' },
        ...(userType === 'Empresa'
            ? [{ type: 'link' as const, label: 'Nova Vaga', href: '/novaVaga' }]
            : [{ type: 'link' as const, label: 'Candidaturas', href: '/candidaturas' }]),
        ...(userType === 'Candidato'
            ? [{ type: 'link' as const, label: 'Perfil', href: '/perfil' }]
            : []),
        { type: 'button' as const, label: 'LogOff', href: '/' }
      ]}
    />
  );
};

export default JobPage;
