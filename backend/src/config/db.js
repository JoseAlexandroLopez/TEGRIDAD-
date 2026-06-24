import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear el Pool de conexiones usando tus variables exactas del .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- MODO DEMO: DESACTIVAMOS LA PRUEBA DE CONEXIÓN INICIAL ---
// Comentamos esto para que Render no se rompa al no encontrar la BD local
/*
pool.getConnection()
  .then(connection => {
    console.log(`✅ Conectado a la base de datos MySQL (${process.env.DB_DATABASE})`);
    connection.release(); // Importante liberar la conexión
  })
  .catch(err => {
    console.error('❌ Error fatal al conectar a la base de datos:', err.message);
  });
*/

console.log("⚠️ Base de datos en espera (Prueba de conexión inicial desactivada para el Modo Demo)");

export default pool;