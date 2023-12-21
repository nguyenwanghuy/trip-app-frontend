import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Loading, TextInput } from '../components';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { apiRequest } from '../utils';
import { userLogin } from '../redux/userSlice';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const Login = () => {
  const [show, setShow] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleShow = () => setShow(!show);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const loginUser = (data) => {
    return async (dispatch) => {
      setIsSubmitting(true);

      try {
        const res = await apiRequest({
          url: '/auth/login',
          data: data,
          method: 'POST',
        });

        if (res?.status === 'failed' || !res.token) {
          console.log(res);
          setErrMsg({
            status: 'failed',
            message: res.message || 'Invalid credentials',
          });
        } else {
          const token = res.token;
          const profileResponse = await apiRequest({
            url: '/auth/me',
            token: token,
            method: 'GET',
          });
          if (profileResponse) {
            const payload = {
              token,
              ...profileResponse,
            };

            dispatch(userLogin(payload));
            navigate('/');
          }
        }
        setIsSubmitting(false);
      } catch (error) {
        console.error('Login error:', error);
        setIsSubmitting(false);
        setErrMsg({
          status: 'failed',
          message: 'An error occurred during login.',
        });
      }
    };
  };

  const onSubmit = async (data) => {
    try {
      const isValid = await trigger();
      if (isValid) {
        dispatch(loginUser(data));
      }
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-6/7 py-8 lg:py-0 flex bg-first rounded-xl overflow-hidden shadow-xl'>
        {/* Left */}

        <div className='w-full lg:w-1/2 mx-10 p-1 md:mx-10 flex flex-col gap-2 justify-center'>
          <h2 className='font-bold text-2xl text-[#002D74]'>Login</h2>
          <p className='text-ascent-1 text-base font-semibold'>
            If you are already a member, easily log in
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FloatingLabel
              controlId='floatingUsername'
              label='Username'
              className='mb-3'
            >
              <Form.Control
                type='text'
                placeholder='Username'
                {...register('username', {
                  required: 'Username is required!',
                })}
                className='rounded-md border w-full'
              />
            </FloatingLabel>

            <div>
              <FloatingLabel
                controlId='floatingPassword'
                label='Password'
                className='mb-3'
              >
                <Form.Control
                  type={show ? 'text' : 'password'}
                  placeholder='Password'
                  {...register('password', {
                    required: 'Password is required!',
                  })}
                  className='rounded-md border w-full'
                />
              </FloatingLabel>
            </div>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status == 'failed'
                    ? 'text-[#f64949fe]'
                    : 'text-[#2ba150fe]'
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <button
                className='bg-[#002D74] w-full rounded-md text-white py-2 mt-5  hover:scale-105 duration-300'
                type='submit'
              >
                Login
              </button>
            )}
          </form>

          <Link
            to='/reset-password'
            className='text-xs border-b border-ascent-2 py-4 text-decoration-none'
          >
            <span className='text-ascent-2'>Forgot your password?</span>
          </Link>
          <div className='mt-3 text-xs flex justify-between align-middle items-center '>
            <p className='text-ascent-2 pt-3'>Don't have an account?</p>
            <Link to='/register' className='text-decoration-none'>
              <button className='py-2 px-5 bg-white border rounded-md hover:scale-110 duration-300'>
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Right */}

        <div className='md:block hidden w-1/2 h-full'>
          <img
            className='rounded-xl h-full w-full'
            src='https://e0.pxfuel.com/wallpapers/806/121/desktop-wallpaper-travel-with-air-balloons-iphone-7-lock-screen-iphone-7.jpg'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
