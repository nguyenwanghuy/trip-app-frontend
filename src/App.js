import { Outlet, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, Login, Profile, Register, ResetPassword, Search } from './pages';
import { userLogin } from './redux/userSlice';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Album from './components/details/ImageDetails/AlbumPost';
import Avatar from './components/details/ImageDetails/Avatar';
import PostDetail from './components/Post/PostDetail';
import AlbumInfo from './components/details/ImageDetails/AlbumInfo';
import { useTranslation, initReactI18next } from 'react-i18next';
import AlbumEdit from './components/details/ImageDetails/AlbumEdit';

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/trip/user/:id?' element={<Profile />} />
          <Route path='/trip/user/search/s/:query' element={<Search />} />
          <Route path='/trip/create-album' element={<Album />} />
          <Route path='/trip/sh-avatar' element={<Avatar />} />
          <Route path='/trip/post/:id' element={<PostDetail />} />
          <Route path='/trip/album/:id' element={<AlbumInfo />} />
          <Route path='/trip/album/edit/:id' element={<AlbumEdit />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
