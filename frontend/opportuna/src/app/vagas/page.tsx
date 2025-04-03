/* Usage Example */
import VagaListComponent from "@/components/vagas/vagas";
import { useAuth } from "@/context/AuthContext";

const JobPage = () => {
  const { user } = useAuth(); // Obtém o usuário do contexto de autenticação
  const userType = user?.userType as string || "Candidato"; // Define o tipo de usuário (padrão: "Candidato")
//fazer usar o user type aqui para definir o que renderizar
  return (
    <VagaListComponent
    vagas={[
        { nome: "Desenvolvedor", salario: "R$5.000", empresa: "Tech Corp", modelo: "Remoto", descricao: "Desenvolvimento web.", requisitos: ["React", "Node.js"] },
        { nome: "Designer", salario: "R$4.000", empresa: "Creative Inc.", modelo: "Híbrido", descricao: "Criação de UI/UX.", requisitos: ["Figma", "Adobe XD"] }
      ]}
      isEmpresa={false} 
      headerItems={[
        { type: 'link' as const, label: 'Vagas', href: '/vagas' },
        { type: 'link' as const, label: 'Minhas Vagas', href: '/minhas-vagas' },
        { type: 'link' as const, label: 'Perfil', href: '/perfil' },
        { type: 'button' as const, label: 'LogOff', href: '/servicos' }
      ]}
    />
  );
};

export default JobPage;
