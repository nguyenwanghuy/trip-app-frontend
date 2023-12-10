import React, { useState } from 'react';

const MilestoneModal = ({ isOpen, onClose, onSubmit }) => {
  const [milestoneData, setMilestoneData] = useState({
    date: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMilestoneData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(milestoneData);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className='modal-content'>
        <h2>Add Milestone</h2>
        <label>Date:</label>
        <input
          type='text'
          name='date'
          value={milestoneData.date}
          onChange={handleChange}
        />
        <label>Description:</label>
        <textarea
          name='description'
          value={milestoneData.description}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default MilestoneModal;
