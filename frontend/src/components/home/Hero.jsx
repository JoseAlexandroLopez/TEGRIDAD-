import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-light text-white dark:from-zinc-900 dark:to-zinc-800">
      {/* Forma decorativa de fondo (Clip Path) */}
      <div className="absolute inset-0 bg-black/10 clip-path-hero dark:bg-black/40"></div>
      
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-20 md:flex-row md:py-32">
        <div className="flex-1 text-center md:text-left">
          <span className="mb-6 inline-block rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-primary dark:text-zinc-900 shadow-sm">
            Calidad Garantizada
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            El mejor viaje entre <br className="hidden md:block" />
            <span className="text-gold">Cusco y Lima.</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg font-medium text-gray-100 dark:text-gray-300">
            Ingeniería aplicada a tu seguridad. Monitoreo GPS 24/7 y la flota más moderna del Perú.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/reserva" className="rounded-full bg-accent px-8 py-4 text-center font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-accent-hover">
              COMPRAR PASAJE
            </Link>
          </div>
        </div>
        
        <div className="flex-1">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600" 
            alt="Bus Tegridad en la ruta" 
            className="rounded-2xl border-8 border-white/20 object-cover shadow-2xl dark:border-zinc-700/50"
          />
        </div>
      </div>
    </section>
  );
}