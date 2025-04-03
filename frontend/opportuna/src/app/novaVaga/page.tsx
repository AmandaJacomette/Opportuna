'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import styles from './novaVaga.module.css';
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
      { type: 'link' as const, label: 'Início', href: '/dashboard?type=empresa' },
      { type: 'link' as const, label: 'Vagas', href: '/vagas' },
      { type: 'link' as const, label: 'Novas Vagas', href: '/novaVaga' },
      { type: 'button' as const, label: 'LogOff', href: '/' }
    ],
  }) => {
    const { user, login, logout } = useAuth();
    const [formData, setFormData] = useState({
      nome: '',
      salario: '',
      modelo: '',
      descricao: '',
      requisitos: '',
      empresa: (user && 'id_empresa' in user) ? user.id_empresa : 0,
    });
    
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!user || !("id_empresa" in user)) {
          return; // Evita que o fetch rode com user indefinido
        }
        console.log(user);
        if (user && 'id_empresa' in user) {
          setFormData((prev) => ({ ...prev, empresa: user.id_empresa }));
        }
        console.log(formData);
        let endpoint = 'http://localhost:5000/api/novaVaga';
      
        try {
            const response = await axios.post(endpoint, formData);
          if (response.data.error) {
            setMessage({ type: 'error', text: response.data.message });
            setTimeout(() => setMessage(null), 3000);
          } else {
        
            setMessage({ type: 'success', text: 'Vaga Criada com sucesso!' });
            setTimeout(() => setMessage(null), 3000);
            setTimeout(() => router.push(`/novaVaga`), 2000);
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
          <h1 className={styles.title}>Cadastrar Vaga</h1>
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input
            type="text"
            id="nome"
            name="nome" // Correspondente ao formData.nome
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            className={styles.input}
          />

          <label htmlFor="salario" className={styles.label}>Salário</label>
          <input
            type="text"
            id="salario"
            name="salario" // Correspondente ao formData.salario
            value={formData.salario}
            onChange={handleChange}
            placeholder="Salário"
            className={styles.input}
          />

          <label htmlFor="modelo" className={styles.label}>Modelo</label>
          <input
            type="text"
            id="modelo"
            name="modelo" // Correspondente ao formData.modelo
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Modelo"
            className={styles.input}
          />

          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <input
            id="descricao"
            name="descricao" // Correspondente ao formData.descricao
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição"
            className={styles.input}
          />

          <label htmlFor="requisitos" className={styles.label}>Requisitos</label>
          <input
            id="requisitos"
            name="requisitos" // Correspondente ao formData.requisitos
            value={formData.requisitos}
            onChange={handleChange}
            placeholder="Requisitos"
            className={styles.input}
          />
          <Button className={styles.saveButton} onClick={handleSubmit}>Salvar</Button>
        
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
