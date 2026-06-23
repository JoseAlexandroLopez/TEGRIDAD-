import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reserva() {
  const navigate = useNavigate();

  // Datos simulados de la búsqueda previa
  const infoBusqueda = {
    origen: 'Cusco',
    destino: 'Lima',
    fecha: '2026-06-22'
  };

  // Estados
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  // CARGAMOS LOS HORARIOS Y BUSCAMOS TUS COMPRAS PREVIAS
  useEffect(() => {
    // Horarios base por defecto (con los ocupados originales)
    const horariosBase = [
      { id: 1, salida: '08:00 AM', llegada: '06:00 AM (+1)', tipo: 'Bus Cama 160°', precio: 120, asientosTotales: 70, ocupados: [3, 9, 13, 22, 31, 41, 52, 64] },
      { id: 2, salida: '14:30 PM', llegada: '12:30 PM (+1)', tipo: 'Bus Cama 160°', precio: 100, asientosTotales: 70, ocupados: [1, 2, 5, 10, 15, 20, 25, 30] },
      { id: 3, salida: '19:00 PM', llegada: '17:00 PM (+1)', tipo: 'Súper Cama 180°', precio: 150, asientosTotales: 70, ocupados: [7, 14, 21, 28, 35] },
    ];

    // Leemos el historial de compras de este dispositivo
    const historialGuardado = JSON.parse(localStorage.getItem('historialViajes')) || [];

    // Filtramos solo los viajes que aplican a la ruta y fecha buscada
    const viajesDeEstaRuta = historialGuardado.filter(viaje => 
      viaje.origen === infoBusqueda.origen &&
      viaje.destino === infoBusqueda.destino &&
      viaje.fecha === infoBusqueda.fecha
    );

    // Cruzamos la información: agregamos tus asientos comprados a los ocupados
    const horariosActualizados = horariosBase.map(horario => {
      // ¿Compraste en esta hora específica?
      const comprasEnEsteHorario = viajesDeEstaRuta.filter(v => v.hora === horario.salida);
      const asientosRecienComprados = comprasEnEsteHorario.flatMap(v => v.asientos || []);

      // Unimos los ocupados base + los que acabas de comprar (sin duplicados)
      const ocupadosTotales = [...new Set([...horario.ocupados, ...asientosRecienComprados])];
      
      return {
        ...horario,
        ocupados: ocupadosTotales,
        libres: horario.asientosTotales - ocupadosTotales.length // Recalculamos los libres reales
      };
    });

    setHorarios(horariosActualizados);
  }, []); // El array vacío asegura que esto corra solo una vez al abrir la página

  const handleElegirAsientos = (horario) => {
    // Si hace clic en el mismo que ya está abierto, lo cierra. Si es otro, lo abre y limpia asientos.
    if (horarioSeleccionado?.id === horario.id) {
      setHorarioSeleccionado(null);
    } else {
      setHorarioSeleccionado(horario);
      setAsientosSeleccionados([]); 
    }
  };

  const toggleAsiento = (numeroAsiento) => {
    if (horarioSeleccionado.ocupados.includes(numeroAsiento)) return; // No hacer nada si está ocupado

    setAsientosSeleccionados(prev => 
      prev.includes(numeroAsiento)
        ? prev.filter(a => a !== numeroAsiento)
        : [...prev, numeroAsiento]
    );
  };

  const handleContinuarPago = () => {
    if (asientosSeleccionados.length === 0) return;

    // Preparamos el objeto para mandarlo a Pago.jsx
    const reservaPendiente = {
      origen: infoBusqueda.origen,
      destino: infoBusqueda.destino,
      fecha: infoBusqueda.fecha,
      hora: horarioSeleccionado.salida,
      servicio: horarioSeleccionado.tipo,
      asientos: asientosSeleccionados,
      precioUnitario: horarioSeleccionado.precio,
      total: horarioSeleccionado.precio * asientosSeleccionados.length
    };

    // Guardamos en LocalStorage para que Pago.jsx lo reciba
    localStorage.setItem('reservaPendiente', JSON.stringify(reservaPendiente));
    navigate('/pago');
  };

  // Función para renderizar los asientos del bus horizontal
  const renderFilaAsientos = (inicio, fin) => {
    const fila = [];
    for (let i = inicio; i <= fin; i++) {
      const isOcupado = horarioSeleccionado?.ocupados.includes(i);
      const isSeleccionado = asientosSeleccionados.includes(i);

      fila.push(
        <button
          key={i}
          disabled={isOcupado}
          onClick={() => toggleAsiento(i)}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center text-xs md:text-sm font-bold transition-all
            ${isOcupado 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60' 
              : isSeleccionado 
                ? 'bg-[#ea580c] text-white shadow-md transform scale-110' 
                : 'bg-white text-gray-800 hover:bg-gray-200'}`}
        >
          {i}
        </button>
      );
    }
    return fila;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO DE BÚSQUEDA */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-800 dark:text-white">Horarios Disponibles</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {infoBusqueda.origen} ➔ {infoBusqueda.destino} | {infoBusqueda.fecha}
            </p>
          </div>
          <button className="text-sm font-bold text-[#6a8e23] hover:text-[#526e1b] transition-colors">
            ← Modificar búsqueda
          </button>
        </div>

        {/* LISTA DE HORARIOS (CON ACORDEÓN) */}
        <div className="space-y-4">
          {horarios.map((horario) => {
            const isExpanded = horarioSeleccionado?.id === horario.id;

            return (
              <div key={horario.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all">
                
                {/* TARJETA DEL HORARIO */}
                <div className="p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{horario.salida}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{infoBusqueda.origen}</p>
                    </div>
                    <div className="text-gray-300 dark:text-zinc-600">➔</div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{horario.llegada}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{infoBusqueda.destino}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                    <div className="text-left md:text-center">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{horario.tipo}</p>
                      <p className="text-xs text-[#6a8e23] font-semibold mt-1">💺 {horario.libres} asientos libres</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase">Desde</p>
                      <p className="text-3xl font-black text-[#ea580c]">S/ {horario.precio}</p>
                    </div>
                    <button 
                      onClick={() => handleElegirAsientos(horario)}
                      className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${isExpanded ? 'bg-gray-800 hover:bg-gray-700' : 'bg-[#6a8e23] hover:bg-[#526e1b]'}`}
                    >
                      {isExpanded ? 'Cerrar Asientos' : 'Elegir Asientos'}
                    </button>
                  </div>
                </div>

                {/* ÁREA DESPLEGABLE: MAPA DE ASIENTOS HORIZONTAL + RESUMEN */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 p-6 animate-fade-in flex flex-col xl:flex-row gap-8">
                    
                    {/* CONTENEDOR DEL BUS (Lado Izquierdo) */}
                    <div className="flex-1 overflow-x-auto pb-4">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-[#6a8e23]">Reserva tu Asiento (Vista Horizontal)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona tu ubicación en nuestra unidad de 70 pasajeros.</p>
                      </div>

                      {/* DISEÑO DEL BUS (Fondo oscuro, curvo a la derecha) */}
                      <div className="bg-[#18181b] min-w-[800px] rounded-l-3xl rounded-r-[6rem] p-8 flex shadow-2xl relative border-4 border-gray-800 mx-auto w-max">
                        
                        {/* Grilla de asientos */}
                        <div className="flex flex-col gap-3">
                          {/* Fila 1 */}
                          <div className="flex gap-2">{renderFilaAsientos(1, 18)}</div>
                          {/* Fila 2 */}
                          <div className="flex gap-2">{renderFilaAsientos(19, 36)}</div>
                          
                          {/* Pasillo */}
                          <div className="h-8 flex items-center justify-center bg-black/20 rounded-md my-1">
                            <p className="text-gray-500 font-bold text-[10px] tracking-[0.8em]">P A S I L L O   C E N T R A L   D E   T R A N S I T O</p>
                          </div>

                          {/* Fila 3 */}
                          <div className="flex gap-2">{renderFilaAsientos(37, 54)}</div>
                          {/* Fila 4 */}
                          <div className="flex gap-2">{renderFilaAsientos(55, 70)}</div>
                        </div>

                        {/* Texto de Cabina */}
                        <div className="ml-8 flex flex-col justify-center items-center">
                          <p className="text-yellow-500 font-black text-xl leading-loose tracking-widest break-words w-4 text-center">
                            CABINA
                          </p>
                        </div>
                      </div>

                      {/* LEYENDA */}
                      <div className="flex justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-gray-300 rounded-sm"></div><span className="text-sm dark:text-gray-300">Libre</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-600 rounded-sm"></div><span className="text-sm dark:text-gray-300">Ocupado</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#ea580c] rounded-sm"></div><span className="text-sm dark:text-gray-300">Seleccionado</span></div>
                      </div>
                    </div>

                    {/* RESUMEN DE COMPRA (Lado Derecho) */}
                    <div className="w-full xl:w-80 bg-[#18181b] rounded-3xl p-6 text-white h-fit sticky top-6 shadow-xl">
                      <h3 className="text-lg font-bold mb-6">Resumen de tu Viaje</h3>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-gray-700 pb-3">
                          <span className="text-gray-400">Ruta</span>
                          <span className="font-bold">{infoBusqueda.origen} ➔ {infoBusqueda.destino}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-3">
                          <span className="text-gray-400">Fecha y Hora</span>
                          <span className="font-bold text-right">{infoBusqueda.fecha} <br/> {horario.salida}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-3">
                          <span className="text-gray-400">Servicio</span>
                          <span className="font-bold">{horario.tipo}</span>
                        </div>

                        <div className="pt-2">
                          <span className="text-gray-400 block mb-2">Asientos seleccionados:</span>
                          {asientosSeleccionados.length === 0 ? (
                            <span className="text-[#ea580c] font-bold">Ningún asiento seleccionado</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {asientosSeleccionados.map(a => (
                                <span key={a} className="bg-[#ea580c] px-3 py-1 rounded-md font-bold">{a}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-end pt-6">
                          <span className="text-gray-400">Total a Pagar</span>
                          <span className="text-4xl font-black text-[#ea580c]">
                            S/ {horario.precio * asientosSeleccionados.length}
                          </span>
                        </div>

                        <button 
                          onClick={handleContinuarPago}
                          disabled={asientosSeleccionados.length === 0}
                          className={`w-full py-4 rounded-xl font-bold mt-6 transition-all ${asientosSeleccionados.length > 0 ? 'bg-[#2b3543] hover:bg-[#3b4859] text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                          CONTINUAR AL PAGO
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}