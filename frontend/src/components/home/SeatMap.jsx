import { useState } from 'react';

export default function SeatMap() {
  const [selectedSeat, setSelectedSeat] = useState(15); // Asiento pre-seleccionado según el mockup

  // Función para simular el estado de un asiento basado en la maqueta original
  const getSeatStatus = (num) => {
    const ocupados = [3, 9, 13, 22, 31, 41, 52, 64];
    if (num === selectedSeat) return 'seleccionado';
    if (ocupados.includes(num)) return 'ocupado';
    return 'libre';
  };

  const renderSeat = (num) => {
    const status = getSeatStatus(num);
    const baseStyles = "flex items-center justify-center min-w-[40px] h-[40px] rounded-l-lg rounded-r-sm text-xs font-bold cursor-pointer border-r-4 transition-all";
    
    let statusStyles = "";
    if (status === 'libre') statusStyles = "bg-white text-gray-800 border-gray-300 hover:bg-gold";
    if (status === 'ocupado') statusStyles = "bg-zinc-600 text-zinc-400 border-zinc-800 cursor-not-allowed";
    if (status === 'seleccionado') statusStyles = "bg-accent text-white border-orange-800";

    return (
      <div 
        key={num} 
        onClick={() => status !== 'ocupado' && setSelectedSeat(num)}
        className={`${baseStyles} ${statusStyles}`}
      >
        {num}
      </div>
    );
  };

  return (
    <section className="bg-background-light py-20 px-6 dark:bg-background-dark overflow-hidden">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-extrabold text-primary md:text-4xl">Reserva tu Asiento (Vista Horizontal)</h2>
        <p className="mt-4 mb-12 text-lg text-gray-600 dark:text-gray-400">
          Selecciona tu ubicación en nuestra unidad de 70 pasajeros.
        </p>

        {/* Contenedor del Bus */}
        <div className="flex items-center justify-center gap-8 bg-zinc-900 p-8 rounded-l-2xl rounded-r-[100px] border-8 border-gray-300 dark:border-gray-700 overflow-x-auto max-w-6xl mx-auto shadow-2xl">
          
          <div className="flex flex-col gap-3">
            {/* Fila 1 */}
            <div className="flex gap-2">
              {Array.from({ length: 18 }, (_, i) => renderSeat(i + 1))}
            </div>
            {/* Fila 2 */}
            <div className="flex gap-2">
              {Array.from({ length: 18 }, (_, i) => renderSeat(i + 19))}
            </div>
            
            {/* Pasillo */}
            <div className="bg-black/50 p-2 rounded text-zinc-500 text-sm tracking-[15px] font-bold my-2 text-center">
              PASILLO CENTRAL DE TRANSITO
            </div>

            {/* Fila 3 */}
            <div className="flex gap-2">
              {Array.from({ length: 18 }, (_, i) => renderSeat(i + 37))}
            </div>
            {/* Fila 4 */}
            <div className="flex gap-2">
              {Array.from({ length: 16 }, (_, i) => renderSeat(i + 55))}
            </div>
          </div>

          {/* Cabina */}
          <div className="border-l-4 border-zinc-700 pl-6 text-gold font-bold text-xl tracking-widest leading-loose">
            C<br/>A<br/>B<br/>I<br/>N<br/>A
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex justify-center gap-6 mt-8 font-semibold text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-400"></div> Libre
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-600"></div> Ocupado
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent"></div> Seleccionado
          </div>
        </div>
      </div>
    </section>
  );
}