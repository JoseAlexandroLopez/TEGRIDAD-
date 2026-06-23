import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export default function Promociones() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Simulamos los puntos del usuario. En un sistema real, esto viene de la Base de Datos.
  const [puntos, setPuntos] = useState(250);
  const [cuponActivo, setCuponActivo] = useState(localStorage.getItem('cuponActivo') || null);

  // Lista de recompensas canjeables con TegriPuntos
  const recompensas = [
    { id: 1, titulo: '10% de Descuento', descripcion: 'Aplica a cualquier ruta interprovincial.', costo: 100, codigo: 'TEGRI10' },
    { id: 2, titulo: 'S/ 20.00 de Rebaja', descripcion: 'Descuento directo en tu próxima compra.', costo: 200, codigo: 'TEGRI20SOLES' },
    { id: 3, titulo: 'Viaje 100% Gratis', descripcion: 'Canjea un pasaje de ida gratis a cualquier destino.', costo: 1500, codigo: 'VIAJEGRATIS' },
  ];

  // Seguridad: Redirigir si no hay sesión para poder canjear
  useEffect(() => {
    const tieneSesion = localStorage.getItem('usuarioLogueado');
    if (!tieneSesion && !user) {
      // Si no está logueado, le mostramos la página, pero no podrá canjear
    }
  }, [user]);

  // Función para canjear los puntos
  const handleCanjear = (recompensa) => {
    if (!user && !localStorage.getItem('usuarioLogueado')) {
      alert("Debes iniciar sesión para canjear tus TegriPuntos.");
      navigate('/login');
      return;
    }

    if (puntos >= recompensa.costo) {
      if (window.confirm(`¿Estás seguro de canjear ${recompensa.costo} puntos por el cupón "${recompensa.titulo}"?`)) {
        // Restamos los puntos
        setPuntos(puntos - recompensa.costo);
        // Guardamos el cupón en el navegador para usarlo en Pago.jsx
        localStorage.setItem('cuponActivo', recompensa.codigo);
        localStorage.setItem('descuentoTitulo', recompensa.titulo);
        setCuponActivo(recompensa.codigo);
        
        alert(`¡Canje exitoso! Tu código ${recompensa.codigo} se aplicará automáticamente en tu próxima reserva.`);
      }
    } else {
      alert(`No tienes suficientes TegriPuntos. Te faltan ${recompensa.costo - puntos} puntos.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO Y SALDO DE PUNTOS */}
        <div className="bg-gradient-to-r from-green-700 to-primary rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          {/* Decoración de fondo */}
          <StarIcon className="absolute top-4 right-10 text-white/10 text-9xl transform rotate-12 scale-150" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl font-black flex items-center gap-3">
                <CardGiftcardIcon fontSize="large" /> Club TegriPuntos
              </h1>
              <p className="mt-4 text-green-50 max-w-xl text-lg">
                Acumula puntos por cada kilómetro que viajes con nosotros. 
                Canjéalos por descuentos exclusivos y viaja gratis.
              </p>
            </div>
            
            {/* Tarjeta de Saldo */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl text-center min-w-[250px]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-green-100">Tu Saldo Actual</h3>
              <p className="text-5xl font-black mt-2 flex justify-center items-end gap-2">
                {puntos} <span className="text-xl font-normal mb-1">pts</span>
              </p>
              {!user && (
                <Link to="/login" className="mt-4 inline-block text-xs font-bold bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100">
                  Inicia sesión para usar
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* MENSAJE DE CUPÓN ACTIVO */}
        {cuponActivo && (
          <div className="mb-10 bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r-xl flex justify-between items-center dark:bg-orange-900/30 dark:border-orange-500">
            <div>
              <p className="text-orange-800 dark:text-orange-300 font-bold flex items-center gap-2">
                <ConfirmationNumberIcon /> Tienes un cupón activo: <span className="bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded tracking-widest">{cuponActivo}</span>
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Este descuento se aplicará automáticamente en la pasarela de pago.</p>
            </div>
            <Link to="/reserva" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-orange-600">
              Usar ahora
            </Link>
          </div>
        )}

        {/* CATÁLOGO DE RECOMPENSAS */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
            <LocalOfferIcon className="text-primary" /> Catálogo de Recompensas
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Selecciona la promoción que deseas canjear.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recompensas.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col justify-between dark:bg-zinc-900 dark:border-gray-800 h-full relative overflow-hidden group">
              
              {/* Etiqueta de Precio en Puntos */}
              <div className="absolute top-0 right-0 bg-primary text-white font-black text-sm px-4 py-2 rounded-bl-xl shadow-md">
                {item.costo} pts
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-16 mt-2">{item.titulo}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm line-clamp-3">
                  {item.descripcion}
                </p>
              </div>

              <button
                onClick={() => handleCanjear(item)}
                className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                  puntos >= item.costo
                    ? 'bg-green-50 text-primary border border-green-200 hover:bg-primary hover:text-white dark:bg-green-900/20 dark:border-green-800/50 dark:hover:bg-primary'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-500'
                }`}
              >
                {puntos >= item.costo ? 'Canjear Puntos' : 'Puntos insuficientes'}
              </button>
            </div>
          ))}
        </div>

        {/* SECCIÓN INFORMATIVA */}
        <div className="mt-16 bg-gray-100 rounded-3xl p-8 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">¿Cómo acumulo más TegriPuntos?</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto text-sm">
            Ganas <strong>10 TegriPuntos</strong> por cada pasaje comprado a través de nuestra plataforma web. 
            Asegúrate de iniciar sesión antes de realizar tu reserva para que los puntos se abonen a tu cuenta al finalizar el viaje.
          </p>
        </div>

      </div>
    </div>
  );
}