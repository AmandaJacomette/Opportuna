'use client';

import Image from 'next/image';
import { Button } from '../../components/ui/button';
import styles from './login.module.css';
import imageLogoSimples from '../../../public/Images/Logos/LogoNomeSemFundo.png';
import { useState } from 'react';

const OpportunaComponent = () => {
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

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
    </div>
  );
};

export default OpportunaComponent;
