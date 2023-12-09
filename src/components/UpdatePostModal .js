import React, { useState } from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';

const UpdatePostModal = ({
  post,
  updatePost,
  onClose,
  initialFile,
  initialDescription,
}) => {
  const { user } = useSelector((state) => state.user);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(post.content);
  const [images, setImages] = useState(post.image || []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const postData = {
        description,
        content,
        image: images,
      };

      await updatePost(post._id, postData);

      setDescription('');
      setContent('');
      setImages([]);
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title='Update Post'
      visible={true}
      onOk={handleOk}
      okButtonProps={{
        className: 'custom-ok-button',
      }}
      confirmLoading={confirmLoading}
      onCancel={onClose}
      width='50%'
      centered={true}
    >
      <form className='bg-first px-4 rounded-lg'>
        <div className='w-full items-center gap-2 py-4'>
          <div className='flex gap-4'>
            <div>
              <img
                src={user?.avatar}
                alt={user.username}
                className='w-16 h-16 object-cover rounded-full'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='font-medium text-lg text-ascent-1'>
                {user.username}
              </div>
            </div>
          </div>
          <ul className='flex my-4 gap-4'>
            {images.map((image, index) => (
              <li key={index} className='relative'>
                <img
                  className='h-20 w-20'
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt={`Selected Image ${index}`}
                />
                <button
                  type='button'
                  className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                  onClick={() => handleRemoveImage(index)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>

          <input
            className='w-full py-3 my-2 border-b border-[#66666645] focus:outline-none'
            type='text'
            placeholder='Nhập tiêu đề...'
            {...register('description', {
              required: 'Write something about post',
            })}
            defaultValue={initialDescription}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <span className='text-sm text-red-500'>
              {errors.description.message}
            </span>
          )}
          <ReactQuill
            theme='snow'
            value={content}
            onChange={(value) => {
              setValue('content', value);
              setContent(value);
            }}
            name='content'
            className='h-20 mb-11'
          />
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePostModal;
