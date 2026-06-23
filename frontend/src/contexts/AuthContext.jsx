import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 1. Al recargar la página, buscamos si ya había alguien logueado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  // 2. Función para iniciar sesión globalmente
  const loginContext = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuarioLogueado', JSON.stringify(userData));
    setUser(userData);
  };

  // 3. Función para cerrar sesión globalmente
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogueado');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </AuthContext.Provider>
  );
}