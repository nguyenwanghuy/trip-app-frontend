import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { CommentForm, Loading, ReplyCard } from '../index';
import { io } from 'socket.io-client';
const Comment = ({
  user,
  post,
  loading,
  getComments,
  showComments,
  comments,
  setReplyComments,
  replyComments,
  setShowReply,
  showReply,
  handleLike,
  editComment,
  setEditComment,
  socket,
  setSocket,
  currentComment,
  setCurrentComment
}) => {
  const handleEditClick = (comment) => {
    setEditComment(comment);
  };
  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   const socket = io('http://localhost:8001');
  //   setSocket(socket);
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  // const [currentComment, setCurrentComment] = useState('');
  // useEffect(() => {
  //   if (socket) {
  //     socket.on('receive_comment', (data) => {
  //       console.log('Received comment:', data);
  //     });
  //   }
  // }, [socket]);
  //tao 1 cai state luu tru tat ca comment, trai mang comment hien tai va tat ca comment, setAllComment
  return (
    <div className='h-full'>
      <div className='w-full border-t border-[#66666645]'>
        <CommentForm
          user={user}
          id={post?._id}
          getComments={() => getComments(post?._id)}
          editComment={editComment}
          setEditComment={setEditComment}
          currentComment= {currentComment}
          setCurrentComment= {setCurrentComment}
          socket={socket}
          setSocket={setSocket}

        />

        {loading ? (
          <Loading />
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div className='w-full pt-3' key={comment._id}>
              <div className='flex gap-1 mb-1'>
                <Link
                  to={'/profile/' + comment?.userId?._id}
                  className='text-decoration-none'
                >
                  <img
                    src={comment?.user?.avatar}
                    alt={comment?.user.username}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                </Link>
                <div className='bg-[#DADDE1] px-3 py-1 rounded-xl'>
                  <Link
                    to={'/profile/' + comment?.userId?._id}
                    className='text-decoration-none'
                  >
                    <p className='font-medium text-base text-ascent-1 my-0'>
                      {comment?.user?.username}
                    </p>
                  </Link>
                  <p className='text-ascent-2  my-0'>{comment.description}</p>
                </div>
              </div>

              <div className='ml-12'>
                <div className='mt-2 flex gap-6'>
                  <span className='text-ascent-2 text-sm'>
                    {moment(comment?.createdAt).fromNow()}
                  </span>
                  <p className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'>
                    {comment?.likes?.includes(user?._id) ? (
                      <BiSolidLike size={20} color='blue' />
                    ) : (
                      <BiLike size={20} />
                    )}
                    {comment?.likes?.length} Likes
                  </p>
                  <span
                    className='text-blue cursor-pointer'
                    onClick={() => setReplyComments(comment._id)}
                  >
                    Reply
                  </span>

                  {user?._id === comment?.user?._id && (
                    <span
                      className='text-blue cursor-pointer'
                      onClick={() => handleEditClick(comment)}
                    >
                      Edit
                    </span>
                  )}
                </div>

                {replyComments === comment._id && (
                  <CommentForm
                    user={user}
                    id={comment._id}
                    replyAt={comment.user._id}
                    getComments={() => getComments(post._id)}
                  />
                )}
              </div>

              {/* REPLIES */}
              <div className='px-14 mt-1'>
                {comment?.replies?.length > 0 && (
                  <p
                    className='text-base text-ascent-1 cursor-pointer'
                    onClick={() =>
                      setShowReply(showReply === comment._id ? 0 : comment._id)
                    }
                  >
                    Show Replies ({comment?.replies?.length})
                  </p>
                )}

                {showReply === comment._id &&
                  comment?.replies?.map((reply) => (
                    <ReplyCard
                      reply={reply}
                      user={user}
                      key={reply._id}
                      handleLike={() =>
                        handleLike(
                          `/posts/like-comment/${comment._id}/${reply._id}`,
                        )
                      }
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <span className='flex text-sm py-4 text-ascent-2 text-center'>
            No Comments, be the first to comment
          </span>
        )}
      </div>
    </div>
  );
};

export default Comment;
