export default function Fleet() {
  const fleetData = [
    {
      title: "Volvo G8 - Doble Piso",
      desc: "Nuestra unidad principal. Aerodinámica avanzada y suspensión inteligente para carreteras sinuosas.",
      img: "https://i.postimg.cc/W4Nj2k3f/volvo.jpg" // Usando una imagen representativa estable
    },
    {
      title: "Volvo B450R - Ejecutivo",
      desc: "Bus panorámico de un piso para servicios express. Máxima seguridad y rastreo satelital.",
      img: "https://i.postimg.cc/W4Nj2k3f/volvo.jpg" // Puedes reemplazar este enlace por la imagen exacta del B450R luego
    }
  ];

  return (
    <section className="bg-white py-20 px-6 dark:bg-surface-dark transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold text-primary md:text-4xl">Muestra de Nuestra Flota</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Unidades de última generación con chasis Volvo y carrocería Marcopolo.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {fleetData.map((bus, idx) => (
            <article key={idx} className="overflow-hidden rounded-2xl bg-background-light shadow-md border border-gray-100 dark:bg-background-dark dark:border-gray-800">
              <div className="h-64 overflow-hidden">
                <img 
                  src={bus.img} 
                  alt={bus.title} 
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="mb-3 text-xl font-bold text-accent">{bus.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{bus.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}