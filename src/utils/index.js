import axios from 'axios';
import { SetPosts } from '../redux/postSlice.js';
import { SetAlbums } from '../redux/albumSlice.js';
import { SetVacations } from '../redux/vacationSlice.js';

const API_URL = 'http://localhost:8001/trip';

export const API = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API({
      url: url,
      method: method || 'GET',
      withCredentials: true,
      data: data,

      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleFileUpload = async (uploadFile) => {
  try {
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('upload_preset', 'socialmedia');

    const response = await axios({
      method: 'post',
      url: 'https://api.cloudinary.com/v1_1/dmlc8hjzu/image/upload/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
export const handleAvatarUpload = async ({ file, token }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post('/user/upload-avatar', formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    if (response.data.message === 'Uploading avatar successfully') {
      return response.data.avatar;
    } else {
      console.error('Avatar upload failed');
      return null;
    }
  } catch (error) {
    console.error('Avatar upload error:', error);
    return null;
  }
};
//giong post

export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || '/post',
      token,
      method: 'GET',
      data: data || {},
    });
    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPostsByPage = async (token, dispatch, page, pageSize) => {
  try {
    const res = await apiRequest({
      url: `/post?page=${page}&pageSize=${pageSize}`,
      token,
      method: 'GET',
    });

    dispatch(SetPosts(res?.data.posts));
    setTotalPages(res?.data.totalPages);
    setCurrentPage(page);
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async ({ uri, token }) => {
  try {
    console.log(uri);
    const res = await apiRequest({
      url: uri,
      token,
      method: 'POST',
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await apiRequest({
      url: '/post/' + id,
      token,
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
//end
export const getUserInfo = async (token) => {
  try {
    const res = await apiRequest({
      url: 'auth/me',
      token: token,
      method: 'GET',
    });

    if (res.message === 'jwt expired') {
      localStorage.removeItem('user');
      window.location.replace('/login');
    }
    return res.userInfo;
  } catch (error) {
    console.log(error);
  }
};

export const searchUser = async (token, query) => {
  try {
    const res = await apiRequest({
      url: `/user/search/s?u=${query}`,
      token,
      method: 'GET',
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendFriendRequest = async (token, id) => {
  try {
    const res = await apiRequest({
      url: `/test/friend-request`,
      token: token,
      method: 'POST',
      data: { requestTo: id },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAlbums = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || '/album',
      token,
      method: 'GET',
      data: data || {},
    });
    dispatch(SetAlbums(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likeAlbums = async ({ uri, token }) => {
  try {
    const res = await apiRequest({
      url: uri,
      token,
      method: 'POST',
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAlbums = async (id, token) => {
  try {
    const res = await apiRequest({
      url: '/album/' + id,
      token,
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const fetchVacations = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || '/vacation',
      token,
      method: 'GET',
      data: data || {},
    });
    dispatch(SetVacations(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVacation = async (id, token) => {
  try {
    const res = await apiRequest({
      url: '/vacation/' + id,
      token,
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
