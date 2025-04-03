'use client';
/* Usage Example */
import VagaListComponent from "@/components/candidaturas/candidaturas";
import styles from "@/components/candidaturas/candidaturas.module.css";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

const CandidaturasPage = () => {
  const { user } = useAuth(); // Obtém o usuário do contexto de autenticação
  const userType = user?.userType as string || "Candidato"; // Define o tipo de usuário (padrão: "Candidato")
//fazer usar o user type aqui para definir o que renderizar

const [vagas, setVagas] = useState([]); // Estado para armazenar as vagas
const [loading, setLoading] = useState(true); // Estado para indicar carregamento
const [error, setError] = useState<string | null>(null); // Estado para erros

useEffect(() => {
  if (!user || !("id_candidato" in user)) {
    return; // Evita que o fetch rode com user indefinido
  }

  const fetchVagas = async () => {
    try {
      console.log("user", user); // Log para depuração
      console.log("userType", userType); // Log para depuração
      
      const response = await axios.post("http://localhost:5000/api/buscarVagasCandidato", {
        candidato: (user as { id_candidato: number }).id_candidato
      });
      setVagas(response.data.data.data); // Atualiza o estado com as vagas recebidas
      console.log(response.data.data); // Log para depuração
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar vagas:", err);
      setError("Erro ao carregar vagas. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  fetchVagas();
}, [user]);

if (loading) {
  return <div className={styles.loading}>Carregando vagas...</div>;
}

if (error) {
  return <div className="error">{error}</div>;
}

  return (
    <VagaListComponent
    vagas={vagas}
      isEmpresa={false} 
      headerItems={[
        { type: 'link' as const, label: 'Início', href: '/dashboard?type=candidato' },
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

export default CandidaturasPage;
