import { registerUser } from '../services/auth.service.js';
import { User } from '../entities/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- REGISTRO ---
export const register = async (req, res) => {
  console.log("👉 1. ¡La petición de registro llegó al controlador!");
  try {
    const { nombre, email, password } = req.body;
    console.log("👉 2. Datos que llegaron del formulario:", { nombre, email });

    console.log("👉 3. Saltando al servicio auth.service.js...");
    const nuevoUsuario = await registerUser(req.body);
    
    console.log("👉 4. ¡Servicio ejecutado con éxito!");
    return res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      usuarioId: nuevoUsuario.id 
    });
  } catch (error) {
    console.log("❌ OCURRIÓ UN ERROR EN EL CONTROLADOR:");
    console.error(error); // Esto imprimirá el error completo en la terminal
    return res.status(400).json({ mensaje: error.message });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario en MySQL
    const usuario = await User.findByEmail(email);
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Validar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Firmar Token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret_key_temporal',
      { expiresIn: '24h' }
    );

    return res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    return res.status(500).json({ mensaje: 'Error interno en el servidor' });
  }
};