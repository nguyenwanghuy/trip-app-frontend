import React, { useEffect, useState } from 'react';
import { apiRequest, likePost,handleTokenRefresh } from '../../utils';
import { Comment, PostAction, PostContent, PostHeader } from '../index';
import UpdatePostModal from '../UpdatePostModal ';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
const getPostComments = async (id, token) => {
  try {
    const res = await handleTokenRefresh({
      url: '/comment/' + id,
      token: token,
      method: 'GET',
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const PostCard = ({
  post,
  user,
  deletePost,
  likePost,
  updatePost,
  file,
  id,
  vacation,
  fetchVacation,
}) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [editComment, setEditComment] = useState(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io('http://localhost:8001');
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);
  const [currentComment, setCurrentComment] = useState('');
  useEffect(() => {
    const handleReceiveComment = (data) => {
      // console.log('Received comment:', data);
      setComments((prevComments) => [...prevComments, data]);
    };
    if (socket) {
      socket.on('receive_comment', handleReceiveComment);
    }

    return () => {
      if (socket) {
        socket.off('receive_comment', handleReceiveComment);
      }
    };
  }, [socket]);
  const getComments = async () => {
    setReplyComments(0);
    setLoading(true);
    try {
      const result = await getPostComments(post._id, user.token);
      setComments(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const incrementPostViewCount = async (postId) => {
    try {
      const res = await handleTokenRefresh({
        url: `/post/view/${postId}`,
        token: user.token,
        method: 'POST',
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (uri) => {
    await likePost(uri);
    await getComments(post?._id);
  };
  const handleUpdatePost = () => {
    setUpdateModalOpen(true);
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className='bg-first px-4 pt-4 my-7 rounded-xl'>
      <PostHeader
        deletePost={deletePost}
        user={user}
        handleUpdate={handleUpdatePost}
        post={post}
      />

      {showAll ? (
        <PostContent post={post} showAll={showAll} setShowAll={setShowAll} />
      ) : (
        <Link
          to={`/trip/post/${post._id}`}
          onClick={() => incrementPostViewCount(post._id)}
          className='text-decoration-none'
        >
          <PostContent post={post} showAll={showAll} setShowAll={setShowAll} />
        </Link>
      )}

      <PostAction
        user={user}
        post={post}
        vacation={vacation}
        showComments={showComments}
        setShowComments={setShowComments}
        getComments={getComments}
        handleLike={handleLike}
        fetchVacation={fetchVacation}
      />
      {showComments === post._id && (
        <Comment
          user={user}
          post={post}
          loading={loading}
          getComments={getComments}
          showComments={showComments}
          comments={comments}
          setReplyComments={setReplyComments}
          replyComments={replyComments}
          setShowReply={setShowReply}
          showReply={showReply}
          handleLike={handleLike}
          editComment={editComment}
          setEditComment={setEditComment}
          socket={socket}
          setSocket={setSocket}
          currentComment={currentComment}
          setCurrentComment={setCurrentComment}
        />
      )}

      {updateModalOpen && (
        <UpdatePostModal
          post={post}
          updatePost={updatePost}
          onClose={() => setUpdateModalOpen(false)}
          file={file}
          initialDescription={post.description}
        />
      )}
    </div>
  );
};

export default PostCard;
