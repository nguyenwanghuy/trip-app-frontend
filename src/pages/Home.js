import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import {
  FriendsCard,
  Loading,
  ProfileCard,
  NavBar,
  Weather,
  Ads,
} from '../components';
import { useForm } from 'react-hook-form';
import {
  apiRequest,
  deleteVacation,
  fetchPostsByPage,
  getUserInfo,
  handleFileUpload,
  sendFriendRequest,
  handleTokenRefresh,
} from '../utils';
import UseFunction from '../components/Function/UseFunction';
import { userLogin } from '../redux/userSlice';
import UpdatePostModal from '../components/UpdatePostModal ';
import FriendRequests from '../components/FriendRequestCard';
import SuggestedFriends from '../components/SuggestedFriends';
import { Card, Pagination } from 'antd';
import { SetPosts } from '../redux/postSlice';
import VacationCard from '../components/VacationCard';
import VacationForm from '../components/Form/VacationForm';
import UpdateVacationModal from '../components/Modal/UpdateVacationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { vacations } = useSelector((state) => state.vacations);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [show, setShow] = useState(true);
  const [selectedVacation, setSelectedVacation] = useState({});
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const {
    handleLikePost,
    fetchPost,
    handleDeletePost,
    fetchVacation,
    handleLikeVacation,
  } = UseFunction();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // console.log(posts);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPostsByPage(user?.token, dispatch, newPage, itemsPerPage);
  };

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFile([...file, ...selectedFiles]);
  };

  const PostVisibility = {
    PRIVATE: 'private',
    PUBLIC: 'public',
    FRIENDS: 'friends',
  };
  //1
  const handleVacationSubmit = async (
    data,
    selectedFriends,
    participants,
    visibility,
    startDate,
    endDate,
    milestones,
  ) => {
    setPosting(true);
    setErrMsg('');

    try {
      const uploadedFiles = await Promise.all(
        file.map(async (file) => {
          const uri = await handleFileUpload(file);
          return uri;
        }),
      );

      const newData = {
        ...data,
        image: uploadedFiles,
        visibility:
          visibility === 'isPrivate'
            ? PostVisibility.PRIVATE
            : visibility === 'isPublic'
            ? PostVisibility.PUBLIC
            : PostVisibility.FRIENDS,
        viewers: selectedFriends,
        startDate,
        endDate,
        participants,
        milestones,
      };

      const res = await handleTokenRefresh({
        url: '/vacation/',
        token: user?.token,
        data: newData,
        method: 'POST',
      });

      if (res?.status === 'failed') {
        setErrMsg(res.message);
      } else {
        reset({
          description: '',
          content: '',
          location: '',
        });
        setFile([]);
        setErrMsg('');
        await fetchVacation();
        toast.success('Upload vacation successfully');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrMsg('An error occurred while submitting the post.');
    } finally {
      setPosting(false);
    }
  };
  const updatePost = async (vacationId, editData) => {
    try {
      const newData = {
        ...editData,
      };

      const res = await handleTokenRefresh({
        url: `/vacation/${vacationId}`,
        token: user?.token,
        data: newData,
        method: 'PUT',
      });

      if (res?.status === 'failed') {
        console.error('Post update failed:', res.message);
      } else {
        fetchVacation();
        toast.success('Edit vacation successfully');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleUpdatePost = (vacation) => {
    setSelectedVacation(vacation);
    setUpdateModalOpen(true);
  };

  const handleDeleteVacation = async (vacationId) => {
    try {
      setLoading(true);
      await deleteVacation(vacationId, user?.token);
      await fetchVacation(user?.token, dispatch);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
      toast.success('Delete vacation successfully');
    }
  };

  const fetchSuggestedRequests = async () => {
    try {
      const res = await handleTokenRefresh({
        url: '/user/suggest/u',
        token: user?.token,
        method: 'GET',
      });
      setSuggestedFriends(res.data);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
      await fetchSuggestedRequests();
      return res.data._id;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchFriendRequest = async () => {
    try {
      const res = await handleTokenRefresh({
        url: '/test/get-friend-request',
        token: user.token,
        method: 'POST',
      });
      setFriendRequest(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async (token) => {
    try {
      const res = await getUserInfo(user.token);
      const newData = { token: user.token, ...res };
      dispatch(userLogin(newData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptFriendRequest = async (id, status) => {
    try {
      const res = await handleTokenRefresh({
        url: '/test/accept-request',
        token: user.token,
        method: 'POST',
        data: { rid: id, status },
      });
      setFriendRequest(res.data);
      getUser();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPost();
    fetchVacation();
    fetchSuggestedRequests();
    handleFriendRequest();
    handleAcceptFriendRequest();
    handleFetchFriendRequest();
    getUser();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await handleTokenRefresh({
        url: `/post?page=${currentPage}&pageSize=${itemsPerPage}`,
        token: user?.token,
        method: 'GET',
      });
      dispatch(SetPosts(res?.data));
      setTotalPages(res?.pagination.totalPages);
    };

    fetchData();
  }, [currentPage, itemsPerPage, dispatch, setTotalPages, user?.token]);

  return (
    <div className='w-full px-5 lg:px-10 2xl:px-20 bg-bgColor lg:rounded-lg h-screen pb-10 overflow-hidden '>
      <NavBar />

      <div className='w-full flex gap-2 lg:gap-4 pt-3 mb-14 pb-14 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/3 lg:w-1/5  md:flex flex-col gap-6 overflow-y-auto'>
          <ProfileCard user={user} />
          <FriendsCard friends={user.friends} />
          <Weather />
        </div>

        {/* CENTER */}
        <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
          <VacationForm
            user={user}
            handleVacationSubmit={handleVacationSubmit}
            handleFileChange={handleFileChange}
            posting={posting}
            errMsg={errMsg}
            setFile={setFile}
            file={file}
          />

          {loading ? (
            <Loading />
          ) : vacations?.length > 0 ? (
            <>
              {vacations
                .filter((vacation) => vacation?.viewers?.includes(user._id))
                .map((vacation) => (
                  <VacationCard
                    key={vacation?._id}
                    vacation={vacation}
                    user={user}
                    handleUpdate={updatePost}
                    handleUpdatePost={handleUpdatePost}
                    deleteVacation={handleDeleteVacation}
                    likeVacation={handleLikeVacation}
                  />
                ))}
            </>
          ) : (
            <div className='flex w-full h-full items-center justify-center'>
              <p className='text-lg text-ascent-2'>No Post Available</p>
            </div>
          )}
        </div>

        {updateModalOpen && (
          <UpdateVacationModal
            user={user}
            errMsg={errMsg}
            vacation={selectedVacation}
            updatePost={updatePost}
            onClose={() => setUpdateModalOpen(false)}
            setFile={setFile}
            file={file}
          />
        )}

        {/* RIGHT */}
        <div className='hidden w-1/5 h-full lg:flex flex-col gap-8 overflow-y-auto'>
          <FriendRequests
            friendRequest={friendRequest}
            handleAcceptFriendRequest={handleAcceptFriendRequest}
          />

          <SuggestedFriends
            suggestedFriends={suggestedFriends}
            handleFriendRequest={handleFriendRequest}
            setShow={setShow}
          />
          <Ads />
        </div>
      </div>
    </div>
  );
};

export default Home;
