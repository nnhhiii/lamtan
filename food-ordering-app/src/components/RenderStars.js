  import StarRoundedIcon from '@mui/icons-material/StarRounded';
  import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
  import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';

  const RenderStars = ({rating}) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarRoundedIcon key={`full-${i}`} sx={{ color: '#FFD700' }} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalfRoundedIcon key="half" sx={{ color: '#FFD700' }} />);
    }

    while (stars.length < 5) {
      stars.push(<StarOutlineRoundedIcon key={`empty-${stars.length}`} sx={{ color: '#FFD700' }} />);
    }

    return stars;
  };
export default RenderStars;