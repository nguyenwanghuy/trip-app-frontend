import React from 'react';
import { Link } from 'react-router-dom';
import NoProfile from '../assets/NoProfile.jpg';

const FriendsCard = ({ friends }) => {
  return (
    <div>
      <div className='w-full bg-first shadow-sm rounded-lg px-6 py-3'>
        <div className='flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]'>
          <span> Friends</span>
          <span>{friends?.length}</span>
        </div>

        <div className='w-full flex flex-col gap-4 pt-3'>
          {friends?.map((friend) => (
            <div key={friend?._id}>
              <Link
                to={'/trip/user/' + friend?._id}
                className='w-full flex gap-4 items-center cursor-pointer text-decoration-none'
              >
                <img
                  src={friend?.profileUrl ?? NoProfile}
                  alt={friend?.username}
                  className='w-10 h-10 object-cover rounded-full'
                />
                <div className='flex-1'>
                  <p className='text-base font-medium text-ascent-1 my-0'>
                    {friend.username}
                  </p>
                  <span className='text-sm text-ascent-2 my-0'>
                    {friend?.profession ?? 'No Profession'}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsCard;
