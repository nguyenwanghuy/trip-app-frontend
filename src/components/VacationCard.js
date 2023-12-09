import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils';
import PostContent from './Post/PostContent';
import PostImage from './Post/PostImage';
import moment from 'moment';
import { BsThreeDots } from 'react-icons/bs';
import { Dropdown, Space } from 'antd';

const getPostComments = async (id, token) => {
  try {
    const res = await apiRequest({
      url: '/comment/' + id,
      token: token,
      method: 'GET',
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const VacationCard = ({
  vacation,
  user,
  file,
  id,
  deleteVacation,
  handleUpdatePost,
}) => {
  const [showAll, setShowAll] = useState(0);

  // const incrementPostViewCount = async (postId) => {
  //   try {
  //     const res = await apiRequest({
  //       url: `/post/view/${postId}`,
  //       token: user.token,
  //       method: 'POST',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const isCurrentUserPost = user._id === vacation.user._id;

  const menuItems = [
    isCurrentUserPost && {
      label: 'Edit',
      key: 'edit',
      onClick: () => handleUpdatePost(vacation),
    },
    isCurrentUserPost && {
      label: 'Delete',
      key: 'delete',
      onClick: () => deleteVacation(vacation._id),
    },
  ].filter(Boolean);

  return (
    <div className='bg-first px-4 pt-4 rounded-xl'>
      <div className='flex gap-3 items-center mb-2'>
        <Link
          to={'/trip/user/' + vacation.user?._id}
          className='text-decoration-none'
        >
          <img
            src={vacation.user?.avatar}
            alt={vacation?.userId?.firstName}
            className='w-14 h-15 object-cover rounded-full'
          />
        </Link>

        <div className='w-full flex justify-between'>
          <div>
            <Link
              to={'/trip/user/' + vacation.user?._id}
              className='text-decoration-none'
            >
              <p className='font-medium text-lg text-ascent-1 mb-0'>
                {vacation.user?.username || post.user}
              </p>
            </Link>
            <span className='text-ascent-2'>
              {moment(vacation?.createdAt ?? Date.now()).fromNow()}
            </span>
          </div>

          <Dropdown
            menu={{
              items: menuItems,
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <BsThreeDots />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>

      <Link to={`/trip/vacation/${vacation._id}`} className='text-ascent-2'>
        <PostImage post={vacation} />
        <div className='font-bold text-left'>{vacation.title}</div>
        <div className='font-bold text-left'>
          {showAll === vacation?._id
            ? vacation?.description
            : vacation?.description?.slice(0, 300)}

          {vacation?.description?.length > 301 &&
            (showAll === vacation?._id ? (
              <span
                className='text-blue ml-2 font-medium cursor-pointer'
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className='text-blue ml-2 font-medium cursor-pointer'
                onClick={() => setShowAll(vacation?._id)}
              >
                Show More
              </span>
            ))}
        </div>
        <div>
          <div>Date start: {vacation.startDate}</div>
          <div>Date end: {vacation.endDate}</div>
          <div>Location: {vacation.location}</div>
        </div>
      </Link>

      {/* <PostAction
        user={user}
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        getComments={getComments}
        handleLike={handleLike}
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
        />
      )} */}
    </div>
  );
};

export default VacationCard;
