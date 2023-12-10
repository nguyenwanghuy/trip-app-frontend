import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsPersonFillAdd } from 'react-icons/bs';
import { CustomButton } from '.';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SuggestedFriends = ({
  suggestedFriends,
  handleFriendRequest,
  setShow,
}) => {
  const { user } = useSelector((state) => state.user);
  // console.log(user);
const [socket, setSocket] = useState(null)
useEffect(() => {
  const newSocket = io('https://trip-app-backend.onrender.com/trip');
  setSocket(newSocket);
  newSocket.on('newFriend', (friendRequest) => {
    // console.log(friendRequest, 'newFriend event');
    toast.warn(` ${friendRequest.username} sent a friend request!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  });
  return () => {
    newSocket.disconnect();
  };
}, []);
    // const socket = io('http://localhost:8001');
    const handleAddFriend = async (friendId) => {
      try {
        const idReq = await handleFriendRequest(friendId);
        // console.log(friendId, 'friendID');
        // console.log(idReq, 'idReq');
        await socket.emit('friendReq', { idReq: idReq, idRecipient: friendId, requestFrom: user._id, avatar: user.avatar, username: user.username });
        setShow(false);
       
      } catch (error) {
        console.error(error);
      }
    };
  return (
    <div className='w-full bg-first shadow-sm rounded-lg px-4 py-3 '>
      <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
        <span>Friend Suggestion</span>
      </div>
      <div className='w-full gap-3 pt-3 flex flex-col'>
        {suggestedFriends?.map((friend) => (
          <div className='flex items-center justify-between' key={friend._id}>
            <Link
              to={`/trip/user/${friend._id}`}
              className='w-full flex gap-4 items-center cursor-pointer text-decoration-none'
            >
              <img
                src={friend?.avatar}
                alt={friend?.username}
                className='w-10 h-10 object-cover rounded-full'
              />
              <div className='flex-1'>
                <p className='text-base font-medium text-ascent-1 my-0'>
                  {friend?.username}
                </p>
                <span className='text-sm text-ascent-2'></span>
              </div>
            </Link>

            <div className='flex gap-1'>
              <button
                className='bg-[#0444a430] text-sm text-white p-1 rounded'
                onClick={() => {
                  handleAddFriend(friend._id);
                  setShow(false);
                }}
              >
                <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuggestedFriends;
