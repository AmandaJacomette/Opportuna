'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import styles from './perfil.module.css';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import imageLogoSimples from '../../../public/Images/Logos/LogoSemFundo.png';
import axios from 'axios';
import router from 'next/router';

interface HeaderItem {
    type: 'link' | 'button' | 'text';
    label: string;
    href?: string;
  }

interface PerfilCandidatoProps {
  logoSrc?: string;
  headerItems?: HeaderItem[];
}

const PerfilCandidato: React.FC<PerfilCandidatoProps> = ({
    logoSrc = imageLogoSimples,
    headerItems = [
      { type: 'link' as const, label: 'Início', href: '/dashboard?type=candidato' },
      { type: 'link' as const, label: 'Vagas', href: '/vagas' },
      { type: 'link' as const, label: 'Candidaturas', href: '/candidaturas' },
      { type: 'link' as const, label: 'Perfil', href: '/perfil' },
      { type: 'button' as const, label: 'LogOff', href: '/' }
    ],
  }) => {
    const { user, login, logout } = useAuth();
    const [formData, setFormData] = useState<{
      userType: 'Candidato';
      id_candidato: number;
      nome_candidato: string;
      email_candidato: string;
      telefone_candidato: string;
      cargo_candidato: string;
      formacao_candidato: string;
      procura_candidato: string;
      imagem_candidato: string | File;
      curriculo_candidato: string | File;
    }>({
      userType: 'Candidato',
      id_candidato: (user && 'id_candidato' in user) ? user.id_candidato : 0,
      nome_candidato: '',
      email_candidato: '',
      telefone_candidato: '',
      cargo_candidato: '',
      formacao_candidato: '',
      procura_candidato: '',
      imagem_candidato: '',
      curriculo_candidato: '',
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
    useEffect(() => {
      if (user && 'id_candidato' in user) {
        setFormData({
          userType: 'Candidato',
          id_candidato: user.id_candidato || 0,
          nome_candidato: user.nome_candidato || '',
          email_candidato: user.email_candidato || '',
          telefone_candidato: user.telefone_candidato || '',
          cargo_candidato: user.cargo_candidato || '',
          formacao_candidato: user.formacao_candidato || '',
          procura_candidato: user.procura_candidato || '',
          imagem_candidato: user.imagem_candidato || '',
          curriculo_candidato: user.curriculo_candidato || '',
        });
      }
    }, [user]);
  
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
      
        let endpoint = 'http://localhost:5000/api/editarPerfil';
        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'curriculo_candidato' && formData.curriculo_candidato instanceof File) {
            formDataToSend.append(key, formData.curriculo_candidato);
            } else if (key === 'imagem_candidato' && typeof formData.imagem_candidato === 'string' && formData.imagem_candidato.startsWith('data:image')) {
            const blob = await fetch(formData.imagem_candidato).then(res => res.blob());
            formDataToSend.append(key, blob, 'imagem_candidato.png');
            } else {
            formDataToSend.append(key, String(formData[key as keyof typeof formData]));
            }
        }
        try {
            const response = await axios.post(endpoint, formDataToSend, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
          if (response.data.error) {
            setMessage({ type: 'error', text: response.data.message });
            setTimeout(() => setMessage(null), 3000);
          } else {
            login(formData); // Atualiza o contexto
            setMessage({ type: 'success', text: 'Perfil Atualizado com sucesso!' });
            setTimeout(() => setMessage(null), 3000);
            setTimeout(() => router.push(`/perfil`), 2000);
          }
        } catch (error) {
          setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
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
      <div className={styles.profileContent}>
        
        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.leftSection}>
        <label htmlFor="nome_candidato" className={styles.label}>Nome</label>
          <input
            type="text"
            id="nome_candidato"
            name="nome_candidato"
            value={formData.nome_candidato}
            onChange={handleChange}
            placeholder="Nome"
            className={styles.input}
          />

          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email_candidato"
            value={formData.email_candidato}
            onChange={handleChange}
            placeholder="Email"
            className={styles.input}
          />

          <label htmlFor="telefone" className={styles.label}>Telefone</label>
          <input
            type="text"
            id="telefone"
            name="telefone_candidato"
            value={formData.telefone_candidato}
            onChange={handleChange}
            placeholder="Telefone"
            className={styles.input}
          />

          <label htmlFor="cargo" className={styles.label}>Cargo</label>
          <input
            type="text"
            id="cargo"
            name="cargo_candidato"
            value={formData.cargo_candidato}
            onChange={handleChange}
            placeholder="Cargo"
            className={styles.input}
          />

          <label htmlFor="formacao" className={styles.label}>Formação</label>
          <input
            type="text"
            id="formacao"
            name="formacao_candidato"
            value={formData.formacao_candidato}
            onChange={handleChange}
            placeholder="Formação"
            className={styles.input}
          />

          <label htmlFor="curriculo" className={styles.label}>Currículo (PDF)</label>
          <input
            type="file"
            id="curriculo"
            name="curriculo_candidato"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFormData({ ...formData, curriculo_candidato: e.target.files[0] });
              }
            }}
            className={styles.input}
          />
        </div>
          
        <div className={styles.rightSection}>
        <div className={styles.fotoSection}>
          <div className={styles.fotoContainer}>
            {formData.imagem_candidato ? (
              typeof formData.imagem_candidato === 'string' ? (
                <Image src={formData.imagem_candidato} alt="Foto do candidato" width={100} height={100} />
              ) : null
            ) : (
              <label className={styles.fotoPlaceholder}>
                Adicionar foto
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const fileReader = new FileReader();
                      fileReader.onload = () => {
                        if (fileReader.result) {
                          setFormData({ ...formData, imagem_candidato: fileReader.result.toString() });
                        }
                      };
                      fileReader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </label>
            )}
          </div>
          <Button className={styles.saveButton} onClick={handleSubmit}>Salvar</Button>
        </div>
        </div>
        
        </form>
      </div>
        </div>
        {message && (
        <div className={`${styles.popup} ${message.type === 'success' ? styles.success : styles.error}`}>{message.text}</div>
      )}
    </div>
  );
};

export default PerfilCandidato;
