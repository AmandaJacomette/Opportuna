'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import imagePrin from '../../../public/Images/image.png';
import imageLogoSimples from '../../../public/Images/Logos/LogoSemFundo.png';
import styles from './initScreen.module.css';

// Definição dos tipos possíveis para os itens do header
interface HeaderItem {
  type: 'link' | 'button' | 'text';
  label: string;
  href?: string;
}


// Definição das propriedades esperadas pelo componente
interface InitScreenProps {
  title?: string;
  subtitle?: string;
  description?: string;
  button1Text?: string;
  button2Text?: string;
  button1Link?: string;
  button2Link?: string;
  logoSrc?: string;
  mainImageSrc?: string;
  headerItems?: HeaderItem[];
}

const InitScreenComponent: React.FC<InitScreenProps> = ({
  title = 'Opportuna',
  subtitle = 'Oportunidades que transformam vidas',
  description = 'Venha você também fazer parte desse universo de oportunidades!',
  button1Text = 'Sou Candidato',
  button2Text = 'Sou Empresa',
  button1Link = '#',
  button2Link = '#',
  logoSrc = imageLogoSimples,
  mainImageSrc = imagePrin,
  headerItems = [
    { type: 'link', label: 'Vagas', href: '#' },
    { type: 'link', label: 'Cadastro', href: '#' },
    { type: 'button', label: 'Login', href: '#' }
  ],
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image src={logoSrc} alt="Logo" width={50} height={50} className="rounded-full" />
          </div>
          <div className={styles.navLinks}>
          {headerItems.map((item, index) => (
              <div key={index}>
                {item.type === 'link' && (
                  <a href={item.href} className={styles.link}>{item.label}</a>
                )}
                {item.type === 'button' && (
                  <a href={item.href}>
                    <Button className={styles.button}>{item.label}</Button>
                  </a>
                )}
                {item.type === 'text' && <span className={styles.text}>{item.label}</span>}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
            <p className={styles.description}>{description}</p>
            <div className={styles.buttonGroup}>
              <a href={button1Link}>
                <Button className={styles.button}>{button1Text}</Button>
              </a>
              <a href={button2Link}>
                <Button className={styles.button}>{button2Text}</Button>
              </a>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image src={mainImageSrc} alt="Imagem principal" width={700} height={700} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitScreenComponent;