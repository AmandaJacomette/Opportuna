'use client';

import { Button } from '../../components/ui/button';
import styles from './cadastro.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CadastroComponent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userType: 'Sou Candidato',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cnpj: '',
    termsAccepted: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
        setMessage({ type: 'error', text: 'Você deve aceitar os termos para continuar' });
        setTimeout(() => setMessage(null), 3000);
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'As senhas não coincidem' });
        setTimeout(() => setMessage(null), 3000);
        return;
    }
    if (formData.userType === 'Sou Empresa' && !validateCNPJ(formData.cnpj)) {
        setMessage({ type: 'error', text: 'CNPJ inválido' });
        setTimeout(() => setMessage(null), 3000);
        return;
    }
    if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
        setTimeout(() => setMessage(null), 3000);
        return;
    }

    if (!formData.name || !formData.email) {
        setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios' });
        setTimeout(() => setMessage(null), 3000);
        return;
    }
    
    let endpoint = 'http://localhost:5000';
  
    endpoint += formData.userType === 'Sou Empresa' ? '/api/cadastroEmpresa' : '/api/cadastroCandidato';

    try {
      const response = await axios.post(endpoint, formData);
      if (response.data.error) {
        setMessage({ type: 'error', text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'success', text: 'Cadastro realizado com sucesso!' });
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.cadastroCard}>
        <h2 className={styles.cadastroTitle}>Cadastro</h2>
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
            name="name"
            placeholder="Nome"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
          />
          {formData.userType === 'Sou Empresa' && (
            <input
              type="text"
              name="cnpj"
              placeholder="CNPJ"
              className={styles.input}
              value={formData.cnpj}
              onChange={handleChange}
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Senha"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar senha"
            className={styles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label>Aceito os Termos de Serviço</label>
          </div>
          <Button type="submit" className={styles.cadastroButton}>Entrar</Button>
        </form>
        <p className={styles.loginText}>Já tem uma conta? <a href="/login" className={styles.loginLink}>Login</a></p>
      </div>
      {message && (
        <div className={`${styles.popup} ${message.type === 'success' ? styles.success : styles.error}`}>{message.text}</div>
      )}
    </div>
  );
};

export default CadastroComponent;
