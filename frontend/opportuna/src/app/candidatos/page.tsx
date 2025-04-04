'use client';
/* Usage Example */
import CandidatoListComponent from "@/components/candidatos/candidatos";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';


interface Candidato {
  id_candidato: number;
  nome_candidato: string;
  formacao_candidato: string;
  cargo_candidato: string;
  procura_candidato: string;
  curriculo_candidato: string;
  etapa: string;
}

const CandidatosPage = () => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const searchParams = useSearchParams();


  useEffect(() => {
    const candidatosParam = searchParams.get('candidatos');
    if (candidatosParam) {
      const parsedCandidatos = JSON.parse(candidatosParam);
      console.log("candia", parsedCandidatos.data);
      setCandidatos(parsedCandidatos.data);
    }
  }, [searchParams]);

  return (
    <CandidatoListComponent
      candidatos={candidatos} 
      headerItems={[
        { type: 'link' as const, label: 'Início', href: '/dashboard?type=empresa' },
        { type: 'link' as const, label: 'Vagas', href: '/vagas' },
        { type: 'link' as const, label: 'Nova Vaga', href: '/novaVaga' },
        { type: 'button' as const, label: 'LogOff', href: '/' }
      ]}
    />
  );
};

export default CandidatosPage;
