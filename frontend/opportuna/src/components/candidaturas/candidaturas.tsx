'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import styles from './candidaturas.module.css';
import logoSrc from '../../../public/Images/Logos/LogoSemFundo.png';
import { useAuth } from '../../context/AuthContext';

interface Vaga {
  id_vaga: number;
  nome_vaga: string;
  salario_vaga: string;
  empresa: string;
  tipo_vaga: string;
  descricao_vaga: string;
  requisitos_vaga: string[];
  nome_empresa: string;
  etapa?: string;
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
  const { logout } = useAuth() as { user: { id_candidato?: number; id_empresa?: number }; logout: () => void };

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
                <p className={styles.vagaStage}>
                  {selectedVaga.etapa ? `Etapa: ${selectedVaga.etapa}` : 'Etapa não disponível'}
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VagaListComponent;
