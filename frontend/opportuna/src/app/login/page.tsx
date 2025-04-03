'use client';

import Image from 'next/image';
import { Button } from '../../components/ui/button';
import styles from './login.module.css';
import imageLogoSimples from '../../../public/Images/Logos/LogoNomeSemFundo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { format } from 'path';

const OpportunaComponent = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    userType: 'Sou Candidato',
    username: '',
    password: ''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    let endpoint = 'http://localhost:5000';
  
    endpoint += formData.userType === 'Sou Empresa' ? '/api/loginEmpresa' : '/api/loginCandidato';

    try {
      const response = await axios.post(endpoint, formData);
      if (response.data.error) {
        setMessage({ type: 'error', text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const userData = response.data.data; // Pega os dados do usuário da resposta
        login(userData.data); // Salva no contexto e no LocalStorage
        setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
        const user = formData.userType === 'Sou Candidato' ? 'candidato' : 'empresa';
        setTimeout(() => router.push(`/dashboard?type=${user}`), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <Image src={imageLogoSimples} alt="Opportuna" width={300} height={300} />
        <p className={styles.tagline}>Oportunidades que transformam vidas</p>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Login</h2>
          <form onSubmit={handleSubmit}>
            <select
              name="userType"
              className={styles.dropdown}
              value={formData.userType}
              onChange={handleChange}
            >
              <option>Sou Candidato</option>
              <option>Sou Empresa</option>
            </select>
            <input
              type="text"
              name="username"
              placeholder="Usuário"
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
            <Button type="submit" className={styles.loginButton}>Entrar</Button>
          </form>
          <p className={styles.registerText}>Não tem uma conta? <a href="/cadastro" className={styles.registerLink}>Cadastre-se</a></p>
        </div>
      </div>
      {message && (
        <div className={`${styles.popup} ${message.type === 'success' ? styles.success : styles.error}`}>{message.text}</div>
      )}
    </div>
  );
};

export default OpportunaComponent;
