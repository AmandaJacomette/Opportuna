'use client';

import InitScreenComponent from "@/components/initScreen/initScreen";
import { useSearchParams } from 'next/navigation';
import { use } from "react";


export default function Home() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') || 'candidato';

  return (
    <InitScreenComponent
    
      button1Text={userType === 'empresa' ? 'Publicar Vaga' : 'Atualizar Perfil'}
      button2Text={userType === 'empresa' ? 'Gerenciar Vagas' : 'Candidatar à Vagas'}
      button1Link={userType === 'empresa' ? '/publicar-vaga' : '/perfil'}
      button2Link={userType === 'empresa' ? '/minhas-vagas' : '/vagas'}
      headerItems={[
        { type: 'link' as const, label: 'Vagas', href: '/vagas' },
        ...(userType === 'empresa'
            ? [{ type: 'link' as const, label: 'Minhas Vagas', href: '/minhas-vagas' }]
            : [{ type: 'link' as const, label: 'Candidaturas', href: '/candidaturas' }]),
        ...(userType === 'candidato'
            ? [{ type: 'link' as const, label: 'Perfil', href: '/perfil' }]
            : []),
        { type: 'button' as const, label: 'LogOff', href: '/' }
      ]}
    />
  );
}
