const getUser = () => {
  return JSON.parse(localStorage.getItem('user') as string);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export { getUser, getToken, getRefreshToken };
