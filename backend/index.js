import app from './src/services/server.js'; // SIn llaves, porque es export default
import dotenv from 'dotenv';
import './src/config/db.js'; // Despierta la conexión a MySQL

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor unificado corriendo en http://localhost:${PORT}`);
});