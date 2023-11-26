// PostAction.js
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { IoEyeSharp } from 'react-icons/io5';

const PostAction = ({
  user,
  post,
  showComments,
  setShowComments,
  getComments,
  handleLike,
}) => {
  const handleLikeClick = (uri) => {
    handleLike(uri);
  };

  return (
    <div className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]'>
      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => handleLikeClick('/post/like/' + post._id)}
      >
        {post.likes.includes(user._id) ? (
          <BiSolidLike size={20} color='blue' />
        ) : (
          <BiLike size={20} />
        )}
        {post?.likes?.length} Likes
      </p>

      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => {
          setShowComments(showComments === post._id ? null : post._id);
          getComments(post._id);
        }}
      >
        <BiComment size={20} />
        {post?.comment?.length} Comments
      </p>
      <p className='flex gap-2 items-center text-base cursor-pointer'>
        <IoEyeSharp /> {post.views} view
      </p>
    </div>
  );
};

export default PostAction;
