const clearToken = () => {
  localStorage.removeItem('token');
};

const clearUser = () => {
  localStorage.removeItem('user');
};

const clearRefreshToken = () => {
  localStorage.removeItem('refreshToken');
};

export { clearToken, clearUser, clearRefreshToken };
