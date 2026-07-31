export function validateRegisterInput(body) {
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return { error: 'email and password are required' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailPattern.test(email);

  if (!isValidEmail) {
    return { error: 'email format is invalid' };
  }

  if (password.length < 8) {
    return { error: 'password must contain at least 8 characters' };
  }

  return { data: { email, password } };
}

export function validateLoginInput(body) {
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return { error: 'email and password are required' };
  }

  return { data: { email, password } };
}
