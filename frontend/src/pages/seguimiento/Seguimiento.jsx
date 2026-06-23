import { useState } from 'react';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Seguimiento() {
  // Simulamos los buses despachados HOY
  const busesHoy = [
    {
      id: 'V8A-921',
      ruta: 'Cusco ➔ Lima',
      horaSalida: '08:00 AM',
      estado: 'En ruta',
      velocidad: '85 km/h',
      ultimaUbicacion: 'Cerca a Nazca',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.587884694468!2d-74.9392!3d-14.835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDUwJzA2LjAiUyA3NMKwNTYnMjEuMSJX!5e0!3m2!1ses!2spe!4v1620000000000!5m2!1ses!2spe" // Ejemplo
    },
    {
      id: 'TCK-987',
      ruta: 'Lima ➔ Cusco',
      horaSalida: '14:30 PM',
      estado: 'En ruta',
      velocidad: '70 km/h',
      ultimaUbicacion: 'Ica',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.54!2d-75.73!3d-14.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDAzJzM2LjAiUyA3NcKwNDMnNDguMCJX!5e0!3m2!1ses!2spe!4v1620000000001!5m2!1ses!2spe" // Ejemplo
    },
    {
      id: 'BJW-456',
      ruta: 'Cusco ➔ Arequipa',
      horaSalida: '18:11 PM',
      estado: 'Saliendo',
      velocidad: '40 km/h',
      ultimaUbicacion: 'Terminal Terrestre Cusco',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.3510526006764!2d-71.989269524024!3d-13.528407471926671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd5d36e2f6d55%3A0x231454552b07e5f1!2sTerminal%20Terrestre%20Cusco!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe" // Ejemplo Cusco
    }
  ];

  // Bus por defecto (el más reciente)
  const [busSeleccionado, setBusSeleccionado] = useState(busesHoy[2]);

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#759522] mb-3">Rastrea tu Viaje</h1>
        <p className="text-gray-400 text-lg">Selecciona la unidad que deseas monitorear en tiempo real.</p>
        
        {/* NUEVO SELECCIONADOR CENTRAL */}
        <div className="mt-8 max-w-xl mx-auto">
          <select 
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-6 py-4 text-white text-lg font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer shadow-lg appearance-none"
            value={busSeleccionado.id}
            onChange={(e) => setBusSeleccionado(busesHoy.find(b => b.id === e.target.value))}
            style={{ 
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23759522%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'right 1.5rem top 50%', 
              backgroundSize: '1rem auto' 
            }}
          >
            {busesHoy.map(bus => (
              <option key={bus.id} value={bus.id} className="bg-[#1a1a1a] text-white py-2">
                🚌 Placa: {bus.id} | {bus.ruta} ({bus.horaSalida})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-[#1a1a1a] rounded-3xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
        
        {/* CABECERA DEL MAPA */}
        <div className="p-6 border-b border-[#2a2a2a] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e1e1e]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center text-green-500">
              <DirectionsBusIcon />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Unidad Seleccionada</p>
              <p className="text-xl font-bold text-white mt-1">Placa: {busSeleccionado.id} ({busSeleccionado.ruta})</p>
            </div>
          </div>

          <div className="flex gap-6 text-left">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><SpeedIcon fontSize="small"/> Velocidad</p>
              <p className="font-bold text-white">{busSeleccionado.velocidad}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><LocationOnIcon fontSize="small"/> Ubicación</p>
              <p className="font-bold text-white">{busSeleccionado.ultimaUbicacion}</p>
            </div>
          </div>
        </div>

        {/* CONTENEDOR DEL MAPA */}
        <div className="relative h-[500px] bg-[#121212]">
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-white text-xs font-bold uppercase tracking-wider">Señal GPS Activa</span>
          </div>

          <iframe 
            src={busSeleccionado.mapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa del bus ${busSeleccionado.id}`}
            className="grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          ></iframe>
        </div>
      </div>
    </div>
  );
}