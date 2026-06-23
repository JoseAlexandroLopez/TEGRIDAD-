import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

export default function Navbar() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ==========================================
  // DETECTOR ULTRA-SEGURO DE NOMBRE DE USUARIO
  // ==========================================
  let datosLocales = {};
  try {
    const sesionGuardada = localStorage.getItem('usuarioLogueado');
    if (sesionGuardada) {
      datosLocales = sesionGuardada.startsWith('{') || sesionGuardada.startsWith('[')
        ? JSON.parse(sesionGuardada)
        : { email: sesionGuardada, nombre: sesionGuardada.includes('@') ? sesionGuardada.split('@')[0] : sesionGuardada };
    }
  } catch (error) {
    console.error("Error leyendo sesión en Navbar:", error);
  }

  // Combinamos contexto con localStorage para evitar que diga "Viajero" al recargar con F5
  const cuenta = user || datosLocales;
  const correoUsuario = cuenta?.email || cuenta?.correo || cuenta?.usuario?.email || 'correo@tegridad.com';
  const nombreCompleto = cuenta?.nombre || cuenta?.name || cuenta?.nombres || cuenta?.usuario?.nombre || (correoUsuario !== 'correo@tegridad.com' ? correoUsuario.split('@')[0] : null);
  
  // Formateamos para que solo muestre el primer nombre capitalizado
  const primerNombre = nombreCompleto ? nombreCompleto.split(' ')[0] : null;
  const nombreFormateado = primerNombre ? primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1) : null;

  // Cierre de sesión con redirección automática
  const handleLogout = () => {
    if (logout) logout();
    // Limpiamos todo rastro en el navegador por seguridad
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('token');
    localStorage.removeItem('cuponActivo'); // Limpiamos si dejó cupones sin usar
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 p-4 backdrop-blur-md shadow-sm transition-colors duration-300 dark:bg-zinc-900/80 dark:border-gray-800/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-primary">
          <DirectionsBusIcon className="text-accent" fontSize="large" />
          TEG<span className="text-accent">RIDAD</span>
        </Link>

        {/* ENLACES CENTRALES */}
        <div className="hidden items-center gap-6 md:flex font-medium text-gray-700 dark:text-gray-300">
          <Link to="/rutas" className="hover:text-accent transition-colors">Rutas</Link>
          <Link to="/tracking" className="hover:text-accent transition-colors">Seguimiento en Vivo</Link>
          <Link to="/promociones" className="hover:text-accent transition-colors">Promociones</Link>
        </div>

        {/* CONTROLES DERECHA */}
        <div className="flex items-center gap-4">
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <LightModeIcon className="text-gold" /> : <DarkModeIcon className="text-gray-600" />}
          </IconButton>

          {/* ESTE BOTÓN AHORA SIEMPRE ES VISIBLE (Logueado o no) */}
          <Link to="/reserva" className="hidden sm:block rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-accent-hover transition-all">
            RESERVAR
          </Link>

          {/* RENDERIZADO DINÁMICO DE SESIÓN */}
          {nombreFormateado && localStorage.getItem('usuarioLogueado') ? (
            <div className="flex items-center gap-3">
              
              <Link to="/dashboard" className="hidden lg:block text-sm font-medium hover:opacity-80 transition-opacity text-gray-700 dark:text-gray-300">
                ¡Hola, <b className="text-primary">{nombreFormateado}</b>!
              </Link>
              
              <Link to="/dashboard" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition-all">
                Mi Panel
              </Link>

              <button onClick={handleLogout} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200">
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-lg border-2 border-primary px-4 py-1.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all">
                Mi Cuenta
              </Link>
              {/* Botón reservar extra para móviles cuando no hay sesión */}
              <Link to="/reserva" className="sm:hidden rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-accent-hover transition-all">
                RESERVAR
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}