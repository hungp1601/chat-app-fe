import React, { useCallback, useState } from 'react';
import {
  Link,
  Grid,
  Box,
  Typography,
  Container,
  TextField,
  CssBaseline,
  Button,
  Avatar,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import LoginStyle from '../styles/login';
import { useDispatch, useSelector } from 'react-redux';
import { authAction, SignUpPayload } from '../authSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { RootState } from '../../../app/store';
import Alert from '@material-ui/lab/Alert';

const initialValue: SignUpPayload = {
  email: '',
  name: '',
  password: '',
};

const SignUp: React.FC = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();
  const [isShowpassword, setIsShowPassword] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const handleSubmitForm = useCallback(
    (value) => {
      dispatch(authAction.signup(value));
    },
    [dispatch]
  );
  const toggleIsShowPassword = useCallback(() => {
    setIsShowPassword(!isShowpassword);
  }, [isShowpassword]);

  const schema = Yup.object().shape({
    email: Yup.string().required('Hãy nhập email').email('Hãy nhập định dạng email'),
    password: Yup.string()
      .required('Hãy nhập mật khẩu')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ cái viết hoa')
      .matches(/[a-z]/, 'Mật khẩu phải có ít nhất một chữ cái thường')
      .matches(/\d/, 'Mật khẩu phải có ít nhất một chữ số'),
    name: Yup.string().required('Hãy nhập tên tài khoản'),
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký
        </Typography>
        {auth.errors && (
          <Alert severity="error" onClose={() => {}}>
            {auth.errors}
          </Alert>
        )}

        <Formik
          onSubmit={handleSubmitForm}
          initialValues={initialValue}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={schema}
        >
          {(props) => (
            <Form className={classes.form}>
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Địa chỉ email"
                name="email"
                autoComplete="email"
                placeholder="Nhập địa chỉ email"
                error={!!props.errors.email}
                helperText={props.errors.email}
                autoFocus
              />
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Tên tài khoản"
                name="name"
                autoComplete="name"
                placeholder="Tên tài khoản"
                error={!!props.errors.name}
                helperText={props.errors.name}
                autoFocus
              />
              <Field
                as={TextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                type={isShowpassword ? 'text' : 'password'}
                id="password"
                error={!!props.errors.password}
                helperText={props.errors.password}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <Button onClick={toggleIsShowPassword}>
                      {isShowpassword ? <Visibility /> : <VisibilityOff />}
                    </Button>
                  ),
                }}
              />

              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                {auth.logging ? <CircularProgress color={'inherit'} /> : 'Đăng nhập'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Quên mật khẩu?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {'Bạn da có tài khoản? Đăng nhập ngay'}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
};

export default React.memo(SignUp);
