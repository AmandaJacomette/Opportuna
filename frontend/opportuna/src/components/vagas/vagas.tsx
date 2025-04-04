'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import styles from './vagas.module.css';
import logoSrc from '../../../public/Images/Logos/LogoSemFundo.png';
import { useAuth } from '../../context/AuthContext';
import axios from "axios";
import { useRouter } from 'next/navigation';

interface Vaga {
  id_vaga: number;
  nome_vaga: string;
  salario_vaga: string;
  empresa: string;
  tipo_vaga: string;
  descricao_vaga: string;
  requisitos_vaga: string[];
  nome_empresa: string;
}

interface HeaderItem {
    type: 'link' | 'button' | 'text';
    label: string;
    href?: string;
  }

interface VagaListComponentProps {
  vagas: Vaga[];
  isEmpresa: boolean;
  headerItems?: HeaderItem[];
}

const VagaListComponent: React.FC<VagaListComponentProps> = ({ vagas, isEmpresa, headerItems = [] }) => {
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const { user, logout } = useAuth() as { user: { id_candidato?: number; id_empresa?: number }; logout: () => void };
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const handleCandidatura = async (candidatoId: number, vagaId: number) => {
    try {
      const response = await axios.post("http://localhost:5000/api/candidatarVaga", {
        candidato: candidatoId,
        vaga: vagaId,
      });
  
      if (!response.data.error) {
        setMessage({ type: 'success', text: 'Candidatura feita com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Erro ao se candidatar:", error);
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (vagaId: number) => {
    const endpoint = `http://localhost:5000/api/excluirVaga`;
  
    try {
      const response = await axios.post(endpoint, { id_vaga: vagaId });
  
      if (response.data.error) {
        setMessage({ type: 'error', text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'success', text: 'Vaga excluída com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
  
        // Atualiza a página para refletir as mudanças
        setTimeout(() => router.push('/vagas'), 2000);
        //setVagas((prevVagas) => prevVagas.filter((vaga: { id_vaga: number; }) => vaga.id_vaga !== vagaId));
        //router.refresh();
      }
    } catch (error) {
      console.error("Erro ao excluir vaga:", error);
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEnter = async (vagaId: number) => {
    try {
      const response = await axios.post("http://localhost:5000/api/buscarCandidatosVaga", {
        vaga: vagaId,
      });
  
      if (response.data && response.data.data) {
        const candidatos = response.data.data;
        console.log(candidatos);
        // Redireciona para a página /candidatos com os dados dos candidatos
        router.push(`/candidatos?candidatos=${encodeURIComponent(JSON.stringify(candidatos))}`);
      } else {
        setMessage({ type: 'error', text: 'Nenhum candidato encontrado para esta vaga.' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Erro ao buscar candidatos:", error);
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image src={logoSrc} alt="Logo" width={50} height={50} className="rounded-full" />
          </div>
          <div className={styles.navLinks}>
          {headerItems?.map((item, index) => (
              <div key={index}>
                {item.type === 'link' && (
                  <a href={item.href} className={styles.link}>{item.label}</a>
                )}
                {item.type === 'button' && (
                  <a href={item.href}>
                    <Button className={styles.buttonLogOff} onClick={() => logout()}>{item.label}</Button>
                  </a>
                )}
                {item.type === 'text' && <span className={styles.text}>{item.label}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.vagaList}>
          {vagas.map((vaga, index) => (
            <div 
              key={index} 
              className={`${styles.vagaItem} ${selectedVaga === vaga ? styles.selected : ''}`}
              onClick={() => setSelectedVaga(vaga)}
            >
              <h3>{vaga.nome_vaga}</h3>
              <p>Salário {vaga.salario_vaga}</p>
            </div>
          ))}
          </div>

          <div className={styles.vagaDetail}>
          {selectedVaga && (
            <div className={styles.detailCard}>
              <h2>{selectedVaga.nome_vaga}</h2>
              <p><strong>Empresa:</strong> {selectedVaga.nome_empresa}</p>
              <p><strong>Salário:</strong> {selectedVaga.salario_vaga}</p>
              <p><strong>Modelo:</strong> {selectedVaga.tipo_vaga}</p>
              <p><strong>Descrição:</strong> {selectedVaga.descricao_vaga}</p>
              <p><strong>Requisitos:</strong></p>
              <ul>
                {selectedVaga.requisitos_vaga.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
              
              <div className={styles.buttonGroup}>
                {isEmpresa ? (
                  <>
                    <Button className={styles.deleteButton} onClick={() => handleDelete(selectedVaga.id_vaga)}>Excluir</Button>
                    <Button className={styles.enterButton} onClick={() => handleEnter(selectedVaga.id_vaga)}>Entrar</Button>
                  </>
                ) : (
                  <Button className={styles.candidateButton} onClick={() => user.id_candidato && handleCandidatura(user.id_candidato, selectedVaga.id_vaga)}>Candidatar</Button>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
      {message && (
        <div className={`${styles.popup} ${message.type === 'success' ? styles.success : styles.error}`}>{message.text}</div>
      )}
    </div>
  );
};

export default VagaListComponent;


