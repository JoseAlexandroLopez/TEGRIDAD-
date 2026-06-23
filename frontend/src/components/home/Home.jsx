import Hero from '../../components/home/Hero';
import Services from '../../components/home/Services';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <Services />
      {/* Aquí luego agregaremos el componente de la Flota y el Mapa de Asientos */}
    </div>
  );
}