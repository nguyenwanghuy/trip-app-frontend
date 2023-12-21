import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const FriendListDropdown = ({ friends, onSelectFriend, selectedFriends }) => {
  const handleSelectChange = (value) => {
    onSelectFriend(value);
  };

  return (
    <div className='friend-list-dropdown'>
      <Select
        mode='multiple'
        placeholder='Select friends'
        onChange={handleSelectChange}
        value={selectedFriends}
        className='w-full'
      >
        {friends.map((friend) => (
          <Option key={friend._id} value={friend._id}>
            {friend.username}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FriendListDropdown;
