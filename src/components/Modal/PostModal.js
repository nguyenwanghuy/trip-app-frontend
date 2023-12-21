import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { useForm } from 'react-hook-form';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const PostModal = ({
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
  user,
  milestones,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleRemoveFile = (index) => {
    const updatedFiles = [...file];
    updatedFiles.splice(index, 1);
    setFile(updatedFiles);
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

  const handleMilestoneSelect = (value) => {
    setSelectedMilestone(milestones[value]);
  };

  const handleOk = async () => {
    if (file.length === 0 || !selectedMilestone) {
      setOpen(false);
      return;
    }
    setConfirmLoading(true);
    try {
      const data = await handleSubmit((formData) => {
        handlePostSubmit(formData, selectedMilestone);
      })();
      reset();
      setFile([]);
      setSelectedMilestone(null);
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
    setOpen(false);
    setSelectedMilestone(null);
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
        visible={open}
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
                </div>
              </div>

              <ul className='flex my-4 gap-4'>
                {file.map((selectedFile, index) => (
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
              <div className='w-full pb-3'>
                <Select
                  placeholder='Select a milestone'
                  onChange={(value) => handleMilestoneSelect(value)}
                  className='w-full'
                >
                  {Array.isArray(milestones) &&
                    milestones.map((milestone, index) => (
                      <Option key={index} value={index}>
                        {`Date: ${milestone.date}, Description: ${milestone.description}`}
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
                  {...register('content', {
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

export default PostModal;
