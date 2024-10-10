import { all, put, call, fork, take } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authAction, LoginPayload, SignUpPayload } from './authSlice';
import authApi from '../../api/authApi';
import { AxiosResponse } from 'axios';
import { getRefreshToken, getToken, getUser } from '../../repositories/localStorage/get';
import { setToken, setUser, setRefreshToken } from '../../repositories/localStorage/set';
import { User } from '../../models/user';
import { push } from 'connected-react-router';
import { clearRefreshToken, clearToken, clearUser } from '../../repositories/localStorage/clear';

function* handleLogin(payload: LoginPayload) {
  try {
    const response: AxiosResponse = yield call(authApi.login, payload);

    const { token, user, refreshToken } = response.data;

    setToken(token);
    setRefreshToken(refreshToken);
    console.log({});
    const newUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      last_message_id: null,
    };
    setUser(newUser);
    yield put(authAction.loginSuccess(newUser));
    yield put(push('/list'));
  } catch (error: any) {
    const { response }: { response: AxiosResponse } = error;
    yield put(authAction.logout());
    if ([422, 401].indexOf(response?.status) >= 0) {
      yield put(authAction.loginFailed('Tài khoản hoặc mật khẩu không chính xác'));
    } else {
      yield put(authAction.loginFailed('Đã có lỗi xảy ra'));
    }
  }
}

function* handleSignUp(payload: SignUpPayload) {
  try {
    const response: AxiosResponse = yield call(authApi.signup, payload);
    console.log({ response });

    const { token, user, refreshToken } = response.data;
    setToken(token);
    setRefreshToken(refreshToken);
    const newUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      last_message_id: null,
    };
    setUser(newUser);
    yield put(authAction.loginSuccess(newUser));
    yield put(push('/list'));
  } catch (error: any) {
    const { response }: { response: AxiosResponse } = error;
    yield put(authAction.logout());
    if ([422, 401].indexOf(response?.status) >= 0) {
      yield put(authAction.loginFailed('Thông tin đăng ký đã bị trùng'));
    } else {
      yield put(authAction.loginFailed('Đã có lỗi xảy ra'));
    }
  }
}

function* handleRefreshToken() {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      yield take(authAction.logout.type);
      yield call(handleLogout);
      return;
    }
    console.log('calling');
    let response: AxiosResponse;
    try {
      response = yield call(authApi.refreshToken, { token: refreshToken });
      console.log({ response });

      const { token, user, refreshToken: newRefreshToken } = response.data;

      setToken(token);
      setRefreshToken(newRefreshToken);
      const newUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        last_message_id: null,
      };
      setUser(newUser);
      yield put(authAction.loginSuccess(newUser));
    } catch (error: any) {
      console.log('handleRefreshToken', error);
      clearUser();
      clearToken();
      clearRefreshToken();
      yield put(push('/sign-in'));
    }
  } catch (error: any) {
    console.log('handleRefreshToken', error);
    clearUser();
    clearToken();
    clearRefreshToken();
    yield put(push('/sign-in'));
  }
}

function* listenRefreshTokenFlow() {
  while (true) {
    yield take(authAction.refreshToken.type);
    yield call(handleRefreshToken);
  }
}

function* handleLogout() {
  clearUser();
  clearToken();
  clearRefreshToken();
  yield put(push('/sign-in'));
}

function* listenLoginFlow() {
  /*
    authAction.login.type : "auth/login"
   */
  while (true) {
    const isLoggedIn = Boolean(getToken());
    const currentUser = Boolean(getUser());
    if (!isLoggedIn && !currentUser) {
      const action: PayloadAction<LoginPayload> = yield take(authAction.login.type);
      yield fork(handleLogin, action.payload);
    }

    yield take(authAction.logout.type);
    yield call(handleLogout);
  }
}

function* listenSignUpFlow() {
  /*
    authAction.login.type : "auth/login"
   */
  while (true) {
    const isLoggedIn = Boolean(getToken());
    const currentUser = Boolean(getUser());
    if (!isLoggedIn && !currentUser) {
      const action: PayloadAction<SignUpPayload> = yield take(authAction.signup.type);
      yield fork(handleSignUp, action.payload);
    }

    yield take(authAction.logout.type);
    yield call(handleLogout);
  }
}

export default function* authSaga() {
  yield all([listenLoginFlow(), listenSignUpFlow(), listenRefreshTokenFlow()]);
}
