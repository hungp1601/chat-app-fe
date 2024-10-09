import axiosClient from './axiosClient';
import { LoginPayload, SignUpPayload } from '../features/auth/authSlice';

const postAPI = {
  login(params: LoginPayload) {
    return axiosClient.post('/user/login', params);
  },

  signup(params: SignUpPayload) {
    return axiosClient.post('/user/register', params);
  },
};

export default postAPI;
