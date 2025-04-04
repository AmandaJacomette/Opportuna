'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import styles from './candidatos.module.css';
import logoSrc from '../../../public/Images/Logos/LogoSemFundo.png';
import { useAuth } from '../../context/AuthContext';
import axios from "axios";
import { useRouter } from 'next/navigation';

interface Candidato {
  id_candidato: number;
  nome_candidato: string;
  formacao_candidato: string;
  cargo_candidato: string;
  procura_candidato: string;
  curriculo_candidato: string;
  etapa: string;
}

interface CandidatoListComponentProps {
  candidatos: Candidato[];
  headerItems?: HeaderItem[];
}
interface HeaderItem {
    type: 'link' | 'button' | 'text';
    label: string;
    href?: string;
  }

const CandidatoListComponent: React.FC<CandidatoListComponentProps> = ({ candidatos, headerItems = [] }) => {
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const { user, logout } = useAuth() as { user: { id_candidato?: number; id_empresa?: number }; logout: () => void };
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEtapa, setEditedEtapa] = useState<string | null>(null);

  const handleSave = async (candidatoId: number) => {
    try {
      const response = await axios.post("http://localhost:5000/api/editarEtapaCandidatura", {
        id_candidato: candidatoId,
        etapa: editedEtapa,
      });
  
      if (!response.data.error) {
        setMessage({ type: "success", text: "Etapa atualizada com sucesso!" });
        setTimeout(() => setMessage(null), 3000);
  
        // Atualiza o candidato selecionado com a nova etapa
        setSelectedCandidato((prev) =>
          prev ? { ...prev, etapa: editedEtapa ?? prev.etapa } : null
        );
  
        setIsEditing(false); // Sai do modo de edição
      } else {
        setMessage({ type: "error", text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Erro ao atualizar etapa:", error);
      setMessage({ type: "error", text: "Erro ao conectar com o servidor." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (candidatoId: number) => {
    try {
      const response = await axios.post("http://localhost:5000/api/excluirCandidatura", {
        id_candidato: candidatoId,
      });
  
      if (!response.data.error) {
        setMessage({ type: "success", text: "Candidatura excluída com sucesso!" });
        setTimeout(() => setMessage(null), 3000);
  
        // Remove o candidato excluído da lista
        setSelectedCandidato(null);
        const updatedCandidatos = candidatos.filter((candidato: { id_candidato: number; }) => candidato.id_candidato !== candidatoId);
        // Atualiza o estado com os candidatos restantes
        setSelectedCandidato(updatedCandidatos.length > 0 ? updatedCandidatos[0] : null);
      } else {
        setMessage({ type: "error", text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Erro ao excluir candidatura:", error);
      setMessage({ type: "error", text: "Erro ao conectar com o servidor." });
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
            {candidatos.map((candidato, index) => (
              <div
                key={index}
                className={`${styles.vagaItem} ${selectedCandidato === candidato ? styles.selected : ''}`}
                onClick={() => setSelectedCandidato(candidato)}
              >
                <h3>{candidato.nome_candidato}</h3>
                <p>{candidato.cargo_candidato}</p>
              </div>
            ))}
          </div>

          <div className={styles.vagaDetail}>
            {selectedCandidato && (
              <div className={styles.detailCard}>
                <h2>{selectedCandidato.nome_candidato}</h2>
                <p><strong>Formação:</strong> {selectedCandidato.formacao_candidato}</p>
                <p><strong>Cargo:</strong> {selectedCandidato.cargo_candidato}</p>
                <p><strong>O que está procurando:</strong> {selectedCandidato.procura_candidato}</p>
                <p><strong>Currículo:</strong> <a href={selectedCandidato.curriculo_candidato} target="_blank">Ver Currículo</a></p>
                <p>
                  <strong>Etapa:</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEtapa ?? selectedCandidato.etapa}
                      onChange={(e) => setEditedEtapa(e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    selectedCandidato.etapa
                  )}
                </p>

                <div className={styles.buttonGroup}>
                  <Button className={styles.deleteButton} onClick={() => handleDelete(selectedCandidato.id_candidato)}>Excluir</Button>
                  {isEditing ? (
                    <Button
                      className={styles.editButton}
                      onClick={() => handleSave(selectedCandidato.id_candidato)}
                    >
                      Salvar
                    </Button>
                  ) : (
                    <Button
                      className={styles.editButton}
                      onClick={() => {
                        setIsEditing(true);
                        setEditedEtapa(selectedCandidato.etapa);
                      }}
                    >
                      Editar
                    </Button>
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

export default CandidatoListComponent;


