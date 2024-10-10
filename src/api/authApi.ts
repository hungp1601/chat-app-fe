import axiosClient from './axiosClient';
import { LoginPayload, RefreshTokenPayload, SignUpPayload } from '../features/auth/authSlice';

const postAPI = {
  login(params: LoginPayload) {
    return axiosClient.post('/user/login', params);
  },

  signup(params: SignUpPayload) {
    return axiosClient.post('/user/register', params);
  },

  refreshToken(params: RefreshTokenPayload) {
    return axiosClient.post('/user/refresh-token', params);
  },
};

export default postAPI;
