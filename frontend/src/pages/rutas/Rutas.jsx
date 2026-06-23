import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Rutas() {
  
  // Datos simulados de la ruta Cusco - Lima con sus paradas
  const paradas = [
    { ciudad: 'Cusco', agencia: 'Terminal Terrestre Cusco', tiempo: '0:00 hrs', estado: 'origen' },
    { ciudad: 'Abancay', agencia: 'Agencia Centro Abancay', tiempo: '+4:30 hrs', estado: 'parada' },
    { ciudad: 'Puquio', agencia: 'Terminal Puquio', tiempo: '+9:00 hrs', estado: 'parada' },
    { ciudad: 'Nazca', agencia: 'Agencia Nazca Express', tiempo: '+13:00 hrs', estado: 'parada' },
    { ciudad: 'Ica', agencia: 'Terminal Ica', tiempo: '+15:30 hrs', estado: 'parada' },
    { ciudad: 'Lima', agencia: 'Terminal Plaza Norte', tiempo: '+21:00 hrs', estado: 'destino' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex justify-center md:justify-start items-center gap-3">
            <DirectionsBusIcon fontSize="large" className="text-primary" />
            Nuestras Rutas Oficiales
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora el trayecto completo, nuestras agencias autorizadas y los tiempos estimados de viaje gracias a nuestra integración con Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LÍNEA DE TIEMPO (TIMELINE) DE PARADAS */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-200/60 dark:bg-zinc-900 dark:border-zinc-800/50 h-fit">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
              Ruta: Cusco ➔ Lima
            </h2>
            
            <div className="relative border-l-4 border-primary/30 ml-4 space-y-8 pb-4">
              {paradas.map((parada, index) => (
                <div key={index} className="relative pl-8">
                  {/* Icono del punto */}
                  <div className={`absolute -left-[14px] top-0 h-6 w-6 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center 
                    ${parada.estado === 'origen' || parada.estado === 'destino' ? 'bg-primary scale-125' : 'bg-accent'}`}>
                  </div>
                  
                  {/* Información de la parada */}
                  <div>
                    <h3 className={`font-bold text-lg ${parada.estado === 'origen' || parada.estado === 'destino' ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
                      {parada.ciudad}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <LocationOnIcon fontSize="small" className="text-gray-400" />
                      {parada.agencia}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">
                      <AccessTimeIcon fontSize="small" />
                      Tiempo estimado: {parada.tiempo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INTEGRACIÓN DE GOOGLE MAPS */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-2 shadow-sm border border-gray-200/60 dark:bg-zinc-900 dark:border-zinc-800/50 overflow-hidden h-[600px] relative">
            
            {/* Capa flotante informativa */}
            <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 dark:bg-zinc-900/90 dark:border-zinc-700">
              <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Ruta Activa
              </h4>
              <p className="text-xs text-gray-500 mt-1">Monitoreo GPS en tiempo real</p>
            </div>

            {/* Iframe de Google Maps incrustado (Seguro y gratis) */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d4013894.275305141!2d-76.49503463878199!3d-13.064560124807492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x916dd5d826598431%3A0x2aa0c166eca13867!2sCusco!3m2!1d-13.53195!2d-71.96746259999999!4m5!1s0x9105c8b09b5314db%3A0x9597a7a5843b0c51!2sPlaza%20Norte%20Terminal%20Terrestre%2C%20Tom%C3%A1s%20Valle%2C%20Independencia!3m2!1d-12.0069417!2d-77.0583789!5e0!3m2!1ses-419!2spe!4v1717200000000!5m2!1ses-419!2spe" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '1.25rem' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ruta Tegridad Cusco a Lima"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}