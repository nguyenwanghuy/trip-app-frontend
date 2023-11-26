import React, { useState } from 'react';
import { Modal } from 'antd';
import { useForm, useWatch } from 'react-hook-form';

import Loading from '../Loading';
import CustomButton from '../CustomButton';
import TextInput from '../TextInput';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditProfileForm = ({
  isVisible,
  onCancel,
  onSubmit,
  isSubmitting,
  errMsg,
  defaultValues,
  user,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: { ...user },
  });
  const [error, setError] = useState(false);

  //valid form
  const handleFormValid = (data) => {
    const formValid = Object.values(data).every((e) => !!e);
    if (formValid) {
      onSubmit(data);
      toast.success(' Update thông tin thành công!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      setError(true);
    }
  };
  //gender
  const gender = useWatch({
    control,
    name: 'gender',
  });

  return (
    <>
      <Modal
        title='Edit Profile'
        visible={isVisible}
        onCancel={onCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(handleFormValid)}>
          <TextInput
            name='fullname'
            label='Fullname'
            placeholder='...'
            type='text'
            styles='w-full'
            register={register('fullname')}
          />
          <TextInput
            name='age'
            label='Age'
            placeholder='...'
            type='number'
            styles='w-full'
            register={register('age')}
          />

          <TextInput
            name='Dob'
            label='Date of birth'
            placeholder='...'
            type='date'
            styles='w-full'
            register={register('DateOfBirth')}
          />

          <div>
            <label className='block text-base text-ascent-2 mb-1'>
              Gender{' '}
            </label>
            <label className='inline-flex items-center gap-2'>
              <input
                className='flex-1 w32'
                type='checkbox'
                name='gender'
                value='Male'
                checked={gender === 'Male'}
                onChange={() => setValue('gender', 'Male')}
              />
              <span className='text-base  '>Male</span>
            </label>
            <label className='inline-flex items-center gap-2'>
              <input
                className='flex-1 w32 ml-5'
                type='checkbox'
                name='gender'
                value='Female'
                checked={gender === 'Female'}
                onChange={() => setValue('gender', 'Female')}
              />
              <span className='text-base '>Female</span>
            </label>
          </div>
          <TextInput
            name='description'
            label='Description'
            placeholder='...'
            type='text'
            styles='w-full'
            register={register('description')}
          />
          <TextInput
            name='location'
            label='Location'
            placeholder='...'
            type='text'
            styles='w-full'
            register={register('location')}
          />
          <TextInput
            name='profession'
            label='Profession'
            placeholder='...'
            type='text'
            styles='w-full'
            register={register('profession')}
          />

          <div className='py-5 sm:flex sm:flex-row-reverse justify-center border-t border-[#66666645]'>
            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title='Submit'
              />
            )}
          </div>
          {error && (
            <span className='text-lg font-semibold text-[#f64949fe] mt-2.5 flex justify-center'>
              Vui lòng nhập đầy đủ thông tin.
            </span>
          )}
        </form>
      </Modal>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
};

export default EditProfileForm;
