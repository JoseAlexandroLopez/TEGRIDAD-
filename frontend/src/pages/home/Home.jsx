import Hero from '../../components/home/Hero';
import Services from '../../components/home/Services';
import Fleet from '../../components/home/Fleet';
import SeatMap from '../../components/home/SeatMap';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <Services />
      <Fleet />
      <SeatMap />
    </div>
  );
}