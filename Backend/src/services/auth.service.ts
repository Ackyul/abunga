import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export const register = async (data: any) => {
  const { email, password, name } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('El correo ya está registrado');
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
    },
  });

  return user;
};

export const login = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  const secret = process.env.JWT_SECRET || 'secretKeyAbungaDefault';
  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '24h' });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
