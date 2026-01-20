import { jwtDecode } from 'jwt-decode';

export const getCurrentUserFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      nombreUsuario: decoded.nombreUsuario,
      rol: decoded.rol,
      // otros datos del token
    };
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};
