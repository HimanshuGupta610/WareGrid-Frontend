export const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    return null;
  }
};

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() < exp * 1000;
  } catch (err) {
    return false;
  }
};
export const isAdmin = () => {
  const payload = getTokenPayload();
  return payload?.role === 'admin';
};

export const getUsername = () => {
  const payload = getTokenPayload();
  return payload?.username || null;
};

export const getRole = () => {
  const payload = getTokenPayload();
  return payload?.role || null;
};
