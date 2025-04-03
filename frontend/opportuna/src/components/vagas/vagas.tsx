'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import styles from './vagas.module.css';
import logoSrc from '../../../public/Images/Logos/LogoSemFundo.png';
import { useAuth } from '../../context/AuthContext';

interface Vaga {
  nome: string;
  salario: string;
  empresa: string;
  modelo: string;
  descricao: string;
  requisitos: string[];
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
  const { logout } = useAuth();

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
              <h3>{vaga.nome}</h3>
              <p>Salário {vaga.salario}</p>
            </div>
          ))}
          </div>

          <div className={styles.vagaDetail}>
          {selectedVaga && (
            <div className={styles.detailCard}>
              <h2>{selectedVaga.nome}</h2>
              <p><strong>Empresa:</strong> {selectedVaga.empresa}</p>
              <p><strong>Salário:</strong> {selectedVaga.salario}</p>
              <p><strong>Modelo:</strong> {selectedVaga.modelo}</p>
              <p><strong>Descrição:</strong> {selectedVaga.descricao}</p>
              <p><strong>Requisitos:</strong></p>
              <ul>
                {selectedVaga.requisitos.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
              
              <div className={styles.buttonGroup}>
                {isEmpresa ? (
                  <>
                    <Button className={styles.deleteButton}>Excluir</Button>
                    <Button className={styles.editButton}>Editar</Button>
                    <Button className={styles.enterButton}>Entrar</Button>
                  </>
                ) : (
                  <Button className={styles.candidateButton}>Candidatar</Button>
                )}
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
