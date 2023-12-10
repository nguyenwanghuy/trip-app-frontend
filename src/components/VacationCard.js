import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, likeVacation } from '../utils';
import PostImage from './Post/PostImage';
import moment from 'moment';
import { BsThreeDots } from 'react-icons/bs';
import { Dropdown, Space } from 'antd';
import { MdLockPerson, MdPublic } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';

// const getPostComments = async (id, token) => {
//   try {
//     const res = await apiRequest({
//       url: '/comment/' + id,
//       token: token,
//       method: 'GET',
//     });
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

const VacationCard = ({
  vacation,
  user,
  file,
  id,
  deleteVacation,
  handleUpdatePost,
  likeVacation,
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

  const getVisibilityIcon = () => {
    switch (vacation.visibility) {
      case 'private':
        return <MdLockPerson />;
      case 'public':
        return <MdPublic />;
      case 'friends':
        return <FaUserFriends />;
      default:
        return null;
    }
  };

  const handleLike = async (uri) => {
    await likeVacation(uri);
  };

  const isCurrentUserPost = user?._id === vacation.user?._id;

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
        <Link to={'/trip/user/' + vacation.user?._id}>
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
              <div className='font-medium text-lg flex text-ascent-1 mb-0 gap-2 items-center'>
                <span>{vacation.user?.username}</span>
                <span>{getVisibilityIcon()}</span>
              </div>
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

      <Link
        to={`/trip/vacation/${vacation._id}`}
        className='text-ascent-2 text-decoration-none'
      >
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
          <div>
            Date start: {moment(vacation.startDate).format('DD-MM-YYYY')}
          </div>
          <div>Date end: {moment(vacation.endDate).format('DD-MM-YYYY')}</div>
          <div>Location: {vacation.location}</div>
          <div>Participants: {vacation.participants?.length}</div>
        </div>
      </Link>

      <div className='mt-4 flex justify-between items-center px-3 pt-2 text-ascent-2 text-base border-t border-[#66666645] mb-0 pb-0'>
        <p
          className='flex gap-2 items-center text-base cursor-pointer'
          onClick={() => handleLike('vacation/like/' + vacation._id)}
        >
          {vacation.likes.includes(user?._id) ? (
            <BiSolidLike size={20} color='blue' />
          ) : (
            <BiLike size={20} />
          )}
          {vacation.likes.length} Likes
        </p>

        <p> view</p>
      </div>
    </div>
  );
};

export default VacationCard;
