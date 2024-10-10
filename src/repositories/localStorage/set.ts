const setUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const setToken = (token: any) => {
  localStorage.setItem('token', token);
};

const setRefreshToken = (refreshToken: any) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export { setUser, setToken, setRefreshToken };
