import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const PostImage = ({ post }) => {
  return (
    <div className='h-[30rem] mb-8 w'>
      {Array.isArray(post.image) ? (
        <Carousel>
          {post.image.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className='h-[30rem] w-full object-cover mx-auto'
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>post.image is not an array</p>
      )}
    </div>
  );
};

export default PostImage;
