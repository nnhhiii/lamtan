// import { useEffect, useState } from 'react';
// import { View, Text, ScrollView, ImageBackground, Image, TouchableOpacity, Button } from 'react-native';
// import { useRouter } from 'expo-router';
// import { getPostCategories } from '@/api/api';
// import ProductList from '@/components/ProductList';
// import CategoryList from '@/components/CategoryList';
// import PostFoodList from '@/components/PostFoodList';
// import Partner from '@/components/Partner';
// import Client from '@/components/Client';
// import Milestone from '@/components/Milestone';

// export default function HomeScreen({ aboutData }) {
//   const router = useRouter();
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await getPostCategories();
//         if (res.length > 1) setCategories(res);
//       } catch (error) {
//         console.error('Failed to fetch posts:', error);
//       }
//     };
//     fetchPosts();
//   }, []);

//   return (
//     <ScrollView style={{ flex: 1 }}>
//       {/* Banner */}
//       <ImageBackground
//         source={require('@/assets/bg2.jpg')}
//         style={{ height: 350, justifyContent: 'center', alignItems: 'center' }}
//       >
//         <View style={{ backgroundColor: 'rgba(0,0,0,0.18)', padding: 20 }}>
//           <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
//             WELCOME TO LAM TAN
//           </Text>
//         </View>
//       </ImageBackground>

//       {/* About */}
//       <View style={{ padding: 16, backgroundColor: 'white', marginVertical: 20 }}>
//         <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>Giới thiệu</Text>
//         <Text style={{ fontSize: 16, marginBottom: 8 }}>Về {aboutData?.name}</Text>
//         <Text numberOfLines={11} style={{ fontSize: 14, marginBottom: 8 }}>
//           {aboutData?.description || ''}
//         </Text>
//         <TouchableOpacity onPress={() => router.push('/about')}>
//           <Text style={{ textDecorationLine: 'underline', color: 'blue', fontSize: 16 }}>Xem thêm</Text>
//         </TouchableOpacity>
//         <Image source={require('@/assets/pizza.jpg')} style={{ width: '100%', height: 200, marginTop: 16 }} />
//       </View>

//       <Milestone />
//       <Partner />
//       <Client />

//       {/* Products */}
//       <View style={{ padding: 16, backgroundColor: 'white', marginBottom: 20 }}>
//         <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'blue', textAlign: 'center' }}>Sản phẩm</Text>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
//           Những mặt hàng nổi bật của Lam Tân
//         </Text>
//         <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
//           Chúng tôi chuyên cung cấp các sản phẩm đông lạnh: khoai tây, phô mai, thịt, trái cây, mì Ý, nui, sốt cà,…
//         </Text>

//         <CategoryList />
//         <ProductList />

//         <Button title="Xem thêm" onPress={() => router.push('/products')} />
//       </View>

//       {/* Why choose us */}
//       <ImageBackground
//         source={require('@/assets/pasta.jpg')}
//         style={{ height: 250, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}
//       >
//         <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white', textAlign: 'center' }}>Tại sao nên chọn Lam Tân</Text>
//         <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white', textAlign: 'center', marginBottom: 8 }}>
//           Hãy đặt hàng ngay hôm nay để nhận ưu đãi mới nhất
//         </Text>
//         <Button title="Mua ngay" onPress={() => router.push('/products')} />
//       </ImageBackground>

//       {/* Posts */}
//       <View style={{ padding: 16, backgroundColor: 'white', marginBottom: 20 }}>
//         <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'blue', textAlign: 'center' }}>Bài viết</Text>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
//           Những bài viết gần đây của Lam Tân
//         </Text>

//         <PostFoodList />
//         {/* Bạn có thể thêm button navigation */}
//       </View>
//     </ScrollView>
//   );
// }
