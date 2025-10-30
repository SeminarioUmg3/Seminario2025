// Funciones reutilizables de validación para formularios de autenticación

export function validateEmail(email) {
  // Solo acepta correos que terminan en .com
  return /^[^\s@]+@[^\s@]+\.com$/.test(email);
}

export function validateStrongPassword(password) {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

export function validateName(name) {
  return typeof name === 'string' && name.trim().length >= 3;
}

export function validateRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}
