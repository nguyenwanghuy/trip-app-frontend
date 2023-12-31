import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Tabs } from 'antd';
import { Link, useParams } from 'react-router-dom';
import UseFunction from '../Function/UseFunction';
import { useSelector } from 'react-redux';
import { apiRequest, handleTokenRefresh } from '../../utils';
import Loading from '../Loading';
import AlbumInfo from './ImageDetails/AlbumInfo';

const { TabPane } = Tabs;

const ImagesProfile = ({ UserId, userInfo }) => {
  const { user } = useSelector((state) => state.user);

  const { albums } = useSelector((state) => state.album);
  const { handleLikePost, fetchAlbum, handleDeletePost } = UseFunction();
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetchAlbum();
  }, []);

  const userAlbums = Array.isArray(albums)
    ? albums.filter((album) => album.user._id === userInfo._id)
    : [];

  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId);
  };

  return (
    <Spin spinning={loading}>
      <Tabs defaultActiveKey='1' className='bg-ascent-3 px-4 py-4'>
        <TabPane tab='Albums' key='1'>
          <div className='grid grid-cols-5 gap-4'>
            {user._id === userInfo?._id && (
              <div>
                <Link to='/trip/create-album' className='text-decoration-none'>
                  <Card className='h-full flex items-center justify-center'>
                    <div className='text-6xl rounded-full w-20 h-20 text-ascent-2 border-ascent-2 border-dashed border-4'>
                      +
                    </div>
                  </Card>
                </Link>
              </div>
            )}
            {userAlbums
              .filter((album) => album.viewers.includes(user._id))
              .map((album) => (
                <Col key={album._id}>
                  <div onClick={() => handleAlbumClick(album._id)}>
                    <Card>
                      <div>
                        <img
                          src={album.images[0].url}
                          alt={`Cover Image for ${album.albumName}`}
                          className='w-full h-40'
                        />
                      </div>
                      <p className='font-semibold pt-4'>{album.albumName}</p>
                    </Card>
                  </div>
                </Col>
              ))}
          </div>
        </TabPane>
      </Tabs>

      {selectedAlbum && <AlbumInfo selectedAlbum={selectedAlbum} />}
    </Spin>
  );
};

export default ImagesProfile;
