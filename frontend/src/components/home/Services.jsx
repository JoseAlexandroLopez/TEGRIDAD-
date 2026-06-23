export default function Services() {
  const servicesData = [
    {
      title: "Asientos 160° - VIP",
      desc: "Asientos de cuero extra anchos, soporte para piernas y cortinas de privacidad para un descanso total.",
      img: "https://cms.movilbus.pe/storage/01JQ4K9Z8Z445KGC34ZEMQ0JJC.png"
    },
    {
      title: "Entretenimiento y Wi-Fi",
      desc: "Pantallas táctiles individuales con películas de estreno y conexión Wi-Fi estable durante toda la ruta.",
      img: "https://c8.alamy.com/comp/2R8MPGM/interior-of-public-transport-coach-volvo-bus-with-tv-screens-showing-above-seats-mexico-2R8MPGM.jpg"
    },
    {
      title: "Catering a Bordo",
      desc: "Servicio de cena caliente y desayuno incluido para la ruta directa Cusco - Lima.",
      img: "https://www.todoturismosrl.com/images/buses/bus_salar_cama7.jpg"
    }
  ];

  return (
    <section className="bg-background-light py-20 px-6 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold text-primary md:text-4xl">Servicios a Bordo</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Garantizamos una alta Adecuación Funcional para tu comodidad.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {servicesData.map((service, idx) => (
            <article key={idx} className="group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-surface-dark dark:shadow-none dark:border dark:border-gray-800">
              <div className="h-56 overflow-hidden">
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="mb-3 text-xl font-bold text-accent">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}