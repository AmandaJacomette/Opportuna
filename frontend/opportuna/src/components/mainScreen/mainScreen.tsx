'use client';

import Image from 'next/image';
import { Button } from '../../components/ui/button';
import imagePrin from '../../../public/Images/image.png';
import imageLogoSimples from '../../../public/Images/Logos/LogoSemFundo.png';
import styles from './mainScreen.module.css';

const MainScreenComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image src={imageLogoSimples} alt="Opportuna" width={50} height={50} className="rounded-full" />
          </div>
          <div className={styles.navLinks}>
            <a href="#" className={styles.link}>Vagas</a>
            <a href="#" className={styles.link}>Cadastro</a>
            <Button className={styles.button}>Login</Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>Opportuna</h1>
            <p className={styles.subtitle}>Oportunidades que transformam vidas </p>
            <br />
            <p className={styles.description}>Venha você também fazer parte desse universo de oportunidades!</p>
            <div className={styles.buttonGroup}>
              <Button className={styles.button}>Sou Candidato</Button>
              <Button className={styles.button}>Sou Empresa</Button>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image src={imagePrin} alt="Opportuna" width={700} height={700} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreenComponent;
