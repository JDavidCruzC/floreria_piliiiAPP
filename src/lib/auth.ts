import bcrypt from 'bcryptjs';
import { supabase } from '@/integrations/supabase/client';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const authenticateUser = async (codigo: string, password: string) => {
  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('codigo', codigo)
      .eq('activo', true)
      .single();

    if (error || !usuario) {
      return { success: false, error: 'Usuario no encontrado o inactivo' };
    }

    // Verificar si la contraseña está sin encriptar (migración)
    if (!usuario.password_hash.startsWith('$2b$')) {
      // Contraseña en texto plano, verificar directamente y luego encriptar
      if (usuario.password_hash === password) {
        // Encriptar la contraseña y actualizarla
        const hashedPassword = await hashPassword(password);
        await supabase
          .from('usuarios')
          .update({ password_hash: hashedPassword })
          .eq('id', usuario.id);
        
        return { success: true, usuario };
      } else {
        return { success: false, error: 'Credenciales incorrectas' };
      }
    } else {
      // Contraseña ya encriptada, verificar con bcrypt
      const isValid = await verifyPassword(password, usuario.password_hash);
      if (isValid) {
        return { success: true, usuario };
      } else {
        return { success: false, error: 'Credenciales incorrectas' };
      }
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
};

export const encryptAllPasswords = async () => {
  try {
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .not('password_hash', 'like', '$2b$%');

    if (error) throw error;

    for (const usuario of usuarios || []) {
      const hashedPassword = await hashPassword(usuario.password_hash);
      await supabase
        .from('usuarios')
        .update({ password_hash: hashedPassword })
        .eq('id', usuario.id);
    }

    console.log('Todas las contraseñas han sido encriptadas');
  } catch (error) {
    console.error('Error encriptando contraseñas:', error);
  }
};