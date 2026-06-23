import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('principal'); 
  const [historialViajes, setHistorialViajes] = useState([]);

  // ========================================================
  // DETECTOR DE USUARIO SINCRONIZADO EXACTAMENTE CON TU NAVBAR
  // ========================================================
  let datosLocales = {};
  try {
    const sesionGuardada = localStorage.getItem('usuarioLogueado');
    if (sesionGuardada) {
      datosLocales = sesionGuardada.startsWith('{') || sesionGuardada.startsWith('[')
        ? JSON.parse(sesionGuardada)
        : { email: sesionGuardada, nombre: sesionGuardada.includes('@') ? sesionGuardada.split('@')[0] : sesionGuardada };
    }
  } catch (error) {
    console.error("Error leyendo sesión en Dashboard:", error);
  }

  const cuenta = user || datosLocales;
  const correoUsuario = cuenta?.email || cuenta?.correo || cuenta?.usuario?.email || 'correo@tegridad.com';
  const nombreCompleto = cuenta?.nombre || cuenta?.name || cuenta?.nombres || cuenta?.usuario?.nombre || (correoUsuario !== 'correo@tegridad.com' ? correoUsuario.split('@')[0] : 'Viajero');
  
  // Extraemos el primer nombre y lo aseguramos como String antes de formatear
  const primerNombre = nombreCompleto ? String(nombreCompleto).split(' ')[0] : 'Viajero';
  const nombreFormateado = primerNombre.toUpperCase();
  // ========================================================

  // 1. CARGA SEGURA DEL HISTORIAL DE VIAJES
  useEffect(() => {
    if (!localStorage.getItem('usuarioLogueado') && !user) {
      navigate('/login');
      return;
    }
    
    try {
      const rawData = localStorage.getItem('historialViajes');
      if (rawData) {
        const parsedData = JSON.parse(rawData);
        if (Array.isArray(parsedData)) {
          setHistorialViajes(parsedData);
        }
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  }, [user, navigate]);

  // 2. CÁLCULO DE TEGRIPUNTOS
  const totalGastado = historialViajes.reduce((acc, viaje) => {
    const precio = Number(viaje?.total) || Number(viaje?.precio) || 0;
    return acc + precio;
  }, 0);
  
  const 本tegriPuntos = Math.floor(totalGastado / 10); 
  const ultimoViaje = historialViajes.length > 0 ? historialViajes[historialViajes.length - 1] : null;

  // Helper para renderizar asientos sin importar si vienen como array o número suelto
  const getAsientosList = (viaje) => {
    if (!viaje) return [];
    if (Array.isArray(viaje.asientos)) return viaje.asientos;
    if (viaje.asiento) return [viaje.asiento];
    return [];
  };

  const limpiarDatosLimpios = () => {
    localStorage.removeItem('historialViajes');
    setHistorialViajes([]);
    alert("Historial limpiado.");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex dark:bg-[#121212] transition-colors duration-300 w-full">
      
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-white border-r border-gray-200/60 p-6 flex flex-col dark:bg-[#1e1e1e] dark:border-gray-800/50 hidden md:flex">
        <div className="flex items-center gap-3 p-2 mb-8">
          <div className="h-12 w-12 rounded-full bg-[#759522]/20 flex items-center justify-center text-[#759522] font-black text-xl border-2 border-[#759522] shrink-0">
            {nombreFormateado.charAt(0)}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{nombreFormateado}</h4>
            <p className="text-xs text-gray-500 truncate">{correoUsuario}</p>
          </div>
        </div>
        <nav className="space-y-2 font-medium text-sm flex-1">
          <button onClick={() => setTabActiva('principal')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tabActiva === 'principal' ? 'bg-[#759522]/10 text-[#759522] font-bold' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400'}`}><PersonIcon fontSize="small"/> Resumen</button>
          <button onClick={() => setTabActiva('pasajes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tabActiva === 'pasajes' ? 'bg-[#759522]/10 text-[#759522] font-bold' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400'}`}><DirectionsBusIcon fontSize="small"/> Mis Pasajes</button>
          <button onClick={() => setTabActiva('puntos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tabActiva === 'puntos' ? 'bg-orange-50 text-orange-600 font-bold dark:bg-orange-900/20' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400'}`}><CardGiftcardIcon fontSize="small"/> TegriPuntos</button>
        </nav>
        
        <button onClick={limpiarDatosLimpios} className="text-xs text-red-400 mt-auto hover:underline text-left">
          Borrar datos de prueba
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">¡Hola, {nombreFormateado}!</h1>
            <p className="text-gray-500 mt-1">Bienvenido a tu panel de control</p>
          </div>
          <Link to="/reserva" className="bg-[#f06522] hover:bg-[#d9551c] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all text-center">
            Nuevo Viaje
          </Link>
        </div>

        {/* --- PESTAÑA: RESUMEN --- */}
        {tabActiva === 'principal' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl shadow-lg text-white">
              <h3 className="text-orange-100 text-sm font-bold uppercase tracking-wider mb-2">Tus TegriPuntos</h3>
              <p className="text-5xl font-black">{本tegriPuntos}</p>
              <p className="text-sm mt-4 opacity-80">Sigue viajando para acumular más descuentos.</p>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 md:col-span-2">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Tu Viaje Más Reciente</h3>
              
              {ultimoViaje ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 gap-4">
                  <div>
                    <p className="font-black text-xl text-gray-800 dark:text-white mb-1">
                      {ultimoViaje?.origen || 'Origen'} ➔ {ultimoViaje?.destino || 'Destino'}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {ultimoViaje?.fecha || 'Fecha'} | {ultimoViaje?.hora || 'Hora'}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-bold">
                        {ultimoViaje?.servicio || 'Bus'}
                      </span>
                      <span className="text-sm text-[#759522] font-black">
                        Asientos: {getAsientosList(ultimoViaje).join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                    <span className="bg-[#759522]/20 text-[#759522] px-4 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase">
                      CONFIRMADO
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aún no tienes viajes programados.</p>
                  <Link to="/reserva" className="text-[#759522] font-bold hover:underline">¡Reserva tu primer pasaje ahora!</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- PESTAÑA: MIS PASAJES --- */}
        {tabActiva === 'pasajes' && (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
            <h2 className="text-2xl font-extrabold mb-6 dark:text-white flex items-center gap-2">
              <HistoryIcon className="text-[#759522]"/> Historial de Pasajes
            </h2>
            
            {historialViajes.length === 0 ? (
               <p className="text-gray-500 text-center py-10 bg-gray-50 dark:bg-zinc-900 rounded-2xl">No hay boletos comprados.</p>
            ) : (
               <div className="space-y-4">
                 {[...historialViajes].reverse().map((viaje, idx) => (
                   <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 gap-4 hover:border-[#759522] transition-colors">
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cód. {viaje?.idCompra || '000000'}</span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                         <span className="text-xs text-gray-400 font-medium">{viaje?.fechaCompra || 'Reciente'}</span>
                       </div>
                       
                       <p className="text-xl font-black text-gray-800 dark:text-white mb-1">
                         {viaje?.origen || '-'} ➔ {viaje?.destino || '-'}
                       </p>
                       <p className="text-sm text-gray-500 font-medium">
                         {viaje?.fecha || '-'} a las {viaje?.hora || '-'} | {viaje?.servicio || 'Bus'}
                       </p>
                       
                       <div className="mt-3 flex flex-wrap gap-2">
                         <span className="text-xs font-black text-gray-500 uppercase mt-1 mr-1">Asientos:</span>
                         {getAsientosList(viaje).map(num => (
                            <span key={num} className="bg-[#ea580c] text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                              #{num}
                            </span>
                         ))}
                       </div>
                     </div>
                     
                     <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 border-gray-200 dark:border-gray-700 pt-4 md:pt-0 mt-2 md:mt-0">
                       <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Pagado vía {viaje?.metodo || 'Tarjeta'}</p>
                       <p className="text-3xl font-black text-[#759522]">S/ {Number(viaje?.total || viaje?.precio || 0).toFixed(2)}</p>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}

        {/* --- PESTAÑA: PUNTOS --- */}
        {tabActiva === 'puntos' && (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
            <h2 className="text-2xl font-extrabold dark:text-white mb-6 flex items-center gap-2">
              <CardGiftcardIcon className="text-orange-500"/> Mis TegriPuntos
            </h2>
            <div className="bg-orange-50 dark:bg-orange-900/10 p-8 rounded-3xl border border-orange-200 dark:border-orange-900/30 text-center max-w-md mx-auto shadow-inner">
              <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Saldo Disponible</p>
              <p className="text-6xl font-black text-orange-600 dark:text-orange-500 my-4">{本tegriPuntos}</p>
              <div className="h-px bg-orange-200 dark:bg-orange-800/50 w-full my-4"></div>
              <p className="text-sm text-gray-500">Recuerda: Ganas 10 puntos por cada S/ 100.00 gastados en boletos. Úsalos como cupones en tus próximas compras.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}