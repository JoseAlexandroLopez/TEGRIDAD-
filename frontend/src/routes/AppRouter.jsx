import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Rutas from '../pages/rutas/Rutas';
import Booking from '../pages/booking/Booking';
import Promociones from '../pages/promociones/Promociones';
import Seguimiento from '../pages/seguimiento/Seguimiento'; 
import Dashboard from '../pages/Dashboard'; 
import Pago from '../pages/Pago';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="rutas" element={<Rutas />} />
          <Route path="reserva" element={<Booking />} />
          
          {/* AHORA SÍ ESTÁN CORRECTAMENTE SEPARADOS */}
          <Route path="tracking" element={<Seguimiento />} /> 
          <Route path="dashboard" element={<Dashboard />} /> 
          
          <Route path="promociones" element={<Promociones />} />
          <Route path="pago" element={<Pago />} />
          
          <Route path="*" element={<div className="p-20 text-center text-red-500 text-xl font-bold">Error 404: Página no encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}