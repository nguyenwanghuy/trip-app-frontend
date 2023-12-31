import React, { useEffect, useState } from 'react';
import { Loading, PostCard, ProfileCard } from '../../components/index';
import { useParams } from 'react-router-dom';
import { apiRequest, handleTokenRefresh } from '../../utils';
import InfoProfileCard from '../InfoProfileCard';
import VacationCard from '../VacationCard';

const PostProfile = ({ user, UserId, userInfo }) => {
  const [loading, setLoading] = useState(true);
  const [vacations, setVacations] = useState({});

  // console.log(userInfo);

  const handleDelete = () => {};

  const handleLikePost = () => {};

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await handleTokenRefresh({
          url: `/vacation/${UserId}`,
          token: user.token,
          method: 'GET',
        });
        setVacations(res?.vacations);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [UserId, user.token]);

  return (
    <div className='w-full flex pt-2 pb-10 h-full gap-6 '>
      <div className='hidden md:w-1/3 md:block'>
        <InfoProfileCard user={userInfo} />
      </div>
      <div className='w-2/3 flex-1 h-full bg-orimary flex flex-col gap-4'>
        {loading ? (
          <Loading />
        ) : vacations && vacations.length > 0 ? (
          vacations.map((vacation) => (
            <VacationCard
              key={vacation?._id}
              vacation={vacation}
              // user={user}
              deletePost={handleDelete}
              likePost={handleLikePost}
              id={vacation?._id}
            />
          ))
        ) : (
          <div className='flex w-full h-full items-center justify-center'>
            <p className='text-lg text-ascent-2'>No Post Available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostProfile;
