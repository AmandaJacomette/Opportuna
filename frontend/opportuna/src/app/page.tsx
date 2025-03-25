import InitScreenComponent from "@/components/initScreen/initScreen";
import MainScreenComponent from "@/components/mainScreen/mainScreen";
import Image from "next/image";

export default function Home() {
  return (
    <MainScreenComponent />
/*    <InitScreenComponent
    title="Contrate os melhores talentos"
  subtitle="Conecte-se com profissionais qualificados"
  description="Publique suas vagas e encontre os melhores candidatos."
  button1Text="Publicar Vaga"
  button2Text="Saiba Mais"
  button1Link="/publicar-vaga"
  button2Link="/sobre"
  headerItems={[
    { type: 'text', label: 'Bem-vindo!' },
    { type: 'link', label: 'Sobre Nós', href: '/sobre' },
    { type: 'link', label: 'Serviços', href: '/servicos' },
    { type: 'button', label: 'Contato', href: '/contato' }
  ]}
/>*/
  );
}
