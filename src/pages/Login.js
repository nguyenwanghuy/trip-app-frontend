import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Loading, TextInput } from '../components';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { apiRequest } from '../utils';
import { userLogin } from '../redux/userSlice';

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

        if (res?.status === 'failed') {
          setErrMsg(res.message);
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
      }
    };
  };

  const onSubmit = async (data, e) => {
    try {
      e.preventDefault();
      const isValid = await trigger();
      if (isValid) {
        dispatch(loginUser(data));
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 p-1 md:px-16 px-20  flex flex-col gap-2 justify-center '>
          <h2 className='font-bold text-2xl text-[#002D74]'>Login</h2>
          <p className='text-ascent-1 text-base font-semibold'>
            If you are already a member, easily log in
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name='username'
              placeholder='Username...'
              label='Username'
              type='text'
              register={register('username', {
                required: 'Username is required!',
              })}
              styles='rounded-md border w-full'
              labelStyle='ml-2'
              error={errors.username ? errors.username.message : ''}
            />

            <div className='relative'>
              <TextInput
                name='password'
                placeholder='Password'
                label='Password'
                type={show ? 'text' : 'password'}
                register={register('password', {
                  required: 'Password is required!',
                })}
                styles='rounded-md border w-full'
                labelStyle='ml-2'
                error={errors.password ? errors.password.message : ''}
              />

              <button
                onClick={handleShow}
                className=' absolute top-[3.2rem] right-3 -translate-y-1/2 text-ascent-2'
              >
                {show ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>

            {errMsg.message && (
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
        </div>
        {/* RIGHT */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center '>
          <div className='relative w-full flex items-center justify-center'>
            <img
              src='https://e0.pxfuel.com/wallpapers/806/121/desktop-wallpaper-travel-with-air-balloons-iphone-7-lock-screen-iphone-7.jpg'
              alt='Bg Image'
              className='w-100 2xl:w-full h-100 2xl:h-full rounded-xl object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
