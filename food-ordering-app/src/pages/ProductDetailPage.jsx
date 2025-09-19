import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getProductDetail, addToCart, getCategories, getRatingsByProductId, } from '../api/api';
import { Box, Typography, Avatar } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';
import ProductList from "../components/ProductList";
import RenderStars from "../components/RenderStars";
import DialogSelectVariant from "../components/DialogSelectVariant";
import Loading from "../components/Loading";
import DialogReviewImage from "../components/DialogReviewImage"

const ProductDetail = ({ showSnackbar }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const thumbnailRefs = useRef([]); // Tham chiếu ảnh nhỏ
  const thumbnailContainerRef = useRef(null);
  const mainImageScrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Index của ảnh lớn hiện tại
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProductDetail(id);
        const categoriesData = await getCategories();
        const ratingsData = await getRatingsByProductId(id);
        setCategories(categoriesData);
        setProduct(productData);
        setRatings(ratingsData);

        if (ratingsData.length) {
          const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          ratingsData.forEach(r => dist[r.rating]++);
          Object.keys(dist).forEach(star => {
            dist[star] = Math.round((dist[star] / ratingsData.length) * 100);
          });
          setDistribution(dist);
        }
      } catch (err) {
        showSnackbar(err.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showSnackbar]);

  const onAddToCart = async (productId, variantId = null, quantity = 1) => {
    try {
      const res = await addToCart({ productId, variantId, quantity });
      showSnackbar(res.message, "success");
    } catch (err) {
      showSnackbar(err.response?.data?.message, "error");
    }
  };

  const category = categories.find(c => c._id === product?.category);

  // Gộp ảnh: product.images + tất cả variant.images
  const allImages = [
    ...(product?.images || []),
    ...((product?.variants || []).flatMap(variant => variant.images || []))
  ];

  // Map mỗi ảnh sang 1 object chứa source và index
  const imageObjects = allImages.map((img, idx) => ({
    src: img,
    index: idx
  }));
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, imageObjects.length);
  }, [imageObjects.length]);


  const scrollToThumbnail = (index) => {
    const container = thumbnailContainerRef.current; // ref tới div chứa thumbnail
    const thumbNode = thumbnailRefs.current[index];

    if (container && thumbNode) {
      container.scrollTo({
        left: thumbNode.offsetLeft - container.clientWidth / 2 + thumbNode.clientWidth / 2,
        behavior: "smooth"
      });
    }
  };


  const scrollToMainImage = (index) => {
    const node = mainImageScrollRef.current;
    if (node) {
      node.scrollTo({ left: index * node.clientWidth, behavior: 'smooth' });
      setCurrentIndex(index);
      scrollToThumbnail(index);
    }
  };

  const handleArrowClick = (direction) => {
    const newIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      imageObjects.length - 1
    );
    setCurrentIndex(newIndex);
    scrollToMainImage(newIndex);
  };

  let scrollRafId = null;
  const handleMainImageScroll = () => {
    if (scrollRafId) cancelAnimationFrame(scrollRafId);

    scrollRafId = requestAnimationFrame(() => {
      const node = mainImageScrollRef.current;
      if (node) {
        const newIdx = Math.round(node.scrollLeft / node.clientWidth);
        if (newIdx !== currentIndex) {
          setCurrentIndex(newIdx);
          scrollToThumbnail(newIdx);
        }
      }
    });
  };

  // Nếu có variant => lấy min price
  const minVariantPrice = product?.variants?.length
    ? Math.min(...product.variants.map(v => Number(v.price) || 0))
    : null;


  const productFields = [
    { label: 'Mã sản phẩm', key: 'id' },
    { label: 'Xuất xứ', key: 'origin' },
    { label: 'Thành phần', key: 'ingredients' },
    { label: 'Hạn sử dụng', key: 'expiredDay' },
    { label: 'Bảo quản', key: 'preservation' },
    { label: 'Hướng dẫn sử dụng', key: 'instruction' },
  ];

  if (loading) {
    return (
      <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: { xs: '80px 0', md: '100px', lg: '100px 150px' }, display: 'flex', flexDirection: 'column', gap: 3, mt: 5 }}>
        {/* Tổng 2 Box ảnh trái và chi tiết phải */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 3 }}>
          {/* Box trái*/}
          <Box
            sx={{
              width: { xs: 1, md: '550px' },
              height: 'fit-content',
              p: '20px 50px',
              borderRadius: 3,
              bgcolor: 'background.paper',
              flex: '0 0 550px', // Chiều rộng cố định
              position: { xs: 'relative', md: 'sticky' },
              top: { xs: '0', md: '130px' }, // Khoảng cách so với top khi sticky
              alignSelf: 'flex-start'
            }}>
            {/* Ảnh lớn */}
            <Box sx={{ position: 'relative', width: { xs: 1, md: '450px' }, overflow: 'hidden' }}>
              {/* Khu vực ảnh lớn cuộn ngang */}
              <Box
                ref={mainImageScrollRef}
                sx={{
                  display: 'flex',
                  scrollSnapType: 'x mandatory',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                  width: 1,
                  height: { xs: '450px', md: '350px', lg: '520px' },
                }}
                onScroll={handleMainImageScroll}
              >
                {/* Arrow trái */}
                <Box
                  onClick={() => handleArrowClick(-1)}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    p: 1,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: { xs: 'none', md: currentIndex > 0 ? 'flex' : 'none' },
                  }}
                >
                  <ArrowBackIosNewIcon />
                </Box>

                {imageObjects.map((imgObj, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundImage: `url(${imgObj.src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      width: 1,
                      scrollSnapAlign: 'start',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Box>

              {/* Arrow phải */}
              <Box
                onClick={() => handleArrowClick(1)}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  color: 'white',
                  p: 1,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: { xs: 'none', md: currentIndex < imageObjects.length - 1 ? 'flex' : 'none' },
                }}
              >
                <ArrowForwardIosIcon />
              </Box>
            </Box>


            {/* Ảnh nhỏ (gộp cả product & variant) */}
            <Box
              ref={thumbnailContainerRef}
              sx={{
                display: 'flex',
                mt: 2,
                flexWrap: 'nowrap',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {imageObjects.map((imgObj, index) => (
                <Box
                  key={index}
                  ref={el => (thumbnailRefs.current[index] = el)}
                  onClick={() => scrollToMainImage(index)}
                  sx={{
                    backgroundImage: `url(${imgObj.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: 2,
                    mr: 1,
                    flexShrink: 0,
                    cursor: 'pointer',
                    border: currentIndex === index ? '2px solid #B12024' : '0',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Box thông tin chi tiết phải*/}
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 3, }}>
            {/* Box 1 */}
            <Box sx={{ bgcolor: 'background.paper', p: '20px 30px', borderRadius: 3 }}>
              <Typography gutterBottom sx={{ color: 'text.primary', fontSize: '28px', fontWeight: 450 }}>{product?.name}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography gutterBottom sx={{ color: 'text.primary' }}>Loại: </Typography>
                <Typography
                  gutterBottom
                  sx=
                  {{
                    color: 'text.fourth',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`${ROUTES.PRODUCTSBYCATEGORY}/${category._id}`)}
                >
                  {category?.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RenderStars rating={(product?.averageRating || 0)} />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({product?.totalRatings || 0} lượt đánh giá) |
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  {product?.quantitySold || 0} đã bán
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    sx={{ fontWeight: 550, fontSize: '35px', color: 'secondary.light', mr: 2 }}
                  >
                    {(() => {
                      // Giá cơ bản: ưu tiên selectedVariant, sau đó minVariantPrice, sau đó product.price
                      const basePrice = selectedVariant?.price ?? minVariantPrice ?? product?.price ?? 0;
                      const discount = selectedVariant?.discount ?? product?.discount;

                      let finalPrice = Number(basePrice);

                      if (typeof discount === 'string' && discount.includes('%')) {
                        const percent = parseFloat(discount.replace('%', '')) || 0;
                        finalPrice = basePrice - (basePrice * percent / 100);
                      } else if (!isNaN(discount)) {
                        finalPrice = basePrice - Number(discount);
                      }

                      return `${finalPrice.toLocaleString('vi-VN')} đ`;
                    })()}
                  </Typography>


                  {/* Hiển thị giá */}
                  {!isNaN(selectedVariant?.price || minVariantPrice || product?.price) && (
                    <Typography
                      sx={{
                        fontWeight: 550,
                        fontSize: '20px',
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                        mr: 2
                      }}
                    >
                      {Number(selectedVariant?.price || minVariantPrice || product?.price).toLocaleString('vi-VN')} đ
                    </Typography>
                  )}


                  {(selectedVariant?.discount || product?.discount) !== 0 && (
                    <Typography
                      sx={{
                        fontWeight: 550,
                        fontSize: '20px',
                        color: 'white',
                        bgcolor: '#DA2032',
                        p: 0.5,
                        borderRadius: 2
                      }}
                    >
                      {(() => {
                        const discount = selectedVariant?.discount ?? product?.discount;

                        if (typeof discount === 'string' && discount.includes('%')) {
                          return `-${discount}`;
                        }

                        if (!isNaN(discount) && Number(discount) > 999) {
                          return `-${Number(discount).toLocaleString('vi-VN')}đ`;
                        }

                        return `-${discount}đ`;
                      })()}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    bgcolor: product?.isAvailable ? '#61AB12' : '#959595ff',
                    p: '10px 25px',
                    borderRadius: 2,
                    color: 'white',
                    display: product?.isAvailable ? 'none' : 'block'
                  }}
                >
                  {product?.isAvailable ? 'còn hàng' : 'Hết hàng'}
                </Box>
              </Box>

              {/* Variants */}
              <Box sx={{ display: 'flex', overflowX: 'auto', maxWidth: 1 }}>
                {product?.variants?.map((variant, variantIndex) => {
                  const hasImage = variant.images?.length > 0;
                  const targetImage = variant.images?.[0];

                  // Tìm index của targetImage trong allImages
                  const scrollIndex = imageObjects.findIndex(img => img.src === targetImage);
                  const isSelected = selectedVariant === variant;

                  return (
                    <Box
                      key={variantIndex}
                      onClick={() => {
                        scrollToMainImage(scrollIndex);
                        setSelectedVariant(variant); // lưu variant được click
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        m: '20px 10px 20px 0',
                        border: isSelected ? '2px solid #B12024' : '1px solid lightgray',
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer'
                      }}
                    >
                      {hasImage && (
                        <Box
                          sx={{
                            backgroundImage: `url(${targetImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '35px',
                            height: '30px',
                            mr: 1,
                            borderRadius: 1
                          }}
                        />
                      )}
                      <span>{variant.name}</span>
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <DialogSelectVariant
                    product={product}
                    onAddToCart={onAddToCart}
                    mode="addToCart"
                  />
                  <DialogSelectVariant
                    product={product}
                    onAddToCart={onAddToCart}
                    mode="buyNow"
                  />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                bottom: 0,
                bgcolor: { xs: 'background.paper' },
                width: 1,
                zIndex: 1,
                boxShadow: '0 -1px 5px #0000001f',
                justifyContent: 'flex-end'
              }}
            >
              <Box>
                <DialogSelectVariant
                  product={product}
                  onAddToCart={onAddToCart}
                  mode="addToCart"
                />
                <DialogSelectVariant
                  product={product}
                  onAddToCart={onAddToCart}
                  mode="buyNow"
                />
              </Box>
            </Box>
            {/* Box 2 */}
            <Box sx={{ bgcolor: 'background.paper', p: '20px 30px', borderRadius: 3 }}>
              <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '22px', mb: 2 }}>
                Thông tin chi tiết
              </Typography>
              {productFields.map(({ label, key }) => {
                const value = product?.[key];
                if (value === 'null' || value === "") return null;
                return (
                  <Box key={key} sx={{ display: 'flex', borderBottom: '1px solid #F2F4F5', p: '10px 5px' }}>
                    <Typography sx={{ color: 'text.secondary', width: 1 / 4 }}>{label}</Typography>
                    <Typography sx={{ color: 'text.primary', width: 3 / 4 }}>{value}</Typography>
                  </Box>
                );
              })}
            </Box>
            {/* Box 3 */}
            <Box sx={{ bgcolor: 'background.paper', p: '20px 30px', borderRadius: 3 }}>
              <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '22px', mb: 2 }}>Mô tả sản phẩm</Typography>
              <Typography sx={{ color: 'text.primary', mt: -1 }} dangerouslySetInnerHTML={{ __html: product?.description }}></Typography>
            </Box>
          </Box>
        </Box>



        {/* Đánh giá */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: { xs: '20px', md: '30px 50px' } }}>
          <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '22px', mb: 2 }}>Đánh giá sản phẩm</Typography>
          {/* Tổng 2 Box đánh giá và % */}
          <Box sx={{ display: 'flex' }}>

            {/* Box đánh giá trái*/}
            <Box sx={{ width: 1.5 / 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography sx={{ fontSize: '45px', fontWeight: 600 }}>
                  {product?.averageRating ? parseFloat(product.averageRating.toFixed(1)) : 0}
                </Typography>
                <Typography sx={{ fontSize: '25px', fontWeight: 500 }}>/5</Typography>
              </Box>
              <Box sx={{ alignItems: 'center', mb: 1 }}>
                <RenderStars rating={(product?.averageRating || 0)} />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({product?.totalRatings || 0} đánh giá)
              </Typography>
            </Box>

            {/* Box % phải*/}
            <Box sx={{ width: { xs: 2.5 / 4, md: 2 / 4 } }}>
              {[5, 4, 3, 2, 1].map(star => (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ width: '60px', textAlign: 'center' }}>{star} sao</Typography>
                  <Box sx={{ flexGrow: 1, height: '7px', bgcolor: '#F1F4F5', borderRadius: 2 }}>
                    <Box sx={{
                      width: `${distribution[star]}%`,
                      height: '100%',
                      bgcolor: '#FFD600',
                      borderRadius: 2
                    }} />
                  </Box>
                  <Typography sx={{ width: '60px', textAlign: 'center' }}>{distribution[star]}%</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ borderBottom: '1px solid lightgray', flexGrow: 1, mt: 5, mb: 1 }} />

          {/* item đánh giá */}
          <Box sx={{ flexGrow: 1 }}>
            {ratings && ratings.length > 0 ? (
              ratings.map((r, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,

                  }}
                >
                  {/* User + Time */}
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Avatar
                      src={r.user?.image ? `${r.user?.image}` : ""}
                      variant="circle"
                      sx={{ width: 35, height: 35, mr: 1 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {r.user?.username || 'Người dùng ẩn danh'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(r.createdAt))}
                      </Typography>
                    </Box>
                    {r.updatedAt && (
                      <Typography variant="caption" color="text.secondary" >
                        Chỉnh sửa lúc: {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(r.updatedAt))}
                      </Typography>
                    )}
                  </Box>

                  {/* Sao đánh giá */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <RenderStars rating={(r.rating || 0)} />
                  </Box>

                  {/* Nội dung bình luận */}
                  {r.comment && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {r.comment}
                    </Typography>
                  )}
                  <DialogReviewImage images={r.images} />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có đánh giá nào
              </Typography>
            )}
          </Box>
        </Box>


        {/* Sản phẩm liên quan */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: { xs: '20px', md: '30px 50px' } }}>
          <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '22px', mb: { xs: 0, md: 2 } }}>Gợi ý cho bạn</Typography>
          <Box sx={{ borderBottom: '1px solid lightgray', flexGrow: 1, mt: { xs: 2, md: 4 }, mb: 4 }} />
          <ProductList />
        </Box>
      </Box>
    </>
  );
};

export default ProductDetail;
