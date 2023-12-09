import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { useForm } from 'react-hook-form';
import TextInput from '../TextInput';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import FriendListDropdown from '../FriendListDropdown';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
// import { Option } from 'antd/es/mentions';

const VacationModal = ({
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showFriendDropdown, setShowFriendDropdown] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [visibility, setVisibility] = useState('isPublic');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [milestones, setMilestones] = useState([
    { date: null, description: null },
  ]);

  const handleRemoveFile = (index) => {
    const updatedFiles = [...file];
    updatedFiles.splice(index, 1);
    setFile(updatedFiles);
  };

  const handleParticipantChange = (value) => {
    setParticipants(value);
  };

  const handleRemoveMilestone = (index) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);
    setMilestones(updatedMilestones);
  };

  const handleMilestoneDateChange = (index, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].date = value;
    setMilestones(updatedMilestones);
  };

  const handleMilestoneDescriptionChange = (index, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].description = value;
    setMilestones(updatedMilestones);
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, { date: null, description: null }]);
  };
  const { Option } = Select;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    if (file.length === 0 || !visibility) {
      setOpen(false);
      return;
    }
    setConfirmLoading(true);
    try {
      const data = await handleSubmit((formData) => {
        handlePostSubmit(
          formData,
          selectedFriends,
          participants,
          visibility,
          startDate,
          endDate,
          milestones,
        );
      })();
      reset();
      setFile([]);
      setVisibility(null);
      setParticipants([]);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setFile([]);
    setVisibility(null);
    setOpen(false);
  };

  const handleVisibilityChange = (value) => {
    setVisibility(value);
    setShowFriendDropdown(value === 'isFriends');
  };

  return (
    <div>
      <Button
        onClick={showModal}
        className='border-none bg-[#F2F3F5] w-full h-[3rem] text-left'
      >
        Share your experience!
      </Button>
      <Modal
        title='Share your experience'
        open={open}
        onOk={handleOk}
        okButtonProps={{
          className: 'custom-ok-button',
          disabled: file.length === 0,
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={window.innerWidth < 768 ? '100%' : '50%'}
        centered={true}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <>
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className='bg-first px-4 rounded-lg '
          >
            <div className='w-full items-center gap-2 py-4'>
              <div className='flex gap-4'>
                <div>
                  <img
                    src={user?.avatar}
                    alt={user.username}
                    className='w-16 h-16 object-cover rounded-full'
                  />
                </div>
                <div className='w-full flex flex-col gap-2'>
                  <div className=' font-medium text-lg text-ascent-1'>
                    {user.username}
                  </div>
                  <div className='flex gap-2'>
                    <Select
                      className='w-1/2'
                      placeholder='Select post visibility'
                      onChange={handleVisibilityChange}
                      value={visibility}
                    >
                      <Option value='isPublic'>Public</Option>
                      <Option value='isPrivate'>Private</Option>
                      <Option value='isFriends'>Friends</Option>
                    </Select>
                    {showFriendDropdown && (
                      <div className='w-full'>
                        <FriendListDropdown
                          friends={user.friends}
                          onSelectFriend={(selectedFriends) => {
                            setSelectedFriends(selectedFriends);
                          }}
                          selectedFriends={selectedFriends}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex gap-4 items-center'>
                <div className='flex gap-4 w-2/3'>
                  <input
                    type='date'
                    placeholder='Start Date'
                    {...register('startDate', {
                      required: 'Start Date is required',
                    })}
                    onChange={(e) => {
                      setValue('startDate', e.target.value, {
                        shouldValidate: true,
                      });
                      setStartDate(e.target.value);
                    }}
                    className='w-full py-3 px-2 rounded-md mt-2 border border-ascent-2'
                  />

                  <input
                    type='date'
                    placeholder='End Date'
                    {...register('endDate', {
                      required: 'End Date is required',
                    })}
                    onChange={(e) => {
                      setValue('endDate', e.target.value, {
                        shouldValidate: true,
                      });
                      setEndDate(e.target.value);
                    }}
                    className='w-full py-2 px-2 rounded-md mt-2 border border-ascent-2'
                  />
                </div>

                <FloatingLabel
                  controlId='floatingLocation'
                  label='Location'
                  className='mt-2 py-0'
                >
                  <Form.Control
                    type='text'
                    placeholder='Location'
                    {...register('location', {
                      required: 'Location is required!',
                    })}
                    className='rounded-md border w-full'
                  />
                </FloatingLabel>
              </div>
              <ul className='flex my-4 gap-4'>
                {file &&
                  file.map((selectedFile, index) => (
                    <li key={index} className='relative'>
                      <img
                        className='h-20 w-20'
                        src={URL.createObjectURL(selectedFile)}
                        alt={`Selected Image ${index}`}
                      />
                      <button
                        type='button'
                        className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                        onClick={() => handleRemoveFile(index)}
                      >
                        x
                      </button>
                    </li>
                  ))}
              </ul>

              <div className='mt-2'>
                <Select
                  mode='multiple'
                  placeholder='Select participants'
                  onChange={handleParticipantChange}
                  value={participants}
                  className='w-full my-2 '
                >
                  {user?.friends &&
                    user.friends.map((friend) => (
                      <Option key={friend._id} value={friend._id}>
                        {friend.username}
                      </Option>
                    ))}
                </Select>
              </div>

              <FloatingLabel
                controlId='floatingVacationTitle'
                label='Title'
                className='mb-3'
              >
                <Form.Control
                  type='text'
                  placeholder='Title'
                  {...register('title', {
                    required: 'Title is required!',
                  })}
                  className='rounded-md border w-full'
                />
              </FloatingLabel>

              <FloatingLabel
                controlId='floatingVacationDescription'
                label='Description'
                className='mb-3'
              >
                <Form.Control
                  type='text'
                  placeholder='Description'
                  {...register('description', {
                    required: 'Write something about your vacation',
                  })}
                  className='rounded-md border w-full'
                />
              </FloatingLabel>
            </div>

            <div className='flex flex-col gap-4 items-center'>
              {milestones.map((milestone, index) => (
                <div key={index} className='w-2/3'>
                  <input
                    type='date'
                    placeholder={`Milestone Date ${index + 1}`}
                    onChange={(e) =>
                      handleMilestoneDateChange(index, e.target.value)
                    }
                    min={startDate}
                    max={endDate}
                    className='w-full py-3 px-2 rounded-md mt-2 border border-ascent-2'
                  />
                  <input
                    type='text'
                    placeholder={`Milestone Description ${index + 1}`}
                    onChange={(e) =>
                      handleMilestoneDescriptionChange(index, e.target.value)
                    }
                    className='w-full py-2 px-2 rounded-md mt-2 border border-ascent-2'
                  />
                  <button
                    type='button'
                    className='mt-2 text-red-500'
                    onClick={() => handleRemoveMilestone(index)}
                  >
                    Remove Milestone
                  </button>
                </div>
              ))}
              <button
                type='button'
                className='mt-2'
                onClick={handleAddMilestone}
              >
                Add Milestone
              </button>
            </div>

            {errMsg?.message && (
              <span
                role='alert'
                className={`text-sm ${
                  errMsg?.status === 'failed'
                    ? 'text-[#f64949fe]'
                    : 'text-[#2ba150fe]'
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            <div className='border border-[#66666645] px-2 py-2 rounded-lg'>
              <label
                htmlFor='imgUpload'
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
              >
                <input
                  type='file'
                  onChange={handleFileChange}
                  className='hidden'
                  id='imgUpload'
                  data-max-size='5120'
                  accept='*'
                  multiple
                />
                <div className='flex items-center justify-between w-full'>
                  <div>Add to your post: </div>

                  <span className='flex gap-3'>
                    <BiImages className='h-[1.5rem] w-[1.5rem]' />
                    <span>Image/video</span>
                  </span>
                </div>
              </label>
            </div>
          </form>
        </>
      </Modal>
    </div>
  );
};

export default VacationModal;
