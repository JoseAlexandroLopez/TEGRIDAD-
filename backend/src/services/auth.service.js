import bcrypt from "bcrypt";
import { User } from "../entities/User.js";

export const registerUser = async (data) => {
  // 1. Comprobar si el correo ya existe en la tabla usuarios
  const exists = await User.findByEmail(data.email);

  if (exists) {
    throw new Error("Correo ya registrado");
  }

  // 2. Encriptar la contraseña
  const hash = await bcrypt.hash(data.password, 10);

  // 3. Crear el usuario en la base de datos
  const nuevoUserId = await User.create({
    nombre: data.nombre,
    email: data.email,
    password: hash,
    rol: "CLIENTE"
  });

  return { id: nuevoUserId, ...data };
};