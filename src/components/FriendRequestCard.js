import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '../components';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
const FriendRequests = ({ friendRequest, handleAcceptFriendRequest }) => {
  const [friendPending, setFriendPending] = useState(friendRequest);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const socket = io('http://localhost:8001');
    socket.on('newFriend', (friendReq) => {
      if (friendReq.idRecipient === user._id) {
        setFriendPending((prevFriend) => [...prevFriend, friendReq]);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [friendRequest, user._id]);
  // console.log(friendPending);
  const handleAccept = (idReq) => {
    setFriendPending((prevFriend) =>
      prevFriend.filter((friend) => friend.idReq !== idReq),
    );
    handleAcceptFriendRequest(idReq);
  };
  return (
    <div className='w-full bg-first shadow-sm rounded-lg px-6 py-3'>
      <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
        <span> Friend Request</span>
        <span>{friendPending?.length}</span>
      </div>
      <div className='w-full flex flex-col gap-4 pt-4'>
        {friendPending?.map(
          ({ idRecipient, idReq, requestFrom, avatar, username }) => (
            <div key={idReq} className='flex items-center justify-between'>
              <Link
                to={'/trip/user/' + requestFrom}
                className='w-full flex gap-4 items-center cursor-pointer text-decoration-none'
              >
                <img
                  src={avatar}
                  alt={username}
                  className='w-10 h-10 object-cover rounded-full'
                />
                <div className='flex-1'>
                  <p className='text-base font-medium text-ascent-1'>
                    {username}
                  </p>
                </div>
              </Link>

              <div className='flex gap-1'>
                <CustomButton
                  title='Accept'
                  containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                  onClick={() => handleAccept(idReq, 'Accepted')}
                />
                <CustomButton
                  title='Deny'
                  containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                  onClick={() => handleAccept(idReq, 'Denied')}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
