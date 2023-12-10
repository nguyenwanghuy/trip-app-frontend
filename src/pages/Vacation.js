import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FriendsCard,
  Loading,
  ProfileCard,
  NavBar,
  PostForm,
  Weather,
  Ads,
  CustomButton,
  PostCard,
} from '../components';
import { useForm } from 'react-hook-form';
import {
  addMilestone,
  apiRequest,
  deleteMilestone,
  fetchPostsByPage,
  fetchVacations,
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
import moment from 'moment';
import { Button, Modal, Form, DatePicker, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vacation = () => {
  const { user } = useSelector((state) => state.user);
  const [vacation, setVacation] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [show, setShow] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const { handleLikePost, handleDeletePost } = UseFunction();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [addMilestoneModalVisible, setAddMilestoneModalVisible] =
    useState(false);

  const { id } = useParams();
  const [form] = Form.useForm();
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

  const disabledDate = (currentDate) => {
    const milestoneDates = vacation.milestones.map((milestone) =>
      moment(milestone.date).startOf('day'),
    );
    return (
      currentDate.isBefore(moment(vacation.startDate).startOf('day')) ||
      currentDate.isAfter(moment(vacation.endDate).startOf('day')) ||
      milestoneDates.some((date) => date.isSame(currentDate, 'day'))
    );
  };

  const fetchVacation = async () => {
    try {
      const res = await handleTokenRefresh({
        url: `/vacation/users/${id}`,
        token: user.token,
        method: 'GET',
      });
      res.data.milestones.sort(
        (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf(),
      );

      setVacation(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFile([...file, ...selectedFiles]);
  };

  const handleAddMilestone = async (milestoneData) => {
    try {
      const newMilestone = await addMilestone(
        user.token,
        vacation._id,
        milestoneData,
      );
      setVacation((prevVacation) => ({
        ...prevVacation,
        milestones: [...prevVacation.milestones, newMilestone],
      }));

      toast.success('Milestone added successfully');
    } catch (error) {
      console.error('Error handling add milestone:', error);
    } finally {
      form.resetFields(['date', 'description']);
      setAddMilestoneModalVisible(false);
      await fetchVacation();
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await deleteMilestone(user.token, vacation._id, milestoneId);
      toast.success('Milestone deleted successfully');
      setVacation((prevVacation) => ({
        ...prevVacation,
        milestones: prevVacation.milestones.filter(
          (milestone) => milestone._id !== milestoneId,
        ),
      }));
    } catch (error) {
      console.error('Error handling delete milestone:', error);
      toast.error('Error deleting milestone');
    }
  };

  const confirmDeleteMilestone = (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      handleDeleteMilestone(milestoneId);
    }
  };

  const PostVisibility = {
    PRIVATE: 'private',
    PUBLIC: 'public',
    FRIENDS: 'friends',
  };
  //1
  const handlePostSubmit = async (data, selectedMilestone) => {
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
        milestoneId: selectedMilestone._id,
      };

      const res = await handleTokenRefresh({
        url: '/post/',
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
        window.location.reload();
      }

      console.log(res);
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrMsg('An error occurred while submitting the post.');
    } finally {
      setPosting(false);
    }
  };
  const updatePost = async (postId, data) => {
    try {
      const newData = {
        ...data,
      };

      console.log(newData);

      const res = await handleTokenRefresh({
        url: `/post/${postId}`,
        token: user?.token,
        data: newData,
        method: 'PUT',
      });
      console.log(res);

      if (res?.status === 'failed') {
        console.error('Post update failed:', res.message);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating post:', error);
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

  const handleOpenDeleteMilestoneModal = (milestoneId) => {
    handleDeleteMilestone(milestoneId);
  };

  useEffect(() => {
    fetchVacation();
    fetchSuggestedRequests();
    handleFriendRequest();
    handleAcceptFriendRequest();
    handleFetchFriendRequest();
    getUser();
  }, []);

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
          {(vacation.participants?.includes(user?._id) ||
            user?._id === vacation.user?._id) && (
            <PostForm
              user={user}
              handlePostSubmit={handlePostSubmit}
              handleFileChange={handleFileChange}
              posting={posting}
              errMsg={errMsg}
              setFile={setFile}
              file={file}
              milestones={vacation.milestones}
              startDate={vacation.startDate}
              endDate={vacation.endDate}
            />
          )}

          <div className='bg-first px-4 py-4 rounded-xl text-ascent-1'>
            <div className='text-2xl font-bold'>{vacation.title}</div>
            <div>{vacation.description}</div>
            <div>
              {moment(vacation.startDate).format('DD/MM/YYYY')} -
              {moment(vacation.endDate).format('DD/MM/YYYY')}
            </div>
            <div>Participants: {vacation.participants?.length}</div>
          </div>
          {Array.isArray(vacation.milestones) &&
            vacation.milestones.map((milestone) => (
              <div>
                <div
                  key={milestone._id}
                  className='text-ascent-1 grid grid-cols-3 items-center py-4'
                >
                  <hr className='text-ascent-1 ' />
                  <div className='text-center'>
                    <p className='text-2xl flex font-bold my-0 items-center justify-center gap-2'>
                      {moment(milestone.date).format('DD/MM/YYYY')}
                      {user._id == vacation.user._id && (
                        <button
                          onClick={() => confirmDeleteMilestone(milestone._id)}
                        >
                          <MdDelete className='h-4' />
                        </button>
                      )}
                    </p>
                    <p> {milestone.description}</p>
                  </div>
                  <hr className='text-ascent-1' />
                </div>

                {Array.isArray(milestone.posts) &&
                  milestone.posts.map((post) => (
                    <PostCard
                      user={user}
                      key={post._id}
                      content={post.content}
                      description={post.description}
                      date={post.date}
                      post={post}
                      vacation={vacation}
                      likePost={handleLikePost}
                      fetchVacation={fetchVacation}
                      updatePost={updatePost}
                      deletePost={handleDeletePost}
                    />
                  ))}
              </div>
            ))}
          {user?._id === vacation.user?._id && (
            <Button
              type='primary'
              className='bg-[#0d6efd]'
              icon={<PlusOutlined />}
              onClick={() => setAddMilestoneModalVisible(true)}
            >
              Add Milestone
            </Button>
          )}
        </div>

        {updateModalOpen && (
          <UpdatePostModal
            user={user}
            errMsg={errMsg}
            // post={selectedPost}
            updatePost={updatePost}
            onClose={() => setUpdateModalOpen(false)}
            // initialFile={selectedPost.image[0]}
            // initialDescription={selectedPost.description}
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

      <Modal
        title='Add Milestone'
        visible={addMilestoneModalVisible}
        onCancel={() => {
          form.resetFields();
          setAddMilestoneModalVisible(false);
        }}
        footer={null}
        destroyOnClose={true}
      >
        {/* Form for adding a milestone */}
        <Form onFinish={handleAddMilestone}>
          <Form.Item
            label='Date'
            name='date'
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
            rules={[{ required: true, message: 'Please enter a description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button className='bg-[#0d6efd]' htmlType='submit'>
              Add Milestone
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vacation;
