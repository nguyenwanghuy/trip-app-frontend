import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BsThreeDots } from 'react-icons/bs';
import { Button, Dropdown, Space } from 'antd';
import { MdPublic } from 'react-icons/md';
import { FaLock, FaUserFriends } from 'react-icons/fa';

const PostHeader = ({ post, user, deletePost, handleUpdate, newData }) => {
  const isCurrentUserPost = user._id === post.user._id;

  const menuItems = [
    {
      label: <a href={`https://www.example.com/${post._id}`}>View Details</a>,
      key: 'viewDetails',
    },
    {
      type: 'divider',
    },
    isCurrentUserPost && {
      label: 'Update',
      key: 'update',
      onClick: () => handleUpdate(post),
    },
    isCurrentUserPost || user.admin === true && {
      label: 'Delete',
      key: 'delete',
      onClick: () => deletePost(post._id),
    },
  ].filter(Boolean);

  const visibilityIcons = {
    public: <MdPublic />,
    private: <FaLock />,
    friends: <FaUserFriends />,
  };

  return (
    <div className='flex gap-3 items-center mb-2'>
      <Link to={'/trip/user/' + post.user?._id}>
        <img
          src={post.user?.avatar}
          alt={post?.userId?.firstName}
          className='w-14 h-15 object-cover rounded-full'
        />
      </Link>

      <div className='w-full flex justify-between'>
        <div>
          <Link to={'/trip/user/' + post.user?._id}>
            <p className='font-medium text-lg text-ascent-1 flex gap-3 items-center'>
              {post.user?.username || post.user}
              <span className='text-ascent-2'>
                {visibilityIcons[post.visibility]}
              </span>
            </p>
          </Link>
          <span className='text-ascent-2'>
            {moment(post?.createdAt ?? Date.now()).fromNow()}
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
  );
};

export default PostHeader;
