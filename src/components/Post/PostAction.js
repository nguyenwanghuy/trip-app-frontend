import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { IoEyeSharp } from 'react-icons/io5';
import { fetchVacations } from '../../utils';

const PostAction = ({
  user,
  post,
  vacation,
  showComments,
  setShowComments,
  getComments,
  handleLike,
  fetchVacation,
}) => {
  const handleLikeClick = async () => {
    if (vacation.milestones) {
      const likedPost = vacation.milestones
        .flatMap((milestone) => milestone.posts)
        .find((p) => p._id === post._id);

      if (likedPost) {
        const uri = `/post/like/${likedPost._id}`;
        await handleLike(uri);
        fetchVacation();
      }
    }
  };

  return (
    <div className='mt-4 flex justify-between items-center px-3 pt-2 text-ascent-2 text-base border-t border-[#66666645] mb-0 pb-0'>
      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={handleLikeClick}
      >
        {post.likes.includes(user?._id) ? (
          <BiSolidLike size={20} color='blue' />
        ) : (
          <BiLike size={20} />
        )}
        {post?.likes?.length} Likes
      </p>

      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => {
          setShowComments(showComments === post?._id ? null : post?._id);
          getComments(post?._id);
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
