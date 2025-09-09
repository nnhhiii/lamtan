import React, { useEffect, useState } from 'react';
import { getPostCategories, getPostsByCategoryId } from '../api/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box } from '@mui/material';
import PostFoodItem from './PostFoodItem';
import Loading from './Loading';

const PostFoodList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categories = await getPostCategories();
        if (categories.length > 1) {
          const secondCategoryId = categories[2]._id; // lấy category thứ 2
          const data = await getPostsByCategoryId(secondCategoryId);
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,          // auto scroll
    autoplaySpeed: 2000,     
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <Loading />;

  return (
    <Box>
      <Slider {...settings}>
        {posts.slice(0, 7).map((post) => (
          <Box key={post._id}>
            <PostFoodItem post={post} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PostFoodList;
