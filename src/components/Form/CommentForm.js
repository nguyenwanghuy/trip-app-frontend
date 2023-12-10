import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, Loading, CustomButton } from '../index';
import { apiRequest,handleTokenRefresh } from '../../utils';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { io } from 'socket.io-client';
import { Input } from 'antd';

const CommentForm = ({
  user,
  id,
  replyAt,
  getComments,
  editComment,  
  setEditComment,
  currentComment,
  setCurrentComment,
  socket,
  setSocket

}) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  // useEffect(() => {
  //   const socket = io('http://localhost:8001');
  //   setSocket(socket);
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    if (editComment) {
      setValue('description', editComment.description);
    }
  }, [editComment, setValue]);

  const onSubmit = async () => {
    setLoading(true);
    setErrMsg('');

    try {
      let URL, method;

      if (editComment) {
        URL = `/comment/${editComment._id}`;
        method = 'PUT';
      } else {
        URL = !replyAt ? '/comment/' + id : '/replyCmt/' + id;
        method = 'POST';
      }

      const newData = {
        description: currentComment,
        from: user.username,
        avatar:user.avatar,
        replyAt: replyAt,
      };

      // Gửi sự kiện 'send_comment' đến server
      socket.emit('send_comment', newData);

      const res = await handleTokenRefresh({
        url: URL,
        data: newData,
        token: user?.token,
        method: method,
      });

      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        if (editComment) {
          setEditComment(null);
        } else {
          reset({ description: '' });
        }
        setErrMsg('');
        await getComments();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setEditComment(null); // Ensure edit mode is cleared even on error
    }
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('receive_comment', (data) => {
  //       console.log('Received comment:', data);
    
  //     });
  //   }
  // }, [socket]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full border-b border-[#66666645]'
    >
      <div className='w-full flex items-center gap-2 py-4'>
        <img
          src={user.avatar}
          alt='User Image'
          className='w-10 h-10 rounded-full object-cover'
        />

        <div className='relative flex-grow'>
          <Input
            type='text'
            placeholder='Write a comment...'
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
          />

          <div className='absolute top-[0.1rem] right-0 h-full flex items-center pr-3'>
            {loading ? (
              <Loading />
            ) : (
              <CustomButton
                title='đăng'
                type='submit'
                // onClick={sendComment}
                containerStyles=' text-[#DADDE1] py-1 rounded-full font-semibold text-xl pr-2'
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;