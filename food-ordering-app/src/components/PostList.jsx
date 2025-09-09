import React, { useEffect, useState } from 'react';
import { getPosts } from '../api/api';
import PostItem from './PostItem';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box } from '@mui/material';
import Loading from './Loading';



const PostList = () => {
  const [posts, setPosts] = useState([]);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const slidesToShow = 3;
  const showArrowsAndDots = posts.length > slidesToShow;

  const settings = {
    dots: showArrowsAndDots,
    infinite: showArrowsAndDots,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: showArrowsAndDots,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: posts.length > 2,
          arrows: posts.length > 2,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: posts.length > 2,
          arrows: posts.length > 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: posts.length > 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Box sx={{ px:{ xs: '20px', md: '100px', lg:'180px'}, }}>
      {posts.length === 0 ? (
        <Loading/>
      ) : (
        <Slider {...settings}>
          {posts.slice(0, 9).map((post) => (
            <Box key={post._id} px={2}>
              <PostItem post={post} />
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default PostList;
