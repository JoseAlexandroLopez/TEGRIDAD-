import pool from '../config/db.js';

export const User = {
  // Buscar un usuario por su correo
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0]; // Retorna el usuario si existe, o undefined si no
  },

  // Crear un nuevo usuario
  create: async (userData) => {
    const { nombre, email, password, rol = 'cliente' } = userData;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password, rol]
    );
    return result.insertId; // Retorna el ID del nuevo usuario
  }
};