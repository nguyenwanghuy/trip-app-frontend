import React from 'react';
import VacationModal from '../Modal/VacationModal';

const VacationForm = ({
  user,
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
  fileList,
  handleRemove,
}) => {
  return (
    <div>
      <div className='bg-first px-4 rounded-lg'>
        <div className='w-full flex items-center gap-2 py-4  border-[#66666645]'>
          <div>
            <img
              src={user.avatar}
              alt='User Image'
              className='w-14 h-14 rounded-full object-cover'
            />
          </div>

          <div className='w-full'>
            <VacationModal
              user={user}
              handlePostSubmit={handlePostSubmit}
              handleFileChange={handleFileChange}
              errMsg={errMsg}
              setFile={setFile}
              file={file}
              fileList={fileList}
              handleRemove={handleRemove}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationForm;
