import axios from 'axios';
import { SetPosts } from '../redux/postSlice.js';
import { SetAlbums } from '../redux/albumSlice.js';
import { SetVacations } from '../redux/vacationSlice.js';
import { jwtDecode } from 'jwt-decode';
const API_URL = 'https://trip-app-backend.onrender.com/trip'; // deploy
// const API_URL = 'http://localhost:8001/trip'; // config

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
    // console.log(result);
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
    // console.log(response);
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
export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
      url: `/post?page=${page}&pageSize=${pageSize}`,
      token,
      method: 'GET',
    });

    dispatch(SetPosts(res?.data.posts));
    // setTotalPages(res?.data.totalPages);
    // setCurrentPage(page);
    return;
  } catch (error) {
    console.log(error);
  }
};
export const likePost = async ({ uri, token }) => {
  try {
    // console.log(uri);
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
      url: '/post/' + id,
      token,
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
export const getUserInfo = async (token) => {
  try {
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
      url: `/test/friend-request`,
      token: token,
      method: 'POST',
      data: { requestTo: id },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAlbums = async (token, dispatch, uri, data) => {
  try {
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
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
    const res = await handleTokenRefresh({
      url: uri || '/vacation',
      token,
      method: 'GET',
      data: data || {},
    });
    // console.log(res);
    dispatch(SetVacations(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};
export const deleteVacation = async (id, token) => {
  try {
    const res = await handleTokenRefresh({
      url: '/vacation/' + id,
      token,
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const addMilestone = async (token, vacationId, milestoneData) => {
  try {
    const res = await handleTokenRefresh({
      url: `/vacation/milestones/${vacationId}`,
      token: token,
      data: milestoneData,
      method: 'POST',
    });
    return res.data;
  } catch (error) {
    console.error('Error adding milestone:', error);
    throw error;
  }
};

export const deleteMilestone = async (token, vacationId, milestoneId) => {
  try {
    const res = await handleTokenRefresh({
      url: `/vacation/milestones/${vacationId}/${milestoneId}`,
      token: token,
      method: 'DELETE',
    });
    return res.data;
  } catch (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
};

export const likeVacation = async ({ uri, token }) => {
  try {
    console.log(uri);
    const res = await handleTokenRefresh({
      url: uri,
      token,
      method: 'POST',
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// refresh Token
export const refreshToken = async () => {
  try {
    const res = await axios.post(
      "https://trip-app-backend.onrender.com/trip/auth/refresh",
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log(res);
    return res.data.token || null;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};
export const handleTokenRefresh = async (requestConfig) => {
  try {
    const { url, token, ...rest } = requestConfig;
    // console.log(requestConfig);
    let date = new Date();
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp < date.getTime() / 1000) {
      const newToken = await refreshToken();
      // console.log(newToken, 'new token');

      if (newToken) {
        const newRequestConfig = { ...requestConfig, token: newToken };
        return apiRequest({ url, ...newRequestConfig });
      } else {
        // localStorage.removeItem('user');
        // window.location.replace('/login');
        // throw new Error('Invalid token');
        console.log('error: Invalid token');
      }
    }

    return apiRequest({ url, token, ...rest });
  } catch (error) {
    console.error('Error handling token refresh:', error);
    throw error;
  }
};
