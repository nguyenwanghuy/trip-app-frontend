import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Loading, TextInput } from '../components';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { apiRequest } from '../utils';
import { userLogin } from '../redux/userSlice';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const Register = () => {
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleShow = () => setShow(!show);
  const handleConfirmShow = () => setConfirmShow(!confirmShow);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const registerRes = await apiRequest({
        url: '/auth/register',
        data: data,
        method: 'POST',
      });

      if (registerRes?.status === 'failed') {
        setErrMsg(registerRes);
        setIsSubmitting(false);
        return;
      }

      const loginRes = await apiRequest({
        url: '/auth/login',
        data: { username: data.username, password: data.password },
        method: 'POST',
      });

      if (loginRes?.status === 'failed') {
        setErrMsg(loginRes.message);
      } else {
        const token = loginRes.token;
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
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-6/7 py-8 lg:py-0 flex bg-first flex-row-reverse rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 mx-10 p-1 md:mx-10 flex flex-col gap-2 justify-center'>
          <h2 className='font-bold text-2xl text-[#002D74]'>Register</h2>
          <p className='text-ascent-1 text-base font-semibold'>
            Create your account. It’s free and only take a minute
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FloatingLabel
              controlId='floatingFullname'
              label='Fullname'
              className='mb-3'
            >
              <Form.Control
                type='text'
                placeholder='Fullname'
                {...register('fullname', {
                  required: 'Fullname is required!',
                })}
                className='rounded-md border w-full'
              />
            </FloatingLabel>

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

            <FloatingLabel
              controlId='floatingEmail'
              label='Email Address'
              className='mb-3'
            >
              <Form.Control
                type='email'
                placeholder='Email Address'
                {...register('email', {
                  required: 'Email Address is required!',
                })}
                className='rounded-md border w-full'
              />
            </FloatingLabel>

            <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
              <div className='lg:w-[11.3rem] xl:w-[15.3rem]'>
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

              <div className=' lg:w-[11.3rem] xl:w-[15.3rem]'>
                <FloatingLabel
                  controlId='floatingConfirmPassword'
                  label='Confirm Password'
                  className='mb-3'
                >
                  <Form.Control
                    type={confirmShow ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    {...register('confirmPassword', {
                      validate: (value) => {
                        const { password } = getValues();
                        if (password !== value) {
                          return 'Password does not match';
                        }
                      },
                      required: 'Password is required!',
                    })}
                    className='rounded-md border w-full'
                  />
                </FloatingLabel>
              </div>
            </div>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status === 'failed'
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
                Register
              </button>
            )}

            <div
              className='mt-5 text-xs flex justify-between items-center text-[#002D74] border-t border-ascent-2 
            pt-3'
            >
              <p className='text-ascent-2'>Already have an account?</p>
              <Link to='/login' className='text-decoration-none'>
                <button className='py-2 px-5 bg-white border rounded-md hover:scale-110 duration-300'>
                  Login
                </button>
              </Link>
            </div>
          </form>
        </div>
        {/* RIGHT */}
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

export default Register;
