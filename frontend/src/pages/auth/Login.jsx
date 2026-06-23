import { useState, useContext } from 'react'; // <-- ¡Aquí faltaba useContext!
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  
  // Estado para alternar entre Login y Registro
  const [isLogin, setIsLogin] = useState(true);
  const { loginContext } = useContext(AuthContext);
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de retroalimentación
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLoading(true);
    setError(null);

    // 1. Definimos dinámicamente la URL apuntando al puerto libre 5001
    const url = isLogin 
      ? 'http://localhost:5001/api/auth/login' 
      : 'http://localhost:5001/api/auth/register';

    // 2. Definimos el payload según corresponda
    const payload = isLogin 
      ? { email, password } 
      : { nombre, email, password };

    try {
      // 3. Realizamos la petición usando la URL dinámica corregida
      const response = await fetch(url, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || data.message || 'Error en el servidor');
      }

      if (isLogin) {
        // Guardamos los datos de sesión en el navegador
        loginContext(data.user || data, data.token);
        
        // Redirigimos a la interfaz principal
        navigate('/dashboard');
      } else {
        alert('¡Registro exitoso! Por favor, inicia sesión.');
        setIsLogin(true); // Cambia automáticamente a la vista de login
        setPassword('');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-12 px-6 dark:bg-background-dark transition-colors duration-300 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-surface-dark dark:border dark:border-gray-800 animate-fade-in">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-primary">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
          <p className="text-gray-500 mt-2 dark:text-gray-400">
            {isLogin ? 'Ingresa tus credenciales para acceder' : 'Únete para comprar tus pasajes más rápido'}
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Campo Nombre (Solo para Registro) */}
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre completo</label>
              <input 
                type="text" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-white dark:focus:border-primary"
                placeholder="Ej. Juan Pérez"
              />
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Correo electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-white dark:focus:border-primary"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary dark:border-gray-700 dark:bg-zinc-900 dark:text-white dark:focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {/* Botón de Acción */}
          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-accent px-4 py-3 font-bold text-white shadow-md transition-all hover:bg-accent-hover disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              isLogin ? 'INICIAR SESIÓN' : 'REGISTRARME'
            )}
          </button>
        </form>

        {/* Alternar entre Login y Registro */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }} 
            className="ml-2 font-bold text-primary hover:underline"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </div>

      </div>
    </div>
  );
}