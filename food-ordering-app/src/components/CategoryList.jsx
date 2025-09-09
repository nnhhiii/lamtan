import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/api';
import CategoryItem from './CategoryItem';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box } from '@mui/material';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const slidesToShow = 4;
  const showArrowsAndDots = categories.length > slidesToShow;

  const settings = {
    dots: showArrowsAndDots,
    infinite: showArrowsAndDots,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: showArrowsAndDots,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: categories.length > 3,
          arrows: categories.length > 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: categories.length > 3,
          arrows: false
        },
      },
    ],
  };

  return (
    <Box sx={{ p: {xs:2, md:3,xl:4}, width: {xs:'1',md: '800px'}, mx:'auto' }}>
        
      {categories.length === 0 ? (
        <p>Đang tải bài viết...</p>
      ) : (
        <Slider {...settings}>
          {categories.map((category) => (
            <Box key={category._id} px={1}>
              <CategoryItem category={category} />
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default CategoryList;
